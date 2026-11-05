import { createHash } from 'node:crypto';
import { BillingError, rails, usdMicros } from './billing-config.mjs';
import { createLightning, verifyLightning, x402Requirements, settleX402 } from './billing-rails.mjs';
import { suspendManagedAccess } from './billing-access.mjs';
import { grantArchive } from './session-archive.mjs';
const identityFor = (...parts) => 'natally:' + createHash('sha256').update(JSON.stringify(parts)).digest('hex');
export const validUuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export function publicOrder(order, config) {
  return {id:order.id,rail:order.rail,product:order.product,status:order.state.status,
    canPay:order.state.status==='pending' && !order.state.checkoutStarted && !order.state.transaction && !order.state.settling && !order.state.settlement && order.state.expiresAt>Date.now(),
    expiresAt:new Date(order.state.expiresAt).toISOString(),invoice:order.state.lightning?.invoice,
    packageId:order.state.product.packageId,publicKey:config.publicKey,offering:'Natally',
    ...(order.state.requirements ? {paymentRequired:{x402Version:2,resource:{url:order.state.resourceUrl,description:order.state.product.title,mimeType:'application/json'},accepts:[order.state.requirements]}} : {})};
}
export async function createOrder(env, config, store, body) {
  if (!validUuid(body.requestId) || typeof body.resourceId !== 'string' || !/^[a-zA-Z0-9:_-]{1,160}$/.test(body.resourceId)) throw new BillingError('Invalid checkout request.',400);
  const product = config.products[body.product];
  if (!product || !rails(env,product)[body.rail]) throw new BillingError('This payment method is not configured.',409);
  if (!product.entitlementId && product.kind !== 'topup') throw new BillingError('The product capability is not configured.');
  const pending = (await store.orders()).find(order=>order.state.status==='pending' && (order.state.expiresAt>Date.now() || order.state.checkoutStarted || order.state.settling));
  if (pending) {
    if (pending.rail===body.rail && pending.product===body.product && pending.state.resourceId===body.resourceId) return publicOrder(pending,config);
    throw new BillingError('Finish the existing checkout or let its quote expire before starting another.',409);
  }
  const order = await store.createOrder(body.requestId,body.rail,body.product,{product,policy:config.version,resourceId:body.resourceId,expiresAt:Date.now()+900000,status:'pending'});
  if (order.rail !== body.rail || order.product !== body.product || order.state.resourceId !== body.resourceId) throw new BillingError('Checkout request was already used.',409);
  if (['alby','blink'].includes(order.rail) && !order.state.lightning) {
    if (order.state.creatingInvoice) throw new BillingError('Invoice creation needs reconciliation. Do not pay another invoice.',409);
    order.state.creatingInvoice = true; await store.saveOrder(order);
    order.state.lightning = await createLightning(env,order);
  }
  if (order.rail === 'x402' && !order.state.requirements) {
    order.state.requirements = x402Requirements(env,order);
    order.state.resourceUrl = (env('BILLING_PUBLIC_URL') || 'https://natally-hosted-chat.netlify.app') + '/billing/orders/'+order.id+'/settle';
  }
  await store.saveOrder(order);
  return publicOrder(order,config);
}
export async function fulfill(rc, config, store, order, transaction, usd, reversed = false) {
  const product = order.state.product;
  const identity = identityFor(config.project,config.app,config.environment,order.rail,transaction);
  const micros = product.kind === 'topup' && order.rail === 'revenuecat' ? Number(BigInt(usd)*4000n/10000n) : product.inferenceMicros;
  const fulfilledAt=Date.now();
  const record = await store.receipt(identity,order,{micros,turns:product.turns,roche:product.roche,transaction,rail:order.rail,usd,fulfilledAt,expiresAt:fulfilledAt+366*86400000});
  const state = record.state;
  if(product.kind==='bundle'&&!reversed) state.archiveId=await grantArchive(store,{receiptId:identity,resourceId:order.state.resourceId||order.product,fulfilledAt:state.fulfilledAt||fulfilledAt});
  if (!state.fulfilled && !reversed) {
    // All external settlements enter RevenueCat first. API idempotency keeps a
    // crash between provider acknowledgement and database write from duplicating ROCHE.
    await rc.adjust(store.uid,state.roche,identity+':grant');
    for (const id of [product.entitlementId,product.downloadEntitlementId].filter(Boolean)) await rc.grant(store.uid,id,state.expiresAt);
    await store.allocate(identity+':grant',identity,state.micros,state.turns);
    state.fulfilled = true; await store.saveReceipt(identity,state);
  }
  if (reversed && state.fulfilled && !state.reversed) {
    await store.db.query('UPDATE session_archives SET expires_at=LEAST(expires_at,now()) WHERE receipt_id=$1 AND uid=$2',[identity,store.uid]);
    await store.allocate(identity+':refund',identity,-state.micros,-state.turns);
    order.state.status = 'refunded'; await store.saveOrder(order);
    // Provider access is suspended before any remote compensation can fail.
    await suspendManagedAccess(rc.env,store);
    for (const id of [product.entitlementId,product.downloadEntitlementId].filter(Boolean)) {
      await rc.revoke(store.uid,id);
      const otherOrders = (await store.orders()).filter(item=>item.id!==order.id && item.state.status==='paid' && [item.state.product.entitlementId,item.state.product.downloadEntitlementId].includes(id));
      const expiry = Math.max(0,...otherOrders.map(item=>new Date(item.created_at).getTime()+365*86400000));
      if (expiry>Date.now()) await rc.grant(store.uid,id,expiry);
    }
    await rc.adjust(store.uid,-state.roche,identity+':refund');
    state.reversed = true; await store.saveReceipt(identity,state);
  }
  order.state.status = reversed ? 'refunded' : 'paid';
  order.state.receipt = identity;
  await store.saveOrder(order);
}
export async function recordCardReceipt(store,id,transaction) {
  if (!validUuid(id) || typeof transaction!=='string' || transaction.length>255 || !transaction.length) throw new BillingError('Invalid payment reference.',400);
  const order=await store.order(id);
  if (!order || order.rail!=='revenuecat') throw new BillingError('Order unavailable.',404);
  if (order.state.transaction && order.state.transaction!==transaction) throw new BillingError('This order already has a payment reference.',409);
  // This is only a lookup hint. reconcilePayments still verifies the actual RC
  // customer, production environment, product, ownership and receipt uniqueness.
  order.state.transaction=transaction;await store.saveOrder(order);
}
export async function reconcilePayments(env, config, store, rc) {
  const orders = await store.orders();
  if (orders.some(order=>order.rail === 'revenuecat')) {
    const purchases = await rc.purchases(store.uid);
    for (const purchase of purchases) {
      if (purchase.customer_id !== store.uid || purchase.environment !== 'production' || purchase.store !== 'rc_billing' || purchase.ownership !== 'purchased' || purchase.quantity !== 1) continue;
      const candidates = orders.filter(order=>order.rail === 'revenuecat' && order.state.product.productId === purchase.product_id &&
        (order.state.transaction === purchase.store_purchase_identifier || (!order.state.transaction && ['pending','cancelled'].includes(order.state.status) && purchase.purchased_at >= new Date(order.created_at).getTime()-1000 && purchase.purchased_at <= order.state.expiresAt)));
      if (candidates.length !== 1) continue;
      const order = candidates[0];
      if (!['owned','refunded'].includes(purchase.status)) continue;
      const revenue = purchase.revenue_in_usd;
      if (revenue?.currency !== 'USD') continue;
      const eligible = usdMicros(revenue.gross) - usdMicros(revenue.tax || 0);
      if (eligible <= 0 && purchase.status !== 'refunded') throw new BillingError('Payment amount needs reconciliation.');
      order.state.transaction = purchase.store_purchase_identifier; await store.saveOrder(order);
      await fulfill(rc,config,store,order,purchase.store_purchase_identifier,eligible,purchase.status === 'refunded');
    }
  }
  for (const order of orders) {
    if (order.state.status !== 'pending') continue;
    if (['alby','blink'].includes(order.rail)) {
      const payment = await verifyLightning(env,order);
      if (payment) await fulfill(rc,config,store,order,payment.transaction,null);
    }
    if (order.rail === 'x402' && order.state.settlement) await fulfill(rc,config,store,order,order.state.settlement.network+':'+order.state.settlement.transaction,null);
  }
}
export async function settleOrder(env, config, store, rc, orderId, payload) {
  if (!validUuid(orderId)) throw new BillingError('Invalid order.',400);
  const order = await store.order(orderId);
  if (!order || order.rail !== 'x402') throw new BillingError('Order unavailable.',404);
  if (order.state.status === 'paid') return publicOrder(order,config);
  if (!order.state.settlement && order.state.expiresAt < Date.now()) throw new BillingError('Quote expired. Check existing payment before starting another.',409);
  const settlement = await settleX402(env,store,order,payload);
  await fulfill(rc,config,store,order,settlement.network+':'+settlement.transaction,null);
  return publicOrder(order,config);
}
