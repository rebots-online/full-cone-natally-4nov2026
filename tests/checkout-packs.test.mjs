import test from 'node:test';
import assert from 'node:assert/strict';
import { build, transformSync } from 'esbuild';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// UX-PLAY-1: actual services/controllers; provider and React scheduling boundaries
// are controlled. Fixture prices are synthetic and do not activate a catalog.
const root = process.env.NATIVE_BILLING_SOURCE_ROOT || process.cwd();
const packs = ['monthly', 'one_time'].flatMap(cadence => ['5', '10', '25'].map(tier => ({
  cadence, tier, packageIdentifier: `fixture-${cadence}-${tier}`,
  webProductIdentifier: `web-${cadence}-${tier}`, androidProductIdentifier: `play-${cadence}-${tier}`,
})));
const packEnv = {
  VITE_REVENUECAT_CONVERSATION_PACKS_JSON: JSON.stringify([...packs].reverse()),
  VITE_REVENUECAT_ANDROID_PUBLIC_KEY: 'goog_fixture', VITE_REVENUECAT_PUBLIC_KEY: 'rcb_fixture',
  VITE_REVENUECAT_OFFERING_ID: 'fixture-offering', VITE_REVENUECAT_TERMS_URL: 'https://fixture.invalid/terms',
};
async function load(entry, fixture = {}, env = packEnv) {
  globalThis.__packFixture = fixture;
  const bundled = await build({ entryPoints: [path.join(root, entry)], bundle: true, write: false,
    format: 'esm', platform: 'node', define: { 'import.meta.env': JSON.stringify(env) },
    plugins: [{ name: 'pack-provider-boundaries', setup(b) {
      b.onResolve({ filter: /^@tauri-apps\/api\/core$|^@revenuecat\/purchases-js$|^\.\/firebase$/ }, a => ({ path: a.path, namespace: 'boundary' }));
      b.onLoad({ filter: /.*/, namespace: 'boundary' }, a => ({ loader: 'js', contents:
        a.path === '@tauri-apps/api/core' ? 'const f=globalThis.__packFixture;export const isTauri=()=>f.native;export const invoke=(...a)=>f.invoke(...a);'
          : a.path === './firebase' ? 'export const auth=globalThis.__packFixture.auth;'
            : 'export const Purchases=globalThis.__packFixture.Purchases;export class PurchasesError extends Error{};export const ErrorCode={UserCancelledError:1};' }));
    } }],
  });
  return import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text + `\n//# sourceURL=pack-fixture-${crypto.randomUUID()}.mjs`).toString('base64'));
}
function fixture() {
  const calls = [], nativeQuotes = new Map();
  return {
    calls, native: true,
    auth: { currentUser: { uid: 'pack-owner' }, authStateReady: async () => {}, onAuthStateChanged(fn) { fn(this.currentUser); return () => {}; } },
    Purchases: new Proxy({}, { get() { throw Error('Android must not call Web SDK'); } }),
    async invoke(command, args) {
      calls.push({ command, args });
      if (command === 'native_billing_platform') return 'android';
      const p = args.payload, echo = { ownerUid: p.ownerUid, generation: p.generation };
      if (args.command === 'quote') {
        const monthly = p.productIdentifier.includes('-monthly-');
        const quoteId = crypto.randomUUID(); nativeQuotes.set(quoteId, p);
        return { ...echo, ...p, quoteId, formattedPrice: 'CA$13.77', amountMicros: 13770000, currency: 'CAD',
          expiresAt: Date.now() + 120000, productTitle: `Provider ${p.productIdentifier}`,
          productType: monthly ? 'subscription' : 'one_time', billingPeriod: monthly ? 'P1M' : null };
      }
      if (args.command === 'purchase') {
        assert.ok(nativeQuotes.has(p.quoteId));
        return { ...echo, state: 'cancelled' };
      }
      return echo;
    },
  };
}

test('catalog orders all six configured slots monthly-first and retains exact platform products', async () => {
  const api = await load('src/services/checkoutCatalog.ts');
  const entries = api.checkoutEntries('android', 'conversation');
  assert.deepEqual(entries.map(e => e.offerId), packs.map(p => `${p.cadence}-${p.tier}`));
  assert.deepEqual(entries.map(e => e.productIdentifier), packs.map(p => p.androidProductIdentifier));
  assert.equal(api.checkoutEntry('web', 'conversation', 'one_time-25').productIdentifier, 'web-one_time-25');
  assert.equal(api.checkoutEntry('android', 'conversation').offerId, 'monthly-5');
});

