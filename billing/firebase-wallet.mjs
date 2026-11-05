// Non-authoritative firebase balance mode (BILLING_CREDIT_BALANCE_STORE=firebase).
// RevenueCat is the authoritative account store (Robin, 2026-11-02); this mode is
// retained, not the deployment default. The customer balance lives on the same
// natallyCreditAccounts ledger document the runtime already owns — no external
// balance provider, no metadata server, host-anywhere per the cost-gating rule.
import { digest, money, createBillingStore } from './firebase-ledger.mjs';

export function createFirebaseWallet(environment) {
  // Firebase credit definition (operator ruling 2026-11-01): 1 credit = $0.01,
  // stored as a whole number in the Firestore ledger. No millions. The
  // RevenueCat millionths precision env does not apply to this store.
  const CREDITS_PER_USD = 100;
  const unitMicros = 1000000 / CREDITS_PER_USD;
  let pendingStore;
  const store = async () => {
    if (!pendingStore) pendingStore = createBillingStore(environment).catch(error => { pendingStore = null; throw error; });
    return pendingStore;
  };
  const balanceOf = account => {
    // A new account carries no creditUnits yet: absent means zero balance.
    const balance = account?.creditUnits ?? 0;
    if (!Number.isSafeInteger(balance) || balance < 0) throw new Error('The account balance could not be confirmed.');
    return balance;
  };
  async function read(uid) {
    const ledger = await store();
    const state = await ledger.read('natallyCreditAccounts', digest(uid));
    return state ? balanceOf(state.payload) : 0;
  }
  async function finish(context, intent) {
    if (intent.adjustment !== 0) {
      await context.update(account => {
        const next = (account.creditUnits || 0) + intent.adjustment;
        if (!Number.isSafeInteger(next) || next < 0) throw Object.assign(new Error('The account balance adjustment is invalid.'), { code: 'BILLING_PENDING' });
        account.creditUnits = next;
        Object.assign(account, intent.accountPatch || {});
        account.operation.intent = null;
      }, (intent.records || []).map(record => context.write(record.collection, record.id, record.payload, { exists: false })));
      return;
    }
    await context.update(account => { Object.assign(account, intent.accountPatch || {}); account.operation.intent = null; },
      (intent.records || []).map(record => context.write(record.collection, record.id, record.payload, { exists: false })));
  }
  async function recover(context) {
    const intent = (await context.read()).operation?.intent;
    if (intent?.kind === 'fb_credits') await finish(context, intent);
  }
  async function transact(context, { identity, adjustment, reference, accountPatch = {}, records = [] }) {
    await recover(context);
    const state = await context.read();
    if (state.operation?.intent) throw Object.assign(new Error('An earlier account update is being confirmed.'), { code: 'BILLING_PENDING' });
    if (!Number.isSafeInteger(adjustment)) throw new Error('The currency adjustment is invalid.');
    const intent = { kind: 'fb_credits', uid: state.uid, id: digest(JSON.stringify([state.uid, 'fb-credits', identity])), adjustment, reference, accountPatch, records };
    await context.intent(intent);
    await finish(context, intent);
  }
  async function reconcileUsage(context) {
    await recover(context);
    let state = await context.read(), balance = balanceOf(state);
    const refundDebit = Math.min(balance, state.pendingRefundCreditUnits || 0);
    if (refundDebit > 0) {
      const remaining = state.pendingRefundCreditUnits - refundDebit;
      await transact(context, { identity: `refund-debt:${state.refundDebitSequence || 0}:${refundDebit}`, adjustment: -refundDebit,
        reference: 'Natally refunded credits', accountPatch: { pendingRefundCreditUnits: remaining, refundDebitSequence: (state.refundDebitSequence || 0) + 1 } });
      state = await context.read(); balance = balanceOf(state);
    }
    const unpaid = Math.max(0, state.spentUsdMicros - state.usageChargedUsdMicros);
    const debit = Math.min(balance, Math.floor(unpaid / unitMicros));
    if (debit > 0) {
      const charged = money(state.usageChargedUsdMicros + debit * unitMicros);
      await transact(context, { identity: `usage:${state.usageChargedUsdMicros}:${charged}`, adjustment: -debit,
        reference: `Natally inference usage through ${charged} USD micros`, accountPatch: { usageChargedUsdMicros: charged } });
      state = await context.read(); balance = balanceOf(state);
    }
    return { balance, availableUsdMicros: Math.max(0, money(balance * unitMicros) - (state.pendingRefundCreditUnits || 0) * unitMicros - Math.max(0, state.spentUsdMicros - state.usageChargedUsdMicros)) };
  }
  const creditsFor = micros => Math.floor(money(micros) / unitMicros);
  return { read, recover, transact, reconcileUsage, creditsFor, unitMicros };
}
