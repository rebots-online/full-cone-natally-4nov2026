import { timingSafeEqual } from 'node:crypto';
import { verifyFirebaseIdentity } from './identity.mjs';
import { createBillingStore, digest, blankAccount, money } from './firebase-ledger.mjs';
import { readRedemptionPolicy, resolveRedemptionGrant } from './redemption-policy.mjs';
import { createManagedAccess } from './managed-access.mjs';
import { resolveRedemptionCode } from './redemption-codes.mjs';
import { createCommerce } from './revenuecat-commerce.mjs';
import { createFirebaseWallet } from './firebase-wallet.mjs';
import { renderInvoice } from './invoice.mjs';

const requestIdentity = value => {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(value)) throw Object.assign(new Error('A stable request ID is required. Retry from the same form.'), { status: 400 });
  return value;
};
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, private', ...headers } });
export function createBillingRuntime(environment = process.env) {
  let pendingStore;
  const store = async () => {
    if (!pendingStore) pendingStore = createBillingStore(environment).catch(error => { pendingStore = null; throw error; });
    return pendingStore;
  };
  // RevenueCat (ROCHE) is the AUTHORITATIVE account store (Robin, 2026-11-02):
  // deploy with BILLING_CREDIT_BALANCE_STORE=revenuecat (any value but
  // "firebase" selects it). "firebase" is a retained non-authoritative mode
  // that keeps the balance on the ledger document. Prepaid purchases, refunds, redemption and the
  // managed-key spend limit all use this ONE wallet (pay-per-use rails such as
  // x402 and Alby per-turn keep no balance and never touch it): before 2026-11-02 card purchases
  // credited ROCHE while the key limit read firebase, so paid credits never
  // raised the OpenRouter limit.
  const firebaseWallet = environment.BILLING_CREDIT_BALANCE_STORE === 'firebase' ? createFirebaseWallet(environment) : undefined;
  const commerce = createCommerce(environment, { wallet: firebaseWallet });
  const wallet = commerce.wallet;
  const managed = () => createManagedAccess(environment, wallet);
  async function accountStore(uid) {
    const ledger = await store(), current = await ledger.read('natallyCreditAccounts', digest(uid));
    if (current && ![2, 3].includes(current.payload.schemaVersion)) {
      if (current.payload.uid !== uid) throw new Error('Historical account ownership is invalid.');
      const keys = await managed().legacyKeys(uid);
      const spent = keys.reduce((sum, key) => money(sum + key.usageAccountedUsdMicros), 0);
      const next = { ...blankAccount(uid), spentUsdMicros: spent, usageChargedUsdMicros: spent,
        keys, migrationPending: true, legacySnapshot: current.payload, migratedAt: new Date().toISOString() };
      if (!await ledger.commit([ledger.write('natallyCreditAccounts', digest(uid), next, { updateTime: current.updateTime })])) throw Object.assign(new Error('Historical account migration is awaiting confirmation.'), { code: 'BILLING_PENDING' });
    }
    return ledger;
  }
  async function access(uid, operationId) {
    const ledger = await accountStore(uid);
    return ledger.run(uid, operationId, context => managed().ensure(context, uid), { recoverExisting: true });
  }
  async function reconcile(uid, strictCommerce = false, checkoutId = null, retire = false) {
    const ledger = await accountStore(uid);
    return ledger.run(uid, `reconcile_${digest(uid).slice(0, 32)}`, async context => {
      await managed().recover(context);
      if (retire || (await context.read()).schemaVersion !== 3 || (await context.read()).migrationPending) await managed().retireActive(context);
      let history;
      try { history = await commerce.reconcileHistory(ledger, uid, context); }
      catch (error) {
        if (strictCommerce) throw error;
        history = { purchaseCount: null, unresolved: [{ message: 'Purchase records could not be refreshed.' }] };
      }
      if (strictCommerce && history.unresolved.length) throw Object.assign(new Error('Purchase details are awaiting provider reconciliation.'), { code: 'BILLING_PENDING' });
      const result = await managed().ensure(context, uid);
      if (checkoutId) {
        const quote = await ledger.read('natallyBillingCheckouts', checkoutId);
        if (!quote || quote.payload.uid !== uid) throw Object.assign(new Error('Checkout not found.'), { status: 404 });
        const confirmed = quote.payload.state === 'paid';
        return { ...result, reconciliation: history, purchaseConfirmed: confirmed, checkoutState: quote.payload.state,
          purchaseReceiptId: confirmed ? quote.payload.receiptId : undefined,
          message: confirmed ? 'Purchase confirmed. Your credits and receipt are available.' : quote.payload.state === 'cancelled' ? 'Payment cancelled.' : 'Payment confirmation is pending. Use Confirm payment to check again.' };
      }
      return { ...result, reconciliation: history,
        message: history.unresolved.length ? 'Your balance is available. Some purchase records could not be refreshed.' : result.message };
    }, { recoverExisting: true });
  }
  const grantCreditsFor = receipt => wallet.creditsFor(receipt.allowanceUsdMicros) * wallet.unitMicros * (Number(environment.VITE_CREDIT_DISPLAY_PER_USD) || 100) / 1000000;
  async function redeem(identity, body) {
    const requestId = requestIdentity(body.requestId), uid = identity.uid;
    if (typeof body.code !== 'string' || body.code.length > 1024) throw Object.assign(new Error('Enter your redemption code.'), { status: 400 });
    const codeHash = digest(body.code.trim()), receiptId = digest(JSON.stringify([uid, 'redemption', requestId]));
    let ledger = await store();
    const existing = await ledger.read('natallyCreditGrants', receiptId);
    let allowance;
    if (existing) {
      if (existing.payload.uid !== uid || existing.payload.codeHash !== codeHash) throw Object.assign(new Error('This request ID belongs to a different redemption.'), { status: 409 });
    } else {
      // The code's own definition decides its behaviour (billing/redemption-codes.mjs).
      allowance = (await resolveRedemptionCode(environment, ledger, codeHash, uid)).allowanceUsdMicros;
    }
    ledger = await accountStore(uid);
    return ledger.run(uid, requestId, async context => {
      const accessProvider = managed();
      await accessProvider.recover(context);
      const receipt = await ledger.read('natallyCreditGrants', receiptId);
      if (receipt && receipt.payload.codeHash !== codeHash) throw Object.assign(new Error('This request ID belongs to a different redemption.'), { status: 409 });
      if (!receipt) {
        // Admin redemption (Robin, 2026-11-02): ADD the configured allowance
        // (BILLING_REDEMPTION_ALLOWANCE_USD, US$4 = 400 credits) to the
        // authoritative RevenueCat balance — like a US$10 purchase at 40% —
        // once per redemption; it never overwrites existing credit.
        const grant = money(allowance), grantCredits = wallet.creditsFor(grant);
        if (grantCredits * wallet.unitMicros !== grant) throw new Error('The redemption amount must be an exact Cr denomination.');
        const before = (await wallet.read(uid)) * wallet.unitMicros;
        const durable = { receiptId, requestId, uid, source: 'redemption', sourceId: requestId, codeHash, action: 'grant', allowanceUsdMicros: grant,
          beforeAvailableUsdMicros: before, afterAvailableUsdMicros: before + grant, adjustmentUsdMicros: grant, createdAt: new Date().toISOString() };
        const publicReceipt = Object.fromEntries(Object.entries(durable).filter(([key]) => !['uid', 'codeHash', 'source', 'sourceId'].includes(key)));
        await wallet.transact(context, { identity: `redemption:${requestId}`, adjustment: grantCredits, reference: `Natally code redemption ${requestId}`,
          accountPatch: { redemptionReceipt: publicReceipt },
          records: [{ collection: 'natallyCreditGrants', id: receiptId, payload: durable }] });
      }
      const result = await accessProvider.ensure(context, uid);
      const persisted = (await ledger.read('natallyCreditGrants', receiptId)).payload;
      return { ...result, redemptionReceipt: Object.fromEntries(Object.entries(persisted).filter(([key]) => !['uid', 'codeHash', 'source', 'sourceId'].includes(key))),
        message: result.state === 'ready' ? `Code redeemed. ${grantCreditsFor(persisted)} credits added.` : result.message };
    });
  }
  return async function handle(request) {
    const url = new URL(request.url), origin = request.headers.get('origin');
    const origins = String(environment.BILLING_ALLOWED_ORIGIN || '').split(',').map(value => value.trim()).filter(Boolean);
    const cors = origin && origins.includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } : {};
    if (origin && !origins.includes(origin)) return json({ message: 'This application origin is not configured.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (['/healthz', '/billing/health'].includes(url.pathname)) return json({ service: 'natally-billing', status: 'ok' }, 200, cors);
    let identity;
    try {
      if (url.pathname === '/billing/webhook' && request.method === 'POST') {
        const expected = environment.REVENUECAT_WEBHOOK_AUTH, received = request.headers.get('authorization') || '';
        if (!expected || received.length !== expected.length || !timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return json({ message: 'Invalid purchase notification.' }, 401);
        const event = (await request.json()).event;
        if (event?.environment !== 'PRODUCTION' || typeof event.app_user_id !== 'string' || !event.app_user_id) return json({ message: 'Invalid production purchase notification.' }, 400);
        const recorded = await commerce.receiveEvent(await store(), event);
        if (recorded.uid) await reconcile(recorded.uid, true, null, event.type === 'CANCELLATION');
        return json({ received: true });
      }
      identity = await verifyFirebaseIdentity(request.headers.get('authorization'));
      let body = {};
      if (request.method === 'POST') {
        const raw = await request.text();
        if (raw.length > 65536) throw Object.assign(new Error('Request is too large.'), { status: 413 });
        try { body = raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error('The request is invalid.'), { status: 400 }); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw Object.assign(new Error('The request is invalid.'), { status: 400 });
      }
      let result;
      if (url.pathname === '/billing/redeem' && request.method === 'POST') result = await redeem(identity, body);
      else if (url.pathname === '/billing/checkout' && request.method === 'POST') {
        result = await commerce.checkout(await store(), identity, body.amountUsd, requestIdentity(body.requestId), body.buyer);
      } else if (['/billing/checkout-start', '/billing/checkout-cancel'].includes(url.pathname) && request.method === 'POST') {
        if (!/^[a-f0-9]{64}$/.test(body.checkoutId || '')) throw Object.assign(new Error('The checkout identity is invalid.'), { status: 400 });
        result = await commerce.changeCheckout(await store(), identity.uid, body.checkoutId, url.pathname.endsWith('-start') ? 'start' : 'cancel');
      } else if (url.pathname === '/billing/access' && request.method === 'GET' || url.pathname === '/billing/reconcile' && request.method === 'POST') {
        if (body.checkoutId && !/^[a-f0-9]{64}$/.test(body.checkoutId)) throw Object.assign(new Error('The checkout identity is invalid.'), { status: 400 });
        result = request.method === 'POST' ? await reconcile(identity.uid, false, body.checkoutId || null) : await access(identity.uid, `access_${digest(identity.uid).slice(0, 32)}`);
      } else if (url.pathname === '/billing/logout' && request.method === 'POST') {
        if (typeof body.expectedHash !== 'string' || !body.expectedHash) throw Object.assign(new Error('The current key identity is required.'), { status: 400 });
        result = await (await store()).run(identity.uid, `logout_${digest(body.expectedHash).slice(0, 32)}`, context => managed().logout(context, body.expectedHash));
      } else if (url.pathname === '/billing/history' && request.method === 'GET') {
        const records = await (await store()).list('natallyCreditGrants', identity.uid);
        const items = records.filter(value => value.source === 'payment').map(value => ({
          id: value.receiptId, sourceId: value.sourceId, description: value.description, productId: value.productId, paidAt: value.paidAt || value.purchasedAt,
          currency: value.currency, subtotal: value.subtotalMicros / 1000000, tax: value.taxMicros / 1000000, total: value.totalMicros / 1000000,
          amountMicros: value.totalMicros, status: records.some(record => record.source === 'refund' && record.originalReceiptId === value.receiptId) ? 'refunded' : value.status, invoiceId: value.receiptId, invoiceAvailable: !!(value.invoiceNumber || value.invoicePdf),
        }));
        let providerMessage = null;
        try {
          const purchases = await commerce.listPurchases(identity.uid), mappings = JSON.parse(environment.BILLING_PRODUCTS_JSON || '{}');
          for (const purchase of purchases) {
            const settled = records.find(record => record.source === 'payment' && record.providerPurchaseId === purchase.id);
            if (settled) { const item = items.find(value => value.id === settled.receiptId); if (item && item.status !== 'refunded') item.status = purchase.status; continue; }
            if (!mappings[purchase.product_id] || purchase.customer_id !== identity.uid || purchase.environment !== 'production') continue;
            items.push({ id: purchase.id, sourceId: String(purchase.store_purchase_identifier), productId: purchase.product_id,
              description: mappings[purchase.product_id].description || purchase.product_id, paidAt: new Date(purchase.purchased_at).toISOString(),
              currency: '', status: purchase.status, invoiceAvailable: false });
          }
        } catch { providerMessage = 'Store purchase records could not be refreshed. Confirmed saved receipts are shown.'; }
        result = { accountUid: identity.uid, items, providerMessage };
      } else if (/^\/billing\/invoices\/[a-f0-9]{64}(?:\/file)?$/.test(url.pathname) && request.method === 'GET') {
        const id = url.pathname.split('/')[3], record = await (await store()).read('natallyCreditGrants', id);
        if (!record || record.payload.uid !== identity.uid || record.payload.source !== 'payment') return json({ message: 'Invoice not found.' }, 404, cors);
        const receipt = record.payload;
        if (!url.pathname.endsWith('/file')) {
          try { return new Response(renderInvoice(receipt), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, private', ...cors } }); }
          catch { if (!receipt.invoicePdf) throw new Error('The complete official invoice is not yet available.'); }
        }
        const pdfUrl = new URL(receipt.invoicePdf);
        if (pdfUrl.protocol !== 'https:' || !['pay.stripe.com', 'invoice.stripe.com', 'files.stripe.com'].includes(pdfUrl.hostname)) throw new Error('Invoice download address is invalid.');
        const downloaded = await fetch(pdfUrl, { redirect: 'error', signal: AbortSignal.timeout(20000) });
        if (!downloaded.ok || !downloaded.headers.get('content-type')?.includes('application/pdf')) throw new Error('The original invoice could not be retrieved.');
        return new Response(await downloaded.arrayBuffer(), { headers: { 'Content-Type': 'application/pdf', 'Cache-Control': 'no-store, private', ...cors } });
      } else return json({ message: 'This billing endpoint was not found.' }, 404, cors);
      return json(result, 200, cors);
    } catch (error) {
      const pending = error.code === 'BILLING_PENDING';
      const webhook = url.pathname === '/billing/webhook';
      const diagnosticRoute = ['/billing/redeem', '/billing/access', '/billing/reconcile', '/billing/checkout', '/billing/checkout-start', '/billing/checkout-cancel', '/billing/logout', '/billing/history', '/billing/webhook'].includes(url.pathname)
        ? url.pathname : url.pathname.startsWith('/billing/invoices/') ? '/billing/invoices' : '/billing/unknown';
      // Log only bounded diagnostic codes. Never emit identity, request bodies,
      // credentials, provider response text, error messages or stack traces.
      console.error(JSON.stringify({ event: 'billing_operation_failed', route: diagnosticRoute,
        code: typeof error.code === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/.test(error.code) ? error.code : 'BILLING_OPERATION_FAILED',
        status: Number.isInteger(error.status) && error.status >= 400 && error.status <= 599 ? error.status : 503 }));
      return json({ accountUid: identity?.uid, expiresAt: new Date(Date.now() + 120000).toISOString(), state: pending ? 'pending' : 'needs_attention',
        ...([400, 409].includes(error.status) && ['CHECKOUT_EXPIRED', 'CHECKOUT_COMPLETED'].includes(error.code) ? { code: error.code, ...(error.checkoutSessionId ? { checkoutSessionId: error.checkoutSessionId } : {}) } : {}),
        message: error.status && error.status < 500 || pending || error.code === 'LEGACY_ACCOUNT' ? error.message : url.pathname === '/billing/checkout' || url.pathname === '/billing/checkout-start'
          ? 'Your purchase could not start. Please try again.' : 'Your account update could not be confirmed. Retry the same request.' }, error.status || (pending && !webhook ? 202 : 503), cors);
    }
  };
}
