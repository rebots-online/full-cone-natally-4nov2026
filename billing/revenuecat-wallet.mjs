import { digest, money } from './firebase-ledger.mjs';

// RevenueCat owns the balance. Stored intents and receipts record external
// effects; they are never summed to manufacture a second customer balance.
export function createRevenueCatWallet(environment, admin) {
  const units = Number(environment.BILLING_CREDIT_UNITS_PER_USD);
  if (units !== 1000000) throw new Error('BILLING_CREDIT_UNITS_PER_USD must match the approved RevenueCat precision.');
  const unitMicros = 1000000 / units;
  const path = uid => `/projects/${encodeURIComponent(environment.REVENUECAT_PROJECT_ID)}/customers/${encodeURIComponent(uid)}`;
  function balanceOf(result) {
    const item = result?.items?.find(value => value.currency_code === 'ROCHE');
    if (!item || !Number.isSafeInteger(item.balance) || item.balance < 0) throw new Error('The account balance could not be confirmed.');
    return item.balance;
  }
  async function read(uid) {
    let response;
    try { response = await admin.request('GET', `${path(uid)}/virtual_currencies?include_empty_balances=true&limit=100`); }
    catch (error) {
      if (error.status !== 404) throw error;
      try { await admin.request('POST', `/projects/${encodeURIComponent(environment.REVENUECAT_PROJECT_ID)}/customers`, { id: uid }); }
      catch (created) { if (created.status !== 409) throw created; }
      response = await admin.request('GET', `${path(uid)}/virtual_currencies?include_empty_balances=true&limit=100`);
    }
    return balanceOf(response);
  }
  async function finish(context, intent) {
    let confirmed;
    if (intent.adjustment !== 0) {
      confirmed = await admin.request('POST', `${path(intent.uid)}/virtual_currencies/transactions?include_empty_balances=true`,
        { adjustments: { ROCHE: intent.adjustment }, reference: intent.reference }, { idempotencyKey: intent.id });
      balanceOf(confirmed);
    }
    const writes = (intent.records || []).map(record => context.write(record.collection, record.id, record.payload, { exists: false }));
    await context.update(state => {
      Object.assign(state, intent.accountPatch || {});
      state.operation.intent = null;
    }, writes);
  }
  async function recover(context) {
    const intent = (await context.read()).operation?.intent;
    if (intent?.kind === 'rc_currency') await finish(context, intent);
  }
  async function transact(context, { identity, adjustment, reference, accountPatch = {}, records = [] }) {
    await recover(context);
    const state = await context.read();
    if (state.operation?.intent) throw Object.assign(new Error('An earlier account update is being confirmed.'), { code: 'BILLING_PENDING' });
    if (!Number.isSafeInteger(adjustment)) throw new Error('The currency adjustment is invalid.');
    const intent = { kind: 'rc_currency', uid: state.uid, id: digest(JSON.stringify([state.uid, 'ROCHE', identity])), adjustment, reference, accountPatch, records };
    await context.intent(intent);
    await finish(context, intent);
  }
  async function reconcileUsage(context) {
    await recover(context);
    let state = await context.read(), balance = await read(state.uid);
    const refundDebit = Math.min(balance, state.pendingRefundCreditUnits || 0);
    if (refundDebit > 0) {
      const remaining = state.pendingRefundCreditUnits - refundDebit;
      await transact(context, { identity: `refund-debt:${state.refundDebitSequence || 0}:${refundDebit}`, adjustment: -refundDebit,
        reference: 'Natally refunded credits', accountPatch: { pendingRefundCreditUnits: remaining, refundDebitSequence: (state.refundDebitSequence || 0) + 1 } });
      balance = await read(state.uid); state = await context.read();
    }
    const unpaid = Math.max(0, state.spentUsdMicros - state.usageChargedUsdMicros);
    const debit = Math.min(balance, Math.floor(unpaid / unitMicros));
    if (debit > 0) {
      const charged = money(state.usageChargedUsdMicros + debit * unitMicros);
      await transact(context, { identity: `usage:${state.usageChargedUsdMicros}:${charged}`, adjustment: -debit,
        reference: `Natally inference usage through ${charged} USD micros`, accountPatch: { usageChargedUsdMicros: charged } });
      balance = await read(state.uid); state = await context.read();
    }
    return { balance, availableUsdMicros: Math.max(0, money(balance * unitMicros) - (state.pendingRefundCreditUnits || 0) * unitMicros - Math.max(0, state.spentUsdMicros - state.usageChargedUsdMicros)) };
  }
  const creditsFor = micros => Math.floor(money(micros) / unitMicros);
  return { read, recover, transact, reconcileUsage, creditsFor, unitMicros };
}