test('retired conversation mapping is history only and cannot create an active offer', async () => {
  const api = await load('src/services/checkoutCatalog.ts', {}, {
    VITE_REVENUECAT_CONVERSATION_PACKAGE_ID: 'retired-package',
    VITE_REVENUECAT_CONVERSATION_PRODUCT_ID: 'retired-product',
    VITE_REVENUECAT_ANDROID_CONVERSATION_PRODUCT_ID: 'retired-play-product',
  });
  assert.deepEqual(api.checkoutEntries('android', 'conversation'), []);
  assert.throws(() => api.checkoutEntry('android', 'conversation'), /config|available|binding|offer|pack/i);
  assert.deepEqual(api.configuredCheckoutProductIds().sort(), ['retired-play-product', 'retired-product']);
});
test('missing platform products stay unavailable and invalid or duplicate slots are rejected', async () => {
  const webOnly = { ...packs[0] }; delete webOnly.androidProductIdentifier;
  const api = await load('src/services/checkoutCatalog.ts', {}, { VITE_REVENUECAT_CONVERSATION_PACKS_JSON: JSON.stringify([webOnly]) });
  assert.deepEqual(api.checkoutEntries('android', 'conversation'), []);
  assert.equal(api.checkoutEntries('web', 'conversation').length, 1);
  for (const input of ['{}', 'invalid-json', JSON.stringify([packs[0], packs[0]]), JSON.stringify([{ ...packs[0], tier: '2' }]),
    JSON.stringify([packs[0], { ...packs[1], androidProductIdentifier: packs[0].androidProductIdentifier }])]) {
    const invalid = await load('src/services/checkoutCatalog.ts', {}, { VITE_REVENUECAT_CONVERSATION_PACKS_JSON: input });
    assert.throws(() => invalid.checkoutEntries('android', 'conversation'));
  }
});
test('native catalog preserves provider prices and purchases only the explicitly selected one-off quote', async () => {
  const f = fixture(), api = await load('src/services/revenueCatCheckout.ts', f);
  const offers = await api.getCheckoutOffers('conversation');
  assert.deepEqual(offers.map(o => o.offerId), packs.map(p => `${p.cadence}-${p.tier}`));
  assert.ok(offers.every(o => o.formattedPrice === 'CA$13.77' && o.currency === 'CAD'));
  const chosen = offers.find(o => o.offerId === 'one_time-10');
  assert.equal(chosen.productIdentifier, 'play-one_time-10');
  assert.equal(chosen.billingPeriod, null);
  assert.deepEqual(await api.purchaseCheckoutOffer(chosen), { state: 'cancelled' });
  assert.equal(f.calls.find(c => c.args?.command === 'purchase').args.payload.quoteId, chosen.quoteId);
  await assert.rejects(api.purchaseCheckoutOffer(chosen), /offer|quote|recognized/i);
});
test('annual or one-off provider product cannot masquerade as a monthly slot', async () => {
  for (const wrong of [{ productType: 'subscription', billingPeriod: 'P1Y' }, { productType: 'one_time', billingPeriod: null }]) {
    const f = fixture(), invoke = f.invoke.bind(f);
    f.invoke = async (...args) => { const response = await invoke(...args); return args[1]?.command === 'quote' ? { ...response, ...wrong } : response; };
    const api = await load('src/services/revenueCatCheckout.ts', f);
    await assert.rejects(api.getCheckoutOffer('conversation', 'monthly-10'), /monthly|cadence|period|subscription|match/i);
    assert.equal(f.calls.some(c => c.args?.command === 'purchase'), false);
  }
});
test('unknown selected slot never substitutes another native product', async () => {
  const f = fixture(), api = await load('src/services/revenueCatCheckout.ts', f);
  await assert.rejects(api.getCheckoutOffer('conversation', 'monthly-1'));
  assert.equal(f.calls.some(c => c.args?.command === 'quote'), false);
});
test('web purchase revalidates the selected non-default package instead of the default tier', async () => {
  const f = fixture(); f.native = false;
  const byId = Object.fromEntries(packs.map(p => [p.packageIdentifier, { identifier: p.packageIdentifier, product: {
    identifier: p.webProductIdentifier, title: `Provider ${p.webProductIdentifier}`,
    productType: p.cadence === 'monthly' ? 'subscription' : 'consumable', normalPeriodDuration: p.cadence === 'monthly' ? 'P1M' : null,
    price: { amountMicros: 13770000, currency: 'CAD', formattedPrice: 'CA$13.77' },
  } }]));
  let purchased;
  const sdk = { getAppUserId: () => 'pack-owner', getOfferings: async () => ({ all: { 'fixture-offering': { packagesById: byId } } }),
    purchase: async ({ rcPackage }) => { purchased = rcPackage; return { customerInfo: { entitlements: { active: {} }, allPurchaseDatesByProduct: {}, nonSubscriptionTransactions: [] } }; } };
  f.Purchases = { isConfigured: () => true, getSharedInstance: () => sdk };
  const api = await load('src/services/revenueCatCheckout.ts', f);
  const quote = await api.getCheckoutOffer('conversation', 'monthly-25');
  assert.equal((await api.purchaseCheckoutOffer(quote)).state, 'purchased');
  assert.equal(purchased.identifier, 'fixture-monthly-25');
  assert.equal(f.calls.length, 0);
});

