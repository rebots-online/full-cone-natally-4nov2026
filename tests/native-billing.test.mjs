import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import path from 'node:path';

// UX-PLAY-1: execute production services with a controlled IPC/provider boundary.
// These checks exercise ownership/routing; they do not claim a store purchase.
async function service(entry, fixture, env = {}) {
  if (process.env.NATIVE_BILLING_SOURCE_ROOT) entry = path.resolve(process.env.NATIVE_BILLING_SOURCE_ROOT, entry);
  globalThis.__nativeBillingFixture = fixture;
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node',
    define: { 'import.meta.env': JSON.stringify(env) },
    plugins: [{ name: 'billing-test-boundaries', setup(builder) {
      builder.onResolve({ filter: /^@tauri-apps\/api\/core$|^@revenuecat\/purchases-js$|^\.\/firebase$/ }, args => ({ path: args.path, namespace: 'fixture' }));
      builder.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents:
        args.path === '@tauri-apps/api/core'
          ? 'const f=globalThis.__nativeBillingFixture; export const isTauri=()=>f.native; export const invoke=(...args)=>f.invoke(...args);'
          : args.path === './firebase'
            ? 'export const auth=globalThis.__nativeBillingFixture.auth;'
            : 'const f=globalThis.__nativeBillingFixture; export const Purchases=f.Purchases; export class PurchasesError extends Error {} export const ErrorCode={UserCancelledError:1}; export const ProductType={Subscription:"subscription",Consumable:"consumable",NonConsumable:"non_consumable"};', loader: 'js' }));
    } }],
  });
  const content = result.outputFiles[0].text + `\n//# sourceURL=native-billing-fixture-${crypto.randomUUID()}.mjs`;
  return import('data:text/javascript;base64,' + Buffer.from(content).toString('base64'));
}

function nativeFixture() {
  const calls = [];
  let listener;
  const fixture = {
    native: true, calls,
    auth: {
      currentUser: { uid: 'fixture-owner', email: 'fixture@example.invalid' },
      authStateReady: async () => {},
      onAuthStateChanged(callback) { listener = callback; callback(this.currentUser); return () => {}; },
    },
    switchOwner(uid) { this.auth.currentUser = uid ? { uid } : null; listener?.(this.auth.currentUser); },
    Purchases: new Proxy({}, { get() { throw new Error('Web SDK must not be used for Android'); } }),
    async invoke(command, args) {
      calls.push({ command, args });
      if (command === 'native_billing_platform') return 'android';
      const { ownerUid, generation } = args.payload;
      const echo = { ownerUid, generation };
      if (args.command === 'customer' || args.command === 'restore') {
        return { ...echo, customer: { ownerUid, activeEntitlementIds: ['fixture-downloads'], entitlementExpirations: { 'fixture-downloads': Date.now() + 120000 }, purchasedProductIds: ['fixture-souvenir'] } };
      }
      if (args.command === 'balance') return { ...echo, currency: 'ROCHE', balance: 7, fetchedAt: Date.now() };
      if (args.command === 'quote') return { ...echo, kind: args.payload.kind, quoteId: crypto.randomUUID(), packageIdentifier: args.payload.packageIdentifier, productIdentifier: args.payload.productIdentifier, formattedPrice: '$5.00', amountMicros: 5000000, currency: 'USD', expiresAt: Date.now() + 120000, productType: 'subscription', billingPeriod: 'P1M', productTitle: 'Fixture monthly product' };
      if (args.command === 'purchase') return { ...echo, state: 'pending' };
      return echo;
    },
  };
  return fixture;
}

const env = {
  VITE_REVENUECAT_DEFAULT_CREDIT_TIER: '5',
  VITE_REVENUECAT_ANDROID_PUBLIC_KEY: 'goog_fixture',
  VITE_REVENUECAT_OFFERING_ID: 'fixture-offering',
  VITE_REVENUECAT_CONVERSATION_PACKAGE_ID: 'fixture-package',
  VITE_REVENUECAT_ANDROID_CONVERSATION_PRODUCT_ID: 'fixture-product:monthly',
  VITE_REVENUECAT_CONVERSATION_PACKS_JSON: JSON.stringify([{ cadence: 'monthly', tier: '5', packageIdentifier: 'fixture-package', androidProductIdentifier: 'fixture-product:monthly' }]),
};

