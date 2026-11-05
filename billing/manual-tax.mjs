import { money } from './firebase-ledger.mjs';

export function billingBuyer(input, email) {
  const clean = (value, max = 180) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  const address = input?.address || {};
  const buyer = { name: clean(input?.name), email: clean(email), address: {
    line1: clean(address.line1), line2: clean(address.line2), city: clean(address.city),
    state: clean(address.state, 12).toUpperCase(), postal_code: clean(address.postal_code, 24).toUpperCase(), country: clean(address.country, 2).toUpperCase(),
  } };
  if (!buyer.name || !buyer.address.line1 || !buyer.address.city || !buyer.address.state || !buyer.address.postal_code || !/^[A-Z]{2}$/.test(buyer.address.country)) {
    throw Object.assign(new Error('Enter your billing name and complete address for your receipt.'), { status: 400, code: 'BILLING_DETAILS_REQUIRED' });
  }
  return buyer;
}
export function readManualTaxPolicy(environment, buyer) {
  let policy;
  try { policy = JSON.parse(environment.BILLING_MANUAL_TAX_POLICY_JSON); } catch { throw new Error('The tax policy is not configured.'); }
  const jurisdiction = `${buyer.address.country}-${buyer.address.state}`;
  const rule = policy.jurisdictions?.[jurisdiction];
  if (!policy.version || policy.pricesIncludeTax !== false || !rule || !Number.isSafeInteger(rule.basisPoints) || rule.basisPoints < 0 || rule.basisPoints > 10000 || typeof rule.label !== 'string') {
    throw Object.assign(new Error('Purchases are not yet available for this billing jurisdiction.'), { status: 400 });
  }
  return { version: policy.version, pricesIncludeTax: false, jurisdiction, country: buyer.address.country, label: rule.label, basisPoints: rule.basisPoints };
}
export function calculateManualTax(amountMicros, policy, { paidTotal = false } = {}) {
  money(amountMicros);
  if (amountMicros % 10000 !== 0) throw new Error('The confirmed payment does not have a supported currency precision.');
  const cents = BigInt(amountMicros / 10000), rate = BigInt(policy.basisPoints), denominator = paidTotal ? 10000n + rate : 10000n;
  const taxCents = (cents * rate + denominator / 2n) / denominator;
  const taxMicros = Number(taxCents) * 10000;
  return { totalMicros: paidTotal ? amountMicros : amountMicros + taxMicros, taxMicros, subtotalMicros: paidTotal ? amountMicros - taxMicros : amountMicros,
    taxDetails: rate > 0n ? [{ amount: Number(taxCents), tax_rate: { country: policy.country, display_name: policy.label, tax_type: policy.label, percentage: policy.basisPoints / 100 } }] : [] };
}
