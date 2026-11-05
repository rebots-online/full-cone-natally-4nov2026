// Regression (2026-11-02): with BILLING_CREDIT_BALANCE_STORE=firebase, card
// purchases credited RevenueCat ROCHE while the managed OpenRouter key limit
// was derived from the firebase wallet, so paid credits never raised the
// spend limit. Every payment rail must credit the runtime's selected wallet.
// Real grantPayment + firebase wallet + managed-access; only the Firestore
// ledger and the OpenRouter HTTP API are doubles.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createCommerce } from '../billing/revenuecat-commerce.mjs';
import { createFirebaseWallet } from '../billing/firebase-wallet.mjs';
import { createManagedAccess } from '../billing/managed-access.mjs';
import { blankAccount } from '../billing/firebase-ledger.mjs';

const uid = 'purchase-test-user';
const environment = {
  BILLING_CREDIT_UNITS_PER_USD: '1000000',
  OPENROUTER_ADMIN_KEY: 'test-admin-key',
  BILLING_KEY_ENCRYPTION_KEY: randomBytes(32).toString('base64'),
};

function fakeLedger() {
  const records = new Map();
  const key = (collection, id) => `${collection}/${id}`;
  const write = (collection, id, payload) => ({ collection, id, payload });
  const apply = writes => { for (const w of writes) records.set(key(w.collection, w.id), { payload: structuredClone(w.payload), updateTime: 't' }); };
  records.set(key('natallyBillingCheckouts', 'checkout-1'), { payload: { productId: 'credits_10', state: 'started' }, updateTime: 't' });
  let account = { ...blankAccount(uid), operation: { id: 'op-1', intent: null } };
  const context = {
    read: async () => structuredClone(account),
    update: async (mutate, writes = []) => { const next = structuredClone(account); mutate(next); account = next; apply(await Promise.all(writes)); return structuredClone(account); },
    write,
    intent: intent => context.update(value => { value.operation.intent = intent; }),
    clearIntent: () => context.update(value => { value.operation.intent = null; }),
  };
  const ledger = { read: async (collection, id) => records.get(key(collection, id)) ?? null, write, commit: async writes => { apply(writes); return true; } };
  return { ledger, context, account: () => account, records };
}

function fakeOpenRouter() {
  const keys = new Map();
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    const method = init.method || 'GET', body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ method, url: String(url), body });
    const hash = String(url).match(/\/keys\/([^?]+)$/)?.[1];
    let result;
    if (method === 'POST') {
      const data = { hash: `h${keys.size + 1}`, ...body, usage: 0, disabled: false };
      keys.set(data.hash, data); result = { key: `sk-or-test-${data.hash}`, data };
    } else if (method === 'PATCH') { Object.assign(keys.get(hash), body); result = { data: keys.get(hash) }; }
    else if (hash) result = { data: keys.get(hash) };
    else result = { data: [...keys.values()] };
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  return { keys, calls };
}

const payment = {
  receiptId: 'receipt-1', sourceId: 'revenuecat:txn-1', checkoutId: 'checkout-1',
  providerAllowanceUsdMicros: 4000000, // US$10 paid × 40% allocation = US$4 of inference
  invoiceNumber: 'NAT-TEST-1', paidAt: '2026-11-02', currency: 'CAD',
  purchaser: { name: 'Test Buyer', address: { line1: '1 Test St', city: 'Toronto' } },
  description: 'Natally credits US$10.00', subtotalMicros: 10000000, taxMicros: 0, totalMicros: 10000000,
  taxPolicy: { country: 'CA', label: 'HST' }, event: { transaction_id: 'txn-1' },
};

test('a card purchase funds the managed OpenRouter key limit (firebase store), idempotently', async () => {
  const realFetch = globalThis.fetch;
  try {
    const { ledger, context, account } = fakeLedger();
    const openrouter = fakeOpenRouter();
    const wallet = createFirebaseWallet(environment);
    const commerce = createCommerce(environment, { wallet });
    assert.equal(commerce.wallet, wallet, 'purchases must credit the runtime-selected wallet');

    await commerce.grantPayment(ledger, uid, structuredClone(payment), context);
    assert.equal(account().creditUnits, 400, 'US$4 allowance → 400 firebase credits (1 credit = US$0.01)');

    const managed = createManagedAccess(environment, wallet);
    const first = await managed.ensure(context, uid);
    assert.equal(first.state, 'ready');
    assert.equal(first.limitUsd, 4, 'key spend limit equals the purchased allowance');
    assert.ok(Date.parse(first.accessExpiresAt) - Date.now() <= 3600000, 'keys are short-lived (≤ 1 h)');

    // Replaying the same purchase event grants nothing more…
    await commerce.grantPayment(ledger, uid, structuredClone(payment), context);
    assert.equal(account().creditUnits, 400, 'a replayed purchase is not credited twice');
    // …and re-provisioning sets the same ABSOLUTE limit, never an increment.
    const second = await managed.ensure(context, uid);
    assert.equal(second.limitUsd, 4, 'limit is idempotent: absolute, derived from the balance');
    assert.equal(openrouter.calls.filter(c => c.method === 'POST').length, 1, 'the still-valid key is reused');
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('without an injected wallet the RevenueCat ROCHE wallet is kept (not removed)', () => {
  const commerce = createCommerce(environment);
  assert.equal(typeof commerce.wallet.transact, 'function');
  assert.equal(commerce.wallet.unitMicros, 1, 'ROCHE precision: 1,000,000 units per USD');
});

// RevenueCat is the authoritative account store (Robin, 2026-11-02). Robin's
// real case: a purchase already credited to ROCHE, then "Restore purchases".
// Restore must surface it: the key limit is read from RevenueCat, and the
// replayed grant (receipt exists) adds nothing.
test('RevenueCat-authoritative mode: a recorded purchase funds the key and Restore surfaces it', async () => {
  const realFetch = globalThis.fetch;
  try {
    const { createRevenueCatWallet } = await import('../billing/revenuecat-wallet.mjs');
    const { ledger, context } = fakeLedger();
    const openrouter = fakeOpenRouter();
    let roche = 0; const adjustments = [];
    const admin = { request: async (method, path, body) => {
      if (method === 'POST' && path.endsWith('/virtual_currencies/transactions?include_empty_balances=true')) { adjustments.push(body.adjustments.ROCHE); roche += body.adjustments.ROCHE; }
      return { items: [{ currency_code: 'ROCHE', balance: roche }] };
    } };
    const wallet = createRevenueCatWallet({ ...environment, REVENUECAT_PROJECT_ID: 'proj' }, admin);
    const commerce = createCommerce(environment, { wallet });

    await commerce.grantPayment(ledger, uid, structuredClone(payment), context); // the original purchase
    assert.equal(roche, 4000000, 'US$4 allowance recorded in ROCHE (millionths of USD)');
    await commerce.grantPayment(ledger, uid, structuredClone(payment), context); // "Restore purchases" replay
    assert.deepEqual(adjustments, [4000000], 'restore never credits the same purchase twice');

    const access = await createManagedAccess(environment, wallet).ensure(context, uid);
    assert.equal(access.state, 'ready', 'restored purchase is spendable');
    assert.equal(access.limitUsd, 4, 'key limit comes from the authoritative RevenueCat balance');
    assert.equal(access.balanceSource, 'revenuecat');
    assert.equal(openrouter.calls.filter(c => c.method === 'POST').length, 1);
  } finally {
    globalThis.fetch = realFetch;
  }
});
