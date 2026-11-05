export class BillingError extends Error {
  constructor(message, status = 503) { super(message); this.status = status; }
}
export const required = (env, name) => {
  const value = env(name)?.trim();
  if (!value) throw new BillingError('Payment configuration is incomplete.');
  return value;
};
export function integer(value, min = 0) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < min) throw new BillingError('Invalid payment configuration.');
  return number;
}
export function usdMicros(value) {
  if (!/^\d+(\.\d{1,6})?$/.test(String(value))) throw new BillingError('Invalid USD amount.');
  const [whole, fraction = ''] = String(value).split('.');
  return integer(Number(whole) * 1000000 + Number(fraction.padEnd(6, '0')));
}
export function configuration(env) {
  const version = env('BILLING_POLICY_VERSION');
  if (version !== 'v3') throw new BillingError('This checkout requires billing policy v3.');
  const project = required(env, 'REVENUECAT_PROJECT_ID');
  if (!required(env,'REVENUECAT_PUBLIC_API_KEY').startsWith('rcb_') || required(env,'REVENUECAT_PUBLIC_API_KEY').startsWith('rcb_sb_')) throw new BillingError('Live checkout requires the production Web Billing key.');
  const products = JSON.parse(env('BILLING_PRODUCTS_JSON') || '{}');
  for (const [id, product] of Object.entries(products)) {
    if (!/^[a-z0-9_-]{1,64}$/.test(id) || !product.title || !['bundle','topup','download'].includes(product.kind)) throw new BillingError('Invalid product catalog.');
    for (const field of ['usdMicros','sats','roche','turns','inferenceMicros']) product[field] = integer(product[field] ?? 0);
    if (product.kind === 'bundle' && product.turns !== 10) throw new BillingError('Reading bundles require ten completed turns.');
    if (product.usdMicros < 990000) throw new BillingError('Card products require at least USD 0.99.');
    if (product.kind === 'topup' && (product.sats || product.x402Amount)) {
      // Funding the provider in USD requires a separately configured, explicit
      // allowance for non-USD rails. Never invent a BTC/ROCHE exchange rate.
      if (!product.inferenceMicros) throw new BillingError('Crypto top-ups need an explicit provider allowance.');
    }
  }
  const capabilities = JSON.parse(env('REVENUECAT_CAPABILITIES_JSON') || '{}');
  if (Object.keys(capabilities).length > 12 || Object.keys(capabilities).some(key => !/^[a-z_]{1,32}$/.test(key))) throw new BillingError('Invalid capability mapping.');
  return { project, version, products, capabilities, environment: 'production',
    app: required(env, 'REVENUECAT_APP_ID'), offering: required(env, 'REVENUECAT_OFFERING_ID'),
    publicKey: required(env, 'REVENUECAT_PUBLIC_API_KEY') };
}
export function rails(env, product) {
  return {
    revenuecat: !!(product.productId && product.packageId && env('REVENUECAT_SECRET_API_KEY')),
    alby: !!(product.sats && env('ALBY_NWC_URL')),
    blink: !!(product.sats && env('BLINK_API_KEY') && env('BLINK_WALLET_ID')),
    x402: !!(product.x402Amount && env('X402_FACILITATOR_URL') && env('X402_NETWORK') && env('X402_ASSET') && env('X402_PAY_TO')),
  };
}
