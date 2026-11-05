import { digest, money, createBillingStore } from './firebase-ledger.mjs';
import { createKeyCipher } from './key-cipher.mjs';
import { createRevenueCatAdmin } from './revenuecat-admin.mjs';
import { createRevenueCatCatalog } from './revenuecat-catalog.mjs';
import { billingBuyer, readManualTaxPolicy, calculateManualTax } from './manual-tax.mjs';
import { renderInvoice } from './invoice.mjs';
import { createRevenueCatWallet } from './revenuecat-wallet.mjs';

const pending = message => Object.assign(new Error(message), { code: 'BILLING_PENDING' });
const checkoutId = (uid, requestId) => digest(JSON.stringify([uid, 'revenuecat_checkout', requestId]));
function amountMicros(value) {
  const match = /^(\d+)(?:\.(\d{1,6}))?$/.exec(String(value));
  if (!match) throw new Error('The confirmed payment amount is invalid.');
  const micros = BigInt(match[1]) * 1000000n + BigInt((match[2] || '').padEnd(6, '0'));
  if (micros > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('The confirmed amount exceeds the supported range.');
  return Number(micros);
}
// options.wallet: the runtime's selected balance store. Every PREPAID rail
// (RevenueCat card today; Chargebee/Lemon Squeezy/Polar, BTCPay/Blink top-ups,
// WooCommerce plugin) must credit the SAME wallet the managed-key limit is
// derived from (managed-access ensure → wallet.reconcileUsage). Pay-per-use
// rails (x402, Alby marketplace per-turn) keep NO balance and never credit it;
// see DOCS/ARCHITECTURE.md single-wallet rail amendment. Without it this rail keeps
// its own RevenueCat ROCHE virtual-currency wallet — the AUTHORITATIVE account
// store (Robin, 2026-11-02) for BILLING_CREDIT_BALANCE_STORE values other than "firebase".
export function createCommerce(environment, options = {}) {
  let storePromise;
  const getLedger = () => storePromise ||= createBillingStore(environment).catch(error => { storePromise = null; throw error; });
  const command = createRevenueCatAdmin(environment, { getLedger });
  const wallet = options.wallet ?? createRevenueCatWallet(environment, command);
  const catalog = createRevenueCatCatalog(environment, command);
  const publicKey = () => environment.REVENUECAT_WEB_PUBLIC_KEY || environment.VITE_REVENUECAT_PUBLIC_KEY;
  const allocation = () => {
    const value = Number(environment.BILLING_TOPUP_ALLOCATION_BPS);
    if (value !== 4000) throw new Error('The approved purchase allocation is not configured.');
    return value;
  };
  async function listPurchases(uid) {
    const base = `/projects/${encodeURIComponent(environment.REVENUECAT_PROJECT_ID)}/customers/${encodeURIComponent(uid)}/purchases`;
    let next = `${base}?limit=100`; const items = [];
    for (let page = 0; page < 100; page++) {
      const result = await command(['api', 'GET', next]);
      if (!Array.isArray(result.items)) throw new Error('Purchase confirmation is incomplete.');
      items.push(...result.items);
      if (!result.next_page) return items;
      const target = new URL(result.next_page, 'https://api.revenuecat.com');
      if (target.origin !== 'https://api.revenuecat.com' || target.pathname !== `/v2${base}`) throw new Error('Purchase pagination is invalid.');
      next = target.pathname.replace(/^\/v2/, '') + target.search;
    }
    throw new Error('Purchase confirmation exceeded its page limit.');
  }
  async function checkout(ledger, identity, rawAmount, requestId, inputBuyer) {
    if (typeof rawAmount !== 'string' || !/^\d+(?:\.\d{1,2})?$/.test(rawAmount)) throw Object.assign(new Error('Enter a USD amount with up to two decimal places.'), { status: 400 });
    const micros = amountMicros(rawAmount), cents = micros / 10000;
    if (!Number.isSafeInteger(cents) || cents < 500 || cents > 99999999) throw Object.assign(new Error('Choose US$5 or enter a higher amount.'), { status: 400 });
    const id = checkoutId(identity.uid, requestId), existing = await ledger.read('natallyBillingCheckouts', id);
    if (existing) {
      if (existing.payload.uid !== identity.uid || existing.payload.baseMicros !== micros) throw Object.assign(new Error('This checkout request belongs to a different amount.'), { status: 409 });
      if (inputBuyer && JSON.stringify(billingBuyer(inputBuyer, identity.email)) !== JSON.stringify(existing.payload.purchaser)) throw Object.assign(new Error('Billing details changed. Cancel this checkout before starting another.'), { status: 409 });
      return { accountUid: identity.uid, ...existing.payload, purchaser: undefined, taxPolicy: undefined };
    }
    const purchaser = billingBuyer(inputBuyer, identity.email), taxPolicy = readManualTaxPolicy(environment, purchaser);
    createKeyCipher(environment); allocation();
    if (!environment.OPENROUTER_ADMIN_KEY || !environment.REVENUECAT_WEBHOOK_AUTH || !publicKey()?.startsWith('rcb_')) throw new Error('Purchases could not start because account confirmation is unavailable.');
    const tax = calculateManualTax(micros, taxPolicy);
    const product = await catalog.ensure(ledger, tax.totalMicros / 10000, JSON.stringify([micros, taxPolicy]));
    const quote = { ...product, uid: identity.uid, checkoutId: id, requestId, baseMicros: micros, currency: 'USD', amountMicros: tax.totalMicros,
      taxMicros: tax.taxMicros, totalMicros: tax.totalMicros, taxLabel: taxPolicy.label,
      description: `Natally credits US$${(micros / 1000000).toFixed(2)}`, purchaser, taxPolicy, createdAt: new Date().toISOString(), state: 'prepared', transactionId: null };
    if (!await ledger.commit([ledger.write('natallyBillingCheckouts', id, quote, { exists: false })])) {
      const saved = await ledger.read('natallyBillingCheckouts', id);
      if (!saved || saved.payload.uid !== identity.uid || saved.payload.baseMicros !== micros) throw pending('The checkout is being prepared. Retry the same amount.');
      return { accountUid: identity.uid, ...saved.payload, purchaser: undefined, taxPolicy: undefined };
    }
    return { accountUid: identity.uid, ...quote, purchaser: undefined, taxPolicy: undefined };
  }
  async function changeCheckout(ledger, uid, id, action) {
    const saved = await ledger.read('natallyBillingCheckouts', id);
    if (!saved || saved.payload.uid !== uid) throw Object.assign(new Error('Checkout not found.'), { status: 404 });
    if (saved.payload.state === 'paid') return { accountUid: uid, ...saved.payload, purchaser: undefined, taxPolicy: undefined };
    if (action === 'start' && saved.payload.state === 'cancelled') throw Object.assign(new Error('This checkout was cancelled. Start a new purchase.'), { status: 409 });
    if (action === 'start' && saved.payload.state === 'started') throw pending('The previous purchase is awaiting confirmation. Use Confirm purchase before trying again.');
    const next = { ...saved.payload, state: action === 'cancel' ? 'cancelled' : 'started', startedAt: new Date().toISOString() };
    if (!await ledger.commit([ledger.write('natallyBillingCheckouts', id, next, { updateTime: saved.updateTime })])) throw pending('The checkout is being updated. Retry shortly.');
    return { accountUid: uid, state: next.state, checkoutId: id };
  }
  async function receiveEvent(ledger, event) {
    if (event.environment !== 'PRODUCTION' || event.app_id !== environment.REVENUECAT_WEB_APP_ID || event.store !== 'RC_BILLING') return { ignored: true };
    if (!['NON_RENEWING_PURCHASE', 'CANCELLATION'].includes(event.type)) return { ignored: true };
    if (typeof event.id !== 'string' || typeof event.app_user_id !== 'string' || typeof event.transaction_id !== 'string' || typeof event.product_id !== 'string') throw new Error('The purchase event is incomplete.');
    const id = digest(JSON.stringify([event.app_id, event.store, event.transaction_id, event.type]));
    const saved = await ledger.read('natallyRevenueCatEvents', id);
    if (saved && ['app_user_id', 'product_id', 'currency', 'price_in_purchased_currency', 'purchased_at_ms'].some(field => saved.payload.event[field] !== event[field])) throw new Error('The purchase event conflicts with an earlier notification.');
    if (!saved && !await ledger.commit([ledger.write('natallyRevenueCatEvents', id, { uid: event.app_user_id, event, receivedAt: new Date().toISOString() }, { exists: false })])) throw pending('The purchase event is being recorded.');
    return { uid: event.app_user_id, transactionId: event.transaction_id };
  }
  async function paymentFromEvent(ledger, uid, event, purchases) {
    const id = event.metadata?.natally_checkout_id;
    if (typeof id !== 'string' || !/^[a-f0-9]{64}$/.test(id)) return null;
    const quote = await ledger.read('natallyBillingCheckouts', id);
    if (!quote || quote.payload.uid !== uid || quote.payload.productIdentifier !== event.product_id) throw new Error('The purchase does not match its checkout account.');
    const transaction = purchases.find(item => item.product_id === quote.payload.productId && item.customer_id === uid && item.environment === 'production' && item.store === 'rc_billing' &&
      [item.id, item.store_transaction_id, item.store_purchase_identifier].includes(event.transaction_id));
    if (!transaction || transaction.status !== 'owned') throw pending('Your purchase is awaiting store confirmation.');
    if (event.currency !== 'USD' || !Number.isFinite(event.price_in_purchased_currency) || event.price_in_purchased_currency < 0 || !Number.isFinite(event.purchased_at_ms)) throw new Error('The confirmed purchase amount is unavailable.');
    const total = amountMicros(event.price_in_purchased_currency);
    if (total > quote.payload.amountMicros || event.quantity && event.quantity !== 1) throw new Error('The confirmed charge does not match the selected purchase.');
    // RevenueCat country_code is last-seen location, not the buyer's billing
    // jurisdiction. The immutable checkout retains the supplied billing facts.
    const tax = total === quote.payload.totalMicros ? calculateManualTax(quote.payload.baseMicros, quote.payload.taxPolicy)
      : calculateManualTax(total, quote.payload.taxPolicy, { paidTotal: true });
    const sourceId = `revenuecat:${event.transaction_id}`, receiptId = digest(JSON.stringify([uid, 'payment', sourceId]));
    return { uid, source: 'payment', sourceId, receiptId, providerPurchaseId: transaction.id, productId: event.product_id, revenueCatProductId: quote.payload.productId,
      description: quote.payload.description, currency: event.currency, ...tax,
      eligiblePaidUsdMicros: tax.subtotalMicros, providerAllowanceUsdMicros: Number(BigInt(tax.subtotalMicros) * BigInt(allocation()) / 10000n),
      purchasedAt: new Date(event.purchased_at_ms).toISOString(), paidAt: new Date(event.purchased_at_ms).toISOString(), status: 'owned',
      purchaser: quote.payload.purchaser, taxPolicy: quote.payload.taxPolicy, invoiceId: receiptId, invoiceNumber: `NAT-${receiptId.slice(0, 24).toUpperCase()}`,
      evidenceSource: 'authenticated_revenuecat_event_and_server_customer', event, checkoutId: id, createdAt: new Date().toISOString() };
  }
  async function grantPayment(ledger, uid, payment, context) {
    renderInvoice(payment);
    const existing = await ledger.read('natallyCreditGrants', payment.receiptId);
    if (existing) return existing.payload;
    const ownerId = digest(payment.sourceId), owner = await ledger.read('natallyBillingTransactionOwners', ownerId);
    if (owner && owner.payload.uid !== uid) throw new Error('This transaction was already assigned to its paying account.');
    const quote = await ledger.read('natallyBillingCheckouts', payment.checkoutId);
    const state = await context.read(), creditUnits = wallet.creditsFor(payment.providerAllowanceUsdMicros);
    payment.creditUnits = creditUnits;
    const taxPayable = { ...state.taxPayable, [payment.currency]: money((state.taxPayable[payment.currency] || 0) + payment.taxMicros) };
    const hstPayable = { ...state.hstPayable };
    if (payment.taxPolicy.country === 'CA' && payment.taxPolicy.label === 'HST') hstPayable[payment.currency] = money((hstPayable[payment.currency] || 0) + payment.taxMicros);
    const records = [{ collection: 'natallyCreditGrants', id: payment.receiptId, payload: payment }];
    if (!owner) records.push({ collection: 'natallyBillingTransactionOwners', id: ownerId, payload: { uid, sourceId: payment.sourceId } });
    await wallet.transact(context, { identity: payment.sourceId, adjustment: creditUnits, reference: payment.invoiceNumber,
      accountPatch: { taxPayable, hstPayable }, records });
    if (!await ledger.commit([ledger.write('natallyBillingCheckouts', payment.checkoutId, { ...quote.payload, state: 'paid', transactionId: payment.event.transaction_id,
      transactionIds: [...new Set([...(quote.payload.transactionIds || []), payment.event.transaction_id])], receiptId: payment.receiptId }, { updateTime: quote.updateTime })])) throw pending('Your payment is recorded. Confirmation is being refreshed.');
    return payment;
  }
  async function reversePayment(ledger, uid, receipt, event, context, purchases) {
    if (event.cancel_reason !== 'CUSTOMER_SUPPORT' || !purchases.some(item => item.product_id === receipt.revenueCatProductId && [item.id, item.store_transaction_id, item.store_purchase_identifier].includes(event.transaction_id) && item.status === 'refunded')) throw pending('The refund is awaiting store confirmation.');
    const refundAmount = Math.abs(event.price_in_purchased_currency);
    if (!Number.isFinite(refundAmount) || amountMicros(refundAmount) !== receipt.totalMicros || event.currency !== receipt.currency) throw new Error('The actual refund amount requires reconciliation.');
    const id = digest(JSON.stringify([uid, 'refund', receipt.sourceId]));
    if (await ledger.read('natallyCreditGrants', id)) return;
    const hst = receipt.taxPolicy.country === 'CA' && receipt.taxPolicy.label === 'HST' ? receipt.taxMicros : 0;
    const state = await context.read();
    const units = -wallet.creditsFor(receipt.providerAllowanceUsdMicros);
    const debit = Math.min(await wallet.read(uid), -units);
    await wallet.transact(context, { identity: `refund:${receipt.sourceId}`, adjustment: -debit, reference: `Refund ${receipt.invoiceNumber}`,
      accountPatch: { taxPayable: { ...state.taxPayable, [receipt.currency]: money((state.taxPayable[receipt.currency] || 0) - receipt.taxMicros, 'Tax payable', true) },
        hstPayable: { ...state.hstPayable, [receipt.currency]: money((state.hstPayable?.[receipt.currency] || 0) - hst, 'HST payable', true) },
        pendingRefundCreditUnits: (state.pendingRefundCreditUnits || 0) + (-units - debit) },
      records: [{ collection: 'natallyCreditGrants', id, payload: { uid, source: 'refund', sourceId: receipt.sourceId, originalReceiptId: receipt.receiptId,
        refundedTotalMicros: receipt.totalMicros, refundedTaxMicros: receipt.taxMicros, refundedHstMicros: hst, event, createdAt: new Date().toISOString() } }] });
  }
  async function reconcileHistory(ledger, uid, context) {
    const events = await ledger.list('natallyRevenueCatEvents', uid);
    if (!events.length) return { purchaseCount: 0, unresolved: [] };
    const purchases = await listPurchases(uid), unresolved = [];
    for (const record of events.filter(item => item.event.type === 'NON_RENEWING_PURCHASE')) {
      const receiptId = digest(JSON.stringify([uid, 'payment', `revenuecat:${record.event.transaction_id}`]));
      const saved = await ledger.read('natallyCreditGrants', receiptId);
      if (saved) {
        const quote = await ledger.read('natallyBillingCheckouts', saved.payload.checkoutId);
        if (quote && quote.payload.state !== 'paid' && !await ledger.commit([ledger.write('natallyBillingCheckouts', saved.payload.checkoutId, { ...quote.payload,
          state: 'paid', transactionId: record.event.transaction_id, receiptId }, { updateTime: quote.updateTime })])) throw pending('Payment confirmation is being refreshed.');
        continue;
      }
      if (events.some(item => item.event.type === 'CANCELLATION' && item.event.transaction_id === record.event.transaction_id)) continue;
      const payment = await paymentFromEvent(ledger, uid, record.event, purchases);
      if (payment) await grantPayment(ledger, uid, payment, context);
    }
    const receipts = await ledger.list('natallyCreditGrants', uid);
    for (const record of events.filter(item => item.event.type === 'CANCELLATION')) {
      const receipt = receipts.find(item => item.source === 'payment' && item.sourceId === `revenuecat:${record.event.transaction_id}`);
      if (receipt) await reversePayment(ledger, uid, receipt, record.event, context, purchases);
    }
    return { purchaseCount: purchases.length, unresolved };
  }
  return { checkout, changeCheckout, receiveEvent, reconcileHistory, listPurchases, grantPayment, wallet };
}
