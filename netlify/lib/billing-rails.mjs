import { createHash } from 'node:crypto';
import { NWCClient } from '@getalby/sdk/nwc';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { BillingError, required } from './billing-config.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
async function alby(env, run) {
  const client = new NWCClient({nostrWalletConnectUrl:required(env,'ALBY_NWC_URL')});
  try { return await run(client); } finally { client.close(); }
}
async function blink(env, query, input, field) {
  const response = await fetch('https://api.blink.sv/graphql', {method:'POST',headers:{'X-API-KEY':required(env,'BLINK_API_KEY'),'Content-Type':'application/json'},body:JSON.stringify({query,variables:{input}}),signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new BillingError('Lightning provider is unavailable.');
  const result = await response.json();
  if (result.errors?.length || result.data?.[field]?.errors?.length || !result.data?.[field]) throw new BillingError('Lightning provider could not confirm this invoice.');
  return result.data[field];
}
export async function createLightning(env, order) {
  if (order.rail === 'alby') {
    const invoice = await alby(env, client => client.makeInvoice({amount:order.state.product.sats*1000,description:'Natally '+order.id,expiry:900}));
    if (!invoice.payment_hash || !invoice.invoice) throw new BillingError('Lightning invoice is incomplete.');
    return {invoice:invoice.invoice,paymentHash:invoice.payment_hash};
  }
  const result = await blink(env,'mutation($input:LnInvoiceCreateInput!){lnInvoiceCreate(input:$input){errors{message}invoice{paymentRequest paymentHash}}}',
    {walletId:required(env,'BLINK_WALLET_ID'),amount:order.state.product.sats,memo:'Natally '+order.id},'lnInvoiceCreate');
  if (!result.invoice?.paymentHash || !result.invoice?.paymentRequest) throw new BillingError('Lightning invoice is incomplete.');
  return {invoice:result.invoice.paymentRequest,paymentHash:result.invoice.paymentHash};
}
export async function verifyLightning(env, order) {
  const invoice = order.state.lightning;
  if (!invoice) return null;
  if (order.rail === 'alby') {
    const payment = await alby(env, client => client.lookupInvoice({payment_hash:invoice.paymentHash}));
    if (payment.state !== 'settled' || !payment.settled_at) return null;
    if (payment.type !== 'incoming' || payment.payment_hash !== invoice.paymentHash || payment.amount !== order.state.product.sats*1000) throw new BillingError('Lightning payment does not match the invoice.');
  } else {
    const status = await blink(env,'query($input:LnInvoicePaymentStatusInput!){lnInvoicePaymentStatus(input:$input){errors{message}paymentHash status}}',{paymentRequest:invoice.invoice},'lnInvoicePaymentStatus');
    if (status.status !== 'PAID') return null;
    if (status.paymentHash !== invoice.paymentHash) throw new BillingError('Lightning payment does not match the invoice.');
  }
  return {transaction:invoice.paymentHash};
}
export function x402Requirements(env, order) {
  const amount = String(order.state.product.x402Amount);
  const network = required(env,'X402_NETWORK');
  if (!/^[1-9]\d*$/.test(amount) || !/^eip155:\d+$/.test(network)) throw new BillingError('Invalid crypto price or network.');
  const asset = required(env,'X402_ASSET'), payTo = required(env,'X402_PAY_TO');
  if (![asset,payTo].every(value => /^0x[a-fA-F0-9]{40}$/.test(value))) throw new BillingError('Invalid crypto asset or recipient.');
  return {scheme:'exact',network,asset,payTo,amount,maxTimeoutSeconds:300,extra:{name:required(env,'X402_ASSET_NAME'),version:env('X402_ASSET_VERSION') || '2'}};
}
export async function settleX402(env, store, order, payload) {
  if (order.state.settlement) return order.state.settlement;
  if (order.state.settling) throw new BillingError('Settlement is being reconciled. Do not pay again.',409);
  const requirements = order.state.requirements;
  if (payload?.x402Version !== 2 || !payload.payload || payload.accepted?.scheme !== 'exact' ||
      ['network','asset','amount','payTo'].some(key => payload.accepted[key] !== requirements[key])) throw new BillingError('Payment does not match this quote.',400);
  // EIP-3009 authorization identity, independent of signature serialization.
  const authorization = payload.payload.authorization;
  if (!authorization?.nonce || !authorization.from || authorization.to?.toLowerCase() !== requirements.payTo.toLowerCase() || String(authorization.value) !== requirements.amount) throw new BillingError('Only exact EIP-3009 crypto payments are supported.',400);
  const identity = hash([requirements.network,requirements.asset.toLowerCase(),authorization.from.toLowerCase(),authorization.nonce.toLowerCase()].join(':'));
  if (!await store.bindProof(identity,order.id)) throw new BillingError('This authorization belongs to another payment.',409);
  const url = new URL(required(env,'X402_FACILITATOR_URL'));
  if (url.protocol !== 'https:') throw new BillingError('Facilitator requires HTTPS.');
  const token = env('X402_FACILITATOR_TOKEN');
  const client = new HTTPFacilitatorClient({url:url.href,timeoutMs:12000,...(token ? {createAuthHeaders:async()=>{const headers={Authorization:'Bearer '+token};return {verify:headers,settle:headers,supported:headers};}} : {})});
  const verification = await client.verify(payload,requirements);
  if (!verification.isValid) throw new BillingError('Crypto authorization could not be verified.',400);
  order.state.settling = {identity,startedAt:Date.now()};
  await store.saveOrder(order); // Persist BEFORE settlement; ambiguous outcomes never resend.
  const settlement = await client.settle(payload,requirements);
  if (!settlement.success || !settlement.transaction || settlement.network !== requirements.network || (settlement.amount && settlement.amount !== requirements.amount)) throw new BillingError('Settlement needs reconciliation. Do not pay again.',409);
  order.state.settlement = settlement;
  await store.saveOrder(order);
  return settlement;
}
