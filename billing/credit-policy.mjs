// Firebase approximate-token credit policy. Callers supply environment settings
// and verified payment facts; this module performs no I/O or settlement writes.
class CreditPolicyError extends Error {
  constructor(binding, detail) {
    super(`${binding} ${detail}`);
    this.name = 'CreditPolicyError';
    this.binding = binding;
  }
}

const isRecord = value => typeof value === 'object' && value !== null && !Array.isArray(value);
function requiredSetting(environment, name) {
  const value = environment[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new CreditPolicyError(name, 'must be explicitly configured.');
  }
  return value.trim();
}
function safeInteger(value, name, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new CreditPolicyError(name, `must be a safe integer from ${minimum} to ${maximum}.`);
  }
  return value;
}
function validatePolicy(policy) {
  if (!isRecord(policy)) throw new CreditPolicyError('Credit policy', 'must be an object.');
  if (typeof policy.policyVersion !== 'string' || policy.policyVersion.trim() === '') {
    throw new CreditPolicyError('BILLING_POLICY_VERSION', 'must be explicitly configured.');
  }
  if (policy.creditUnit !== 'approximate_token') {
    throw new CreditPolicyError('BILLING_CREDIT_UNIT', 'must be "approximate_token".');
  }
  if (policy.balanceStore !== 'firebase') {
    throw new CreditPolicyError('BILLING_CREDIT_BALANCE_STORE', 'must be "firebase".');
  }
  safeInteger(policy.topupAllocationBps, 'BILLING_TOPUP_ALLOCATION_BPS', 0, 10000);
  if (!isRecord(policy.products) || Object.keys(policy.products).length === 0) {
    throw new CreditPolicyError('BILLING_PRODUCTS_JSON', 'must contain actual product mappings.');
  }
  for (const [productId, product] of Object.entries(policy.products)) {
    if (productId.trim() === '' || productId.trim() !== productId || !isRecord(product)) {
      throw new CreditPolicyError('BILLING_PRODUCTS_JSON', 'must map exact nonblank product identifiers to product objects.');
    }
    safeInteger(product.creditQuantity, 'BILLING_PRODUCTS_JSON creditQuantity', 1);
    if (product.currency !== 'USD') {
      throw new CreditPolicyError('BILLING_PRODUCTS_JSON currency', 'must be "USD" for the current allocation policy.');
    }
    if (product.kind !== 'credits' && product.kind !== 'souvenir') {
      throw new CreditPolicyError('BILLING_PRODUCTS_JSON kind', 'must be "credits" or "souvenir".');
    }
    if (product.kind === 'souvenir') {
      safeInteger(product.inferenceAllowanceUsdMicros, 'BILLING_PRODUCTS_JSON inferenceAllowanceUsdMicros');
    }
  }
  return policy;
}

export function readCreditPolicy(environment) {
  if (!isRecord(environment)) throw new CreditPolicyError('Credit policy environment', 'must be supplied by the caller.');
  const policyVersion = requiredSetting(environment, 'BILLING_POLICY_VERSION');
  const creditUnit = requiredSetting(environment, 'BILLING_CREDIT_UNIT');
  const balanceStore = requiredSetting(environment, 'BILLING_CREDIT_BALANCE_STORE');
  const rawBps = requiredSetting(environment, 'BILLING_TOPUP_ALLOCATION_BPS');
  if (!/^\d+$/.test(rawBps)) {
    throw new CreditPolicyError('BILLING_TOPUP_ALLOCATION_BPS', 'must be an integer from 0 to 10000.');
  }
  const topupAllocationBps = safeInteger(Number(rawBps), 'BILLING_TOPUP_ALLOCATION_BPS', 0, 10000);
  const rawProducts = requiredSetting(environment, 'BILLING_PRODUCTS_JSON');
  let products;
  try { products = JSON.parse(rawProducts); }
  catch { throw new CreditPolicyError('BILLING_PRODUCTS_JSON', 'must be a JSON object of actual product mappings.'); }
  const policy = validatePolicy({ policyVersion, creditUnit, balanceStore, topupAllocationBps, products });
  for (const product of Object.values(products)) Object.freeze(product);
  Object.freeze(products);
  return Object.freeze(policy);
}

export function allocateCreditPurchase(policy, payment) {
  validatePolicy(policy);
  if (!isRecord(payment) || typeof payment.productId !== 'string' || payment.productId.trim() === '') {
    throw new CreditPolicyError('Verified payment productId', 'must be supplied.');
  }
  if (payment.currency !== 'USD') {
    throw new CreditPolicyError('Verified payment currency', 'must be "USD" for the current allocation policy.');
  }
  safeInteger(payment.eligiblePaidUsdMicros, 'Verified payment eligiblePaidUsdMicros');
  if (!Object.hasOwn(policy.products, payment.productId)) {
    throw new CreditPolicyError('BILLING_PRODUCTS_JSON', 'has no mapping for the verified product; refusing a substitute.');
  }
  const product = policy.products[payment.productId];
  // BigInt preserves exact floor arithmetic even when the intermediate product
  // exceeds Number's safe range. Credits are explicit grants, never USD-derived.
  const allowance = product.kind === 'credits'
    ? BigInt(payment.eligiblePaidUsdMicros) * BigInt(policy.topupAllocationBps) / 10000n
    : BigInt(product.inferenceAllowanceUsdMicros);
  if (allowance > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new CreditPolicyError('Provider allowance USD micros', 'exceeds the safe integer range.');
  }
  return Object.freeze({
    policyVersion: policy.policyVersion,
    productId: payment.productId,
    creditQuantity: product.creditQuantity,
    providerAllowanceUsdMicros: Number(allowance),
  });
}