// Adapted from the independently exercised payment-recovery controller harness.
const compiled = transformSync(readFileSync(path.join(root, 'src/components/PurchaseAccess.tsx'), 'utf8'), { loader: 'tsx', format: 'cjs', target: 'es2022' }).code;
const tick = () => new Promise(resolve => setImmediate(resolve));
function controller(outcome = 'pending', available = packs) {
  const slots = [], effects = []; let cursor = 0, tree, authListener;
  const react = { createElement: (type, props, ...children) => ({ type, props: { ...props, children } }), createContext: () => ({ Provider: 'provider' }), useContext() {},
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], v => slots[i] = typeof v === 'function' ? v(slots[i]) : v]; },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useEffect(effect, deps) { const i = cursor++; if (!(i in slots) || !deps || deps.some((x, j) => x !== slots[i]?.[j])) { slots[i] = deps; effects.push(effect); } } };
  const auth = { currentUser: { uid: 'account-a' } }, counts = { purchase: 0, reconcile: 0, restore: 0 }, purchased = [];
  const offer = (kind, offerId = 'reading') => ({ kind, offerId, ownerUid: auth.currentUser.uid, expiresAt: Date.now() + 120000, formattedPrice: `Provider ${offerId}`,
    productIdentifier: `fixture-${offerId}`, productTitle: `Fixture ${offerId}`, productType: offerId.startsWith('monthly') ? 'subscription' : 'one_time', billingPeriod: offerId.startsWith('monthly') ? 'P1M' : null });
  const checkout = { getCheckoutOffer: async kind => offer(kind), getCheckoutOffers: async () => available.map(p => offer('conversation', `${p.cadence}-${p.tier}`)),
    purchaseCheckoutOffer: async quote => { counts.purchase++; purchased.push(quote.offerId); return { state: outcome }; } };
  const billing = { reconcileBillingAccess: async () => { counts.reconcile++; return { state: 'unavailable', connected: false }; },
    restoreBillingPurchases: async () => { counts.restore++; return { state: 'unavailable', connected: false, message: 'Unrelated purchase history.' }; } };
  const win = { location: { href: 'https://fixture.invalid/' }, history: { replaceState() {} }, setTimeout: () => 1, clearTimeout() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };
  const context = { module: { exports: {} }, exports: {}, URL, Date, console, window: win, document: { body: {} }, CustomEvent: class {}, require(name) {
    if (name === 'react') return react; if (name === 'react-dom') return { createPortal: x => x };
    if (name === 'firebase/auth') return { onAuthStateChanged: (a, fn) => { authListener = fn; fn(a.currentUser); return () => {}; } };
    if (name.endsWith('/firebase')) return { auth }; if (name.endsWith('/appIdentity')) return { APP_NAME: 'Fixture' };
    if (name.endsWith('/downloadAccess')) return { checkDownloadAccess: async () => ({ state: 'unavailable', message: 'No download entitlement' }) };
    if (name.endsWith('/revenueCatCheckout')) return checkout; if (name.endsWith('/billingAccess')) return billing;
    if (name.endsWith('/purchaseIntent')) return { purchaseIntent: (kind, sourceSection, offerId) => ({ kind, sourceSection, offerId }) };
    if (name === './FigmaPaywall') return { FigmaPaywall: 'paywall' }; if (name.endsWith('.css')) return {}; throw Error(name);
  } };
  vm.runInNewContext(compiled, context);
  const render = () => { cursor = 0; tree = context.module.exports.PurchaseAccessProvider({ children: null }); while (effects.length) effects.shift()(); return tree; };
  const find = (node, type) => { if (!node || typeof node !== 'object') return null; if (node.type === type) return node;
    for (const child of (node.props?.children ?? []).flat()) { const found = find(child, type); if (found) return found; } return null; };
  const view = () => { render(); return find(tree, 'paywall')?.props; };
  const open = async offerId => { render().props.value.showOffer('conversation', { kind: 'conversation', sourceSection: 'fixture', offerId }); await tick(); render(); await tick(); return view(); };
  const openReading = async () => { render().props.value.showOffer('reading', { kind: 'reading', sourceSection: 'fixture' }); await tick(); render(); await tick(); return view(); };
  render(); return { counts, purchased, open, openReading, view, changeAccount(uid) { auth.currentUser = { uid }; authListener(auth.currentUser); render(); } };
}
test('kind-only conversation opens monthly-first choices and purchases the exact chosen one-off', async () => {
  const f = controller('cancelled'); let view = await f.open();
  assert.equal(f.counts.purchase, 0); assert.equal(view.selectedOfferId, 'monthly-5'); assert.equal(view.options.length, 6);
  view.onSelect('one_time-25'); view = f.view(); assert.equal(view.selectedOfferId, 'one_time-25');
  view.onPurchase('conversation', 'monthly-5'); await tick(); assert.equal(f.counts.purchase, 0);
  view.onPurchase('conversation', 'one_time-25'); await tick(); view = f.view(); await tick();
  assert.deepEqual(f.purchased, ['one_time-25']); assert.equal(view.selectedOfferId, 'one_time-25');
});
test('explicit selected pack launches once, cancellation refresh never launches again', async () => {
  const f = controller('cancelled'); await f.open('monthly-10'); await tick(); f.view(); await tick();
  assert.deepEqual(f.purchased, ['monthly-10']); assert.equal(f.counts.reconcile, 0);
});
test('missing explicit pack cannot silently buy the default monthly pack', async () => {
  const f = controller(); await f.open('monthly-1'); await tick();
  assert.equal(f.counts.purchase, 0);
});
test('one-off choices remain selectable when monthly products are unavailable', async () => {
  const f = controller('cancelled', packs.filter(p => p.cadence === 'one_time'));
  const view = await f.open(); assert.equal(view.selectedOfferId, 'one_time-5');
  assert.equal(f.counts.purchase, 0); view.onPurchase('conversation', 'one_time-5'); await tick();
  assert.deepEqual(f.purchased, ['one_time-5']);
});
test('pending pack prevents repeat purchase of another pack across reopen and restore', async () => {
  const f = controller(); await f.open('monthly-10'); await tick(); let view = f.view();
  view.onClose(); view = await f.open(); view.onSelect('one_time-25'); view = f.view();
  view.onPurchase('conversation', 'one_time-25'); await tick(); view = f.view(); view.onRestore(); await tick();
  view = f.view(); view.onPurchase('conversation', 'one_time-25'); await tick();
  assert.deepEqual(f.purchased, ['monthly-10']); assert.equal(f.counts.reconcile, 0); assert.equal(f.counts.restore, 1);
});
test('account change invalidates a previously rendered selected pack action', async () => {
  const f = controller(); const view = await f.open(); f.changeAccount('account-b');
  view.onPurchase('conversation', 'monthly-5'); await tick(); assert.equal(f.counts.purchase, 0); assert.equal(f.view(), undefined);
});
test('existing reading CTA still launches once and confirmed payment remains in recovery', async () => {
  const f = controller('purchased'); await f.openReading(); await tick(); const view = f.view();
  assert.deepEqual(f.purchased, ['reading']); assert.equal(f.counts.reconcile, 1);
  assert.match(view.message, /confirmed/i); view.onPurchase('reading'); await tick();
  assert.equal(f.counts.purchase, 1);
});