test('passive purchase-history matching retains configured products without checkout packages', async () => {
  const f = nativeFixture();
  const api = await service('src/services/revenueCatCheckout.ts', f, {
    VITE_REVENUECAT_READING_PRODUCT_ID: 'owned-web-product',
    VITE_REVENUECAT_ANDROID_CONVERSATION_PRODUCT_ID: 'owned-play-product:monthly',
  });
  assert.deepEqual(api.configuredCheckoutProductIds().sort(), ['owned-play-product:monthly', 'owned-web-product']);
  assert.equal(f.calls.length, 0);
});

test('native bridge rejects foreign-owner and stale-generation callback envelopes', async () => {
  for (const wrong of [{ ownerUid: 'other' }, { generation: 0 }]) {
    const f = nativeFixture();
    f.invoke = async () => ({ ownerUid: 'fixture-owner', generation: 123, ...wrong });
    const api = await service('src/services/nativeRevenueCat.ts', f);
    await assert.rejects(api.getNativeCustomer({ ownerUid: 'fixture-owner', generation: 123 }), /owner|generation/i);
  }
});

test('native platform failure is propagated and retried, never downgraded to web', async () => {
  const f = nativeFixture();
  let attempts = 0;
  f.invoke = async () => { if (++attempts === 1) throw new Error('native bridge unavailable'); return 'android'; };
  const api = await service('src/services/nativeRevenueCat.ts', f);
  await assert.rejects(api.isNativeAndroid(), /native bridge unavailable/);
  assert.equal(await api.isNativeAndroid(), true);
  assert.equal(attempts, 2);
});

test('Android passive reads and explicit restore remain distinct without product configuration', async () => {
  const f = nativeFixture();
  const api = await service('src/services/revenueCatCheckout.ts', f, { VITE_REVENUECAT_ANDROID_PUBLIC_KEY: 'goog_fixture' });
  const customer = await api.getCheckoutCustomer();
  assert.equal(customer.ownerUid, 'fixture-owner');
  assert.deepEqual(customer.purchasedProductIds, ['fixture-souvenir']);
  assert.deepEqual(customer.activeEntitlementIds, ['fixture-downloads']);
  assert.ok(customer.entitlementExpirations['fixture-downloads'] > Date.now());
  assert.equal(f.calls.some(call => call.args?.command === 'restore'), false);
  const balance = await api.getRocheBalance();
  assert.equal(balance.balance, 7);
  await api.restoreCheckoutCustomer();
  assert.equal(f.calls.filter(call => call.args?.command === 'restore').length, 1);
  const configured = f.calls.find(call => call.args?.command === 'configureOwner');
  assert.equal(configured.args.payload.publicKey, 'goog_fixture');
});

test('native monthly quote retains terms, pending outcome and one-use consumption', async () => {
  const f = nativeFixture();
  const api = await service('src/services/revenueCatCheckout.ts', f, env);
  const quote = await api.getCheckoutOffer('conversation');
  assert.equal(quote.productType, 'subscription');
  assert.equal(quote.billingPeriod, 'P1M');
  assert.equal(quote.productIdentifier, env.VITE_REVENUECAT_ANDROID_CONVERSATION_PRODUCT_ID);
  assert.deepEqual(await api.purchaseCheckoutOffer(quote), { state: 'pending' });
  await assert.rejects(api.purchaseCheckoutOffer(quote), /recognized|quote|offer/i);
  assert.equal(f.calls.filter(call => call.args?.command === 'purchase').length, 1);
});

test('account change invalidates a quoted purchase before native payment invocation', async () => {
  const f = nativeFixture();
  const api = await service('src/services/revenueCatCheckout.ts', f, env);
  const quote = await api.getCheckoutOffer('conversation');
  f.switchOwner('new-owner');
  await assert.rejects(api.purchaseCheckoutOffer(quote), /account|owner|recognized|quote|offer/i);
  assert.equal(f.calls.some(call => call.args?.command === 'purchase'), false);
});

