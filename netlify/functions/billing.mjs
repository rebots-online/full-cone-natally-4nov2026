import { timingSafeEqual } from 'node:crypto';
import { billingOriginAllowed } from '../lib/billing-cors.mjs';
import { configuration, BillingError, rails } from '../lib/billing-config.mjs';
import { withAccount } from '../lib/billing-store.mjs';
import { authenticate, firebase, RevenueCat, projectCapabilities } from '../lib/billing-identity.mjs';
import { createOrder, reconcilePayments, settleOrder, publicOrder, validUuid, recordCardReceipt } from '../lib/billing-commerce.mjs';
import { relayTurn } from '../lib/inference-relay.mjs';
import { managedAccess } from '../lib/billing-access.mjs';

async function bodyOf(request,limit=65536) {
  if (!request.body) return {};
  const reader = request.body.getReader(); let size = 0; const chunks = [];
  try {
    for (;;) { const {value,done} = await reader.read(); if (done) break;
      size += value.length; if (size > limit) throw new BillingError('Request too large.',413); chunks.push(value); }
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch (error) { if (error instanceof SyntaxError) throw new BillingError('Invalid JSON.',400); throw error; }
  finally { await reader.cancel().catch(()=>{}); }
}
function webhookAuthorized(request, env) {
  const expected = env('REVENUECAT_WEBHOOK_AUTH'), actual = request.headers.get('authorization') || '';
  return !!expected && Buffer.byteLength(actual) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(actual),Buffer.from(expected));
}
export default async function billing(request) {
  const runtimeDeadline=AbortSignal.timeout(52000);
  const env = name => globalThis.Netlify?.env.get(name) || process.env[name] || '';
  const path = new URL(request.url).pathname.replace(/\/$/,'');
  const origin = request.headers.get('origin');
  const originAllowed = billingOriginAllowed(env,origin);
  const webhook = path === '/billing/revenuecat/webhook';
  const headers = {'Content-Type':'application/json','Cache-Control':'private, no-store, max-age=0',Pragma:'no-cache',Vary:'Origin',
    ...(originAllowed ? {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Authorization, Content-Type, Payment-Signature','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Expose-Headers':'Payment-Required, Payment-Response'} : {})};
  const reply = (body,status=200,extra={}) => new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
  if (!webhook && !originAllowed) return reply({error:'Origin unavailable.'},403);
  if (!webhook && request.method === 'OPTIONS') return new Response(null,{status:204,headers});
  try {
    let user, body = {};
    if (webhook) {
      if (request.method !== 'POST' || !webhookAuthorized(request,env)) return reply({error:'Unauthorized webhook.'},401);
      body = await bodyOf(request);
      const event = body?.event;
      if (!event?.id || event.environment !== 'PRODUCTION') return reply({received:true,ignored:true});
      // Transfers can affect both accounts. No alias or email is accepted as identity.
      const ids = event.type === 'TRANSFER' ? [...new Set([...(event.transferred_from || []),...(event.transferred_to || [])])] : [event.app_user_id];
      const cfg = configuration(env);
      if (event.app_id && event.app_id !== cfg.app) return reply({received:true,ignored:true});
      for (const uid of ids) {
        if (typeof uid !== 'string' || uid.startsWith('$RCAnonymousID:') || uid.includes('/')) continue;
        let record; try { record = await firebase(env).auth.getUser(uid); } catch(error) { if(error.code === 'auth/user-not-found') continue; throw error; }
        await withAccount(env,uid,async store => {
          const rc = new RevenueCat(env,cfg);
          await rc.ensure({uid,email:record.email,email_verified:record.emailVerified});
          await reconcilePayments(env,cfg,store,rc);
          const snapshot = await rc.snapshot(uid);
          await projectCapabilities(env,uid,snapshot);
          await managedAccess(env,store,snapshot);
        });
      }
      return reply({received:true});
    }
    if (!['GET','POST'].includes(request.method)) return reply({error:'Method unavailable.'},405);
    user = await authenticate(request,env);
    if (request.method === 'POST') body = await bodyOf(request,path==='/billing/inference'?1048576:65536);
    const cfg = configuration(env), rc = new RevenueCat(env,cfg);
    if (path === '/billing/inference' && request.method === 'POST') {
      const encoder=new TextEncoder(), cancel=new AbortController();
      const stream=new ReadableStream({
        start(controller) {
          const emit=value=>controller.enqueue(encoder.encode('data: '+JSON.stringify(value)+'\n\n'));
          void withAccount(env,user.uid,async store=>{
            await rc.ensure(user);
            const snapshot=await rc.snapshot(user.uid);
            await relayTurn(env,store,snapshot,body,AbortSignal.any([request.signal,cancel.signal,runtimeDeadline]),emit);
          }).catch(error=>{try {emit({error:error instanceof BillingError?error.message:'Reading interrupted. Retry the same request; do not pay again.',retryNewRequest:error instanceof BillingError && error.status!==409});}catch{}}).finally(()=>{try{controller.close();}catch{}});
        }, cancel(){cancel.abort();}
      });
      return new Response(stream,{headers:{...headers,'Content-Type':'text/event-stream','X-Accel-Buffering':'no'}});
    }
    return await withAccount(env,user.uid,async store => {
      await rc.ensure(user); // Every rail and new account enters the authoritative user list.
      const base = {accountUid:user.uid,expiresAt:new Date(Date.now()+60000).toISOString()};
      if (path === '/billing/offer' && request.method === 'GET') {
        return reply({...base,products:Object.entries(cfg.products).map(([id,product])=>({id,title:product.title,kind:product.kind,usd:product.usdMicros/1000000,sats:product.sats,x402Label:product.x402Label,roche:product.roche,turns:product.turns,rails:rails(env,product)}))});
      }
      if (path === '/billing/orders' && request.method === 'POST') return reply({...base,order:await createOrder(env,cfg,store,body)});
      if (path === '/billing/orders' && request.method === 'GET') return reply({...base,orders:(await store.orders()).filter(order=>order.state.status === 'pending' && (order.state.expiresAt>Date.now() || order.state.settling || order.state.checkoutStarted)).map(order=>publicOrder(order,cfg))});
      const start=/^\/billing\/orders\/([^/]+)\/start$/.exec(path);
      if (start && request.method==='POST') {
        if(!validUuid(start[1])) throw new BillingError('Invalid order.',400);
        const order=await store.order(start[1]);
        if(!order || order.rail!=='revenuecat' || !publicOrder(order,cfg).canPay) throw new BillingError('This checkout was already started. Check access; do not pay again.',409);
        order.state.checkoutStarted=Date.now();await store.saveOrder(order);
        return reply({...base,started:true});
      }
      const receipt = /^\/billing\/orders\/([^/]+)\/receipt$/.exec(path);
      if (receipt && request.method === 'POST') {
        await recordCardReceipt(store,receipt[1],body.transaction);
        await reconcilePayments(env,cfg,store,rc);
        return reply({...base,recorded:true});
      }
      const cancel=/^\/billing\/orders\/([^/]+)\/cancel$/.exec(path);
      if(cancel && request.method==='POST') {
        if(!validUuid(cancel[1])) throw new BillingError('Invalid order.',400);
        await reconcilePayments(env,cfg,store,rc);
        const order=await store.order(cancel[1]);
        if(!order || order.rail!=='revenuecat' || order.state.status!=='pending' || order.state.transaction) throw new BillingError('Check payment status before closing this order.',409);
        order.state.status='cancelled';await store.saveOrder(order);
        return reply({...base,cancelled:true});
      }
      const settle = /^\/billing\/orders\/([^/]+)\/settle$/.exec(path);
      if (settle && request.method === 'POST') {
        let payload = body.payment;
        const signature = request.headers.get('payment-signature');
        if (signature) { try { payload = JSON.parse(Buffer.from(signature,'base64').toString('utf8')); } catch { throw new BillingError('Invalid payment authorization.',400); } }
        if (!payload) {
          if (!validUuid(settle[1])) throw new BillingError('Invalid order.',400);
          const order = await store.order(settle[1]);
          if (!order || order.rail !== 'x402') throw new BillingError('Order unavailable.',404);
          const challenge = publicOrder(order,cfg).paymentRequired;
          return reply(challenge,402,{'Payment-Required':Buffer.from(JSON.stringify(challenge)).toString('base64')});
        }
        const order = await settleOrder(env,cfg,store,rc,settle[1],payload);
        const snapshot = await rc.snapshot(user.uid); await projectCapabilities(env,user.uid,snapshot);
        return reply({...base,order});
      }
      if (path.startsWith('/billing/turns/')) throw new BillingError('Turns are managed by the inference service.',410);
      if (!['/billing/customer','/billing/access','/billing/reconcile','/billing/download-access'].includes(path)) throw new BillingError('Route unavailable.',404);
      if (path !== '/billing/access' && request.method !== 'POST') throw new BillingError('Method unavailable.',405);
      if (path !== '/billing/customer') await reconcilePayments(env,cfg,store,rc);
      const snapshot = await rc.snapshot(user.uid);
      const claims = await projectCapabilities(env,user.uid,snapshot);
      if (path === '/billing/customer') { await managedAccess(env,store,snapshot); return reply({...base,claims,roche:snapshot.roche}); }
      if (path === '/billing/download-access') {
        const owned = (await store.orders()).some(order=>order.state.status === 'paid' && order.state.resourceId === body.resourceId &&
          order.state.product.formats?.includes(body.format) && Object.values(cfg.capabilities).includes(order.state.product.entitlementId) &&
          Object.keys(snapshot.capabilities).some(key=>cfg.capabilities[key] === order.state.product.entitlementId));
        return reply({...base,resourceId:body.resourceId,format:body.format,state:owned ? 'owned' : 'unavailable',message:owned ? undefined : 'Open payment methods in Account settings to purchase access for this reading.'});
      }
      return reply({...await managedAccess(env,store,snapshot),claims,roche:snapshot.roche});
    });
  } catch(error) {
    return reply({error:error instanceof BillingError ? error.message : 'Payment reconciliation is pending. Keep your receipt; do not purchase again.'},error instanceof BillingError ? error.status : 503);
  }
}
export const config = {path:'/billing/*'};
