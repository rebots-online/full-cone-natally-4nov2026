import { randomUUID } from 'node:crypto';
import { digest } from './firebase-ledger.mjs';

const pending = () => Object.assign(new Error('This purchase amount is being prepared. Retry shortly.'), { code: 'BILLING_PENDING' });
export function createRevenueCatCatalog(environment, command) {
  const project = environment.REVENUECAT_PROJECT_ID;
  const app = environment.REVENUECAT_WEB_APP_ID;
  const offering = environment.REVENUECAT_OFFERING_ID;
  const requireConfig = () => { if (!project || !app || !offering) throw new Error('The purchase catalog is not configured.'); };
  async function products(call) {
    const items = []; let next = `/projects/${encodeURIComponent(project)}/products?app_id=${encodeURIComponent(app)}&limit=100`;
    for (let page = 0; page < 200; page++) {
      const result = await call(['api', 'GET', next]);
      if (!Array.isArray(result.items)) throw new Error('The purchase catalog could not be read.');
      items.push(...result.items.filter(item => item.app_id === app));
      if (!result.next_page) return items;
      const target = new URL(result.next_page, 'https://api.revenuecat.com');
      if (target.origin !== 'https://api.revenuecat.com' || target.pathname !== `/v2/projects/${project}/products`) throw new Error('The purchase catalog page is incomplete.');
      next = target.pathname.replace(/^\/v2/, '') + target.search;
    }
    throw new Error('The purchase catalog could not be fully read.');
  }
  async function verifyProduct(product, cents, call) {
    if (product.app_id !== app || product.state !== 'active' || product.type !== 'one_time' || product.one_time?.is_consumable !== true) throw new Error('This amount is not configured as a repeatable purchase.');
    const prices = await call(['products', 'prices', product.id]);
    const price = Array.isArray(prices) && prices.find(item => item.currency === 'USD');
    if (!price || price.amount_micros !== cents * 10000) throw new Error('The purchase price does not match the requested amount.');
    return price;
  }
  async function ensure(ledger, cents, policyIdentity) {
    requireConfig();
    if (!Number.isSafeInteger(cents) || cents < 500) throw new Error('The purchase amount is invalid.');
    if (typeof policyIdentity !== 'string' || !policyIdentity) throw new Error('The purchase tax identity is missing.');
    const variant = digest(policyIdentity).slice(0, 16);
    const id = digest(`${project}:USD:${cents}:${variant}`), cached = await ledger.read('natallyBillingCatalog', id);
    if (cached) return cached.payload;
    const lockId = digest(`revenuecat-catalog:${project}`), owner = randomUUID();
    let lock;
    for (let attempt = 0; attempt < 5; attempt++) {
      const old = await ledger.read('natallyBillingProviderLocks', lockId);
      if (old?.payload.owner && old.payload.leaseUntil > Date.now()) throw pending();
      lock = { ...(old?.payload || {}), owner, leaseUntil: Date.now() + 300000, cents: old?.payload.cents ?? cents, variant: old?.payload.variant ?? variant };
      if (await ledger.commit([ledger.write('natallyBillingProviderLocks', lockId, lock, old ? { updateTime: old.updateTime } : { exists: false })])) break;
      if (attempt === 4) throw pending();
    }
    const save = async change => {
      const state = await ledger.read('natallyBillingProviderLocks', lockId);
      if (state?.payload.owner !== owner) throw pending();
      lock = { ...state.payload, ...change, leaseUntil: Date.now() + 300000 };
      if (!await ledger.commit([ledger.write('natallyBillingProviderLocks', lockId, lock, { updateTime: state.updateTime })])) throw pending();
    };
    const call = async (args, input) => { await save({}); return command(args, input); };
    async function provision(amount, taxVariant) {
      const lookup = `natally_credit_usd_${amount}_${taxVariant}`, title = `Natally credits — total US$${(amount / 100).toFixed(2)}`;
      let product = (await products(call)).find(item => item.store_identifier === lookup);
      if (!product) {
        const plans = await call(['products', 'store', 'list']);
        let plan;
        if (lock.planId) plan = await call(['products', 'store', 'show', lock.planId]);
        if (!plan) {
          for (const candidate of plans.items || []) {
            if (['discarded', 'applied'].includes(candidate.status)) continue;
            const detailed = await call(['products', 'store', 'show', candidate.id]);
            if (detailed.desired_states?.some(item => item.create_revenuecat_product?.store_identifier === lookup)) { plan = detailed; break; }
            throw pending();
          }
        }
        if (!plan) {
          await save({ cents: amount, variant: taxVariant, creatingPlan: true });
          plan = await call(['products', 'store', 'plan', app, '--input-format', 'json'], { desired_states: [{
            create_revenuecat_product: { app_id: app, store_identifier: lookup, type: 'consumable', display_name: title, title },
            store: 'rc_billing', common: { title, pricing: { currency_prices: { USD: { amount_micros: amount * 10000 } } } }, store_state: {},
          }] });
          await save({ planId: plan.id, creatingPlan: false });
        }
        const states = plan.desired_states || [];
        if (states.length !== 1 || states[0].create_revenuecat_product?.store_identifier !== lookup || states[0].common?.pricing?.currency_prices?.USD?.amount_micros !== amount * 10000) throw new Error('The prepared purchase amount does not match its catalog plan.');
        if ([...(plan.warnings || []), ...(plan.plan_items || []).flatMap(item => item.warnings || [])].some(item => item.severity === 'blocker')) throw new Error('This purchase amount requires catalog configuration.');
        if (plan.status !== 'applied') {
          if (!plan.actions?.includes('apply')) throw pending();
          plan = await call(['products', 'store', 'apply', plan.id, '--yes']);
          if (plan.status !== 'applied' || plan.plan_items?.some(item => item.apply_status !== 'applied')) throw pending();
        }
        product = (await products(call)).find(item => item.store_identifier === lookup);
        if (!product) throw pending();
      }
      await verifyProduct(product, amount, call);
      const packages = await call(['offerings', 'packages', offering]);
      let pkg = packages.items?.find(item => item.lookup_key === lookup);
      if (!pkg) pkg = await call(['packages', 'create', offering, '--lookup-key', lookup, '--display-name', title]);
      const attached = await call(['packages', 'products', pkg.id]);
      const linked = attached.items || [];
      if (linked.some(item => item.product?.app_id === app && item.product.id !== product.id)) throw new Error('The purchase package has a conflicting product.');
      if (!linked.some(item => (item.product?.id || item.id) === product.id)) await call(['packages', 'attach', pkg.id, product.id]);
      const confirmed = await call(['packages', 'products', pkg.id]);
      if (!(confirmed.items || []).some(item => (item.product?.id || item.id) === product.id)) throw pending();
      const value = { currency: 'USD', amountMicros: amount * 10000, cents: amount, productId: product.id,
        productIdentifier: lookup, packageId: pkg.id, packageIdentifier: lookup, offeringId: offering,
        offeringIdentifier: environment.REVENUECAT_OFFERING_IDENTIFIER || environment.VITE_REVENUECAT_OFFERING_ID, description: title, verifiedAt: new Date().toISOString() };
      const catalogId = digest(`${project}:USD:${amount}:${taxVariant}`), existing = await ledger.read('natallyBillingCatalog', catalogId);
      if (!existing && !await ledger.commit([ledger.write('natallyBillingCatalog', catalogId, value, { exists: false })])) throw pending();
      await save({ cents: null, variant: null, planId: null, creatingPlan: false });
      return existing?.payload || value;
    }
    try {
      if (lock.cents !== cents || lock.variant !== variant) await provision(lock.cents, lock.variant);
      const result = await provision(cents, variant);
      await save({ owner: null, leaseUntil: 0 });
      return result;
    } catch (error) {
      await save({ owner: null, leaseUntil: 0 }).catch(() => {});
      throw error;
    }
  }
  return { ensure };
}