test('native purchase projects confirmed customer separately from cancellation', async () => {
  for (const state of ['purchased', 'cancelled']) {
    const f = nativeFixture();
    const original = f.invoke.bind(f);
    f.invoke = async (...args) => {
      const response = await original(...args);
      if (args[1]?.command !== 'purchase') return response;
      return { ...response, state, customer: { ownerUid: response.ownerUid, activeEntitlementIds: [], entitlementExpirations: {}, purchasedProductIds: ['fixture-product:monthly'] } };
    };
    const api = await service('src/services/revenueCatCheckout.ts', f, env);
    const outcome = await api.purchaseCheckoutOffer(await api.getCheckoutOffer('conversation'));
    assert.equal(outcome.state, state);
    if (state === 'purchased') assert.deepEqual(outcome.customerInfo.purchasedProductIds, ['fixture-product:monthly']);
    else assert.deepEqual(outcome, { state: 'cancelled' });
  }
});

test('delayed customer callback is discarded after the signed-in owner changes', async () => {
  const f = nativeFixture();
  const original = f.invoke.bind(f);
  let release;
  let started;
  const ready = new Promise(resolve => { started = resolve; });
  f.invoke = async (...args) => {
    if (args[1]?.command !== 'customer') return original(...args);
    const response = await original(...args);
    started();
    await new Promise(resolve => { release = resolve; });
    return response;
  };
  const api = await service('src/services/revenueCatCheckout.ts', f, env);
  const pending = api.getCheckoutCustomer();
  await ready;
  f.switchOwner('new-owner');
  release();
  await assert.rejects(pending, /account|owner|changed|generation/i);
});

test('native balance rejects a different currency rather than relabeling it ROCHE', async () => {
  const f = nativeFixture();
  const original = f.invoke.bind(f);
  f.invoke = async (...args) => {
    const response = await original(...args);
    return args[1]?.command === 'balance' ? { ...response, currency: 'OTHER' } : response;
  };
  const api = await service('src/services/revenueCatCheckout.ts', f, env);
  await assert.rejects(api.getRocheBalance(), /ROCHE|currency|balance/i);
});

test('active entitlement without an actual expiry entry remains unknown', async () => {
  const f = nativeFixture();
  const original = f.invoke.bind(f);
  f.invoke = async (...args) => {
    const response = await original(...args);
    if (args[1]?.command === 'customer') response.customer.entitlementExpirations = {};
    return response;
  };
  const api = await service('src/services/revenueCatCheckout.ts', f, env);
  await assert.rejects(api.getCheckoutCustomer(), /entitlement|expiry|expiration/i);
});

test('web projection preserves purchased products and actual recurring product terms', async () => {
  const f = nativeFixture();
  f.native = false;
  const expiry = new Date(Date.now() + 600000);
  const sdk = {
    getAppUserId: () => f.auth.currentUser.uid,
    getCustomerInfo: async () => ({
      entitlements: { active: { downloads: { isActive: true, expirationDate: expiry } } },
      allPurchaseDatesByProduct: { monthly: new Date(), absent: null },
      nonSubscriptionTransactions: [{ productIdentifier: 'keepsake' }],
    }),
    getOfferings: async () => ({ all: { catalog: { packagesById: { monthly: {
      identifier: 'monthly', product: { identifier: 'monthly-sku', title: 'Monthly fixture', productType: 'subscription', normalPeriodDuration: 'P1M', price: { amountMicros: 5000000, currency: 'USD', formattedPrice: '$5.00' } },
    } } } } }),
  };
  f.Purchases = { isConfigured: () => true, getSharedInstance: () => sdk };
  const api = await service('src/services/revenueCatCheckout.ts', f, {
    VITE_REVENUECAT_DEFAULT_CREDIT_TIER: '5',
    VITE_REVENUECAT_PUBLIC_KEY: 'rcb_fixture', VITE_REVENUECAT_OFFERING_ID: 'catalog',
    VITE_REVENUECAT_CONVERSATION_PACKAGE_ID: 'monthly', VITE_REVENUECAT_CONVERSATION_PRODUCT_ID: 'monthly-sku',
    VITE_REVENUECAT_CONVERSATION_PACKS_JSON: JSON.stringify([{ cadence: 'monthly', tier: '5', packageIdentifier: 'monthly', webProductIdentifier: 'monthly-sku' }]),
  });
  const customer = await api.getCheckoutCustomer();
  assert.deepEqual(customer.purchasedProductIds.sort(), ['keepsake', 'monthly']);
  assert.equal(customer.entitlementExpirations.downloads, expiry.getTime());
  const quote = await api.getCheckoutOffer('conversation');
  assert.equal(quote.productType, 'subscription');
  assert.equal(quote.billingPeriod, 'P1M');
  assert.equal(f.calls.length, 0);
});
