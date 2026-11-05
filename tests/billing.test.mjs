import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {AccountStore} from '../netlify/lib/billing-store.mjs';
import {RevenueCat} from '../netlify/lib/billing-identity.mjs';
import {fulfill,createOrder,reconcilePayments,recordCardReceipt} from '../netlify/lib/billing-commerce.mjs';
import {usdMicros,configuration} from '../netlify/lib/billing-config.mjs';
import {managedAccess} from '../netlify/lib/billing-access.mjs';
import {settleX402} from '../netlify/lib/billing-rails.mjs';

const cfg={project:'projNatally',app:'appNatally',environment:'production',version:'v3',publicKey:'rcb_live',capabilities:{reading:'entReading'}};
const product={title:'Reading',kind:'bundle',productId:'prodReading',packageId:'reading',usdMicros:500000,sats:1,roche:1,turns:10,inferenceMicros:20000,entitlementId:'entReading'};
async function fixture() {
  const db=new PGlite();
  await db.exec(await readFile(new URL('../netlify/database/migrations/202610250001_billing.sql',import.meta.url),'utf8'));
  await db.query('INSERT INTO billing_accounts(uid) VALUES($1),($2)',['alice','bob']);
  const store=new AccountStore(db,'alice');
  const order=await store.createOrder(randomUUID(),'alby','reading',{product,policy:'v3',status:'pending',resourceId:'chart:123',expiresAt:Date.now()+900000});
  const granted=new Set(),revoked=[];
  const rc={env:()=>'',adjust:async(uid,amount,key)=>{granted.add(key);},grant:async()=>{},revoke:async(uid,id)=>{revoked.push(id);}};
  return {db,store,order,rc,granted,revoked};
}
test('verified retry and refund produce one grant and one immutable compensation',async()=>{
  const {db,store,order,rc,granted}=await fixture();
  try {
    await fulfill(rc,cfg,store,order,'hash-1',null);
    await fulfill(rc,cfg,store,order,'hash-1',null);
    assert.equal(granted.size,1);assert.equal((await store.totals()).micros,20000);
    await fulfill(rc,cfg,store,order,'hash-1',null,true);
    await fulfill(rc,cfg,store,order,'hash-1',null,true);
    assert.equal(granted.size,2);assert.deepEqual(await store.totals(),{micros:0,turns:0,completed:0,reserved:0});
    assert.equal((await db.query('SELECT * FROM billing_allocations')).rows.length,2);
  } finally {await db.close();}
});
test('lost RevenueCat acknowledgement retries the same idempotency key without premature local credit',async()=>{
  const {db,store,order,rc,granted}=await fixture();let once=true;
  rc.adjust=async(uid,amount,key)=>{granted.add(key);if(once){once=false;throw new Error('lost acknowledgement');}};
  try {
    await assert.rejects(fulfill(rc,cfg,store,order,'hash-2',null));assert.equal((await store.totals()).micros,0);
    await fulfill(rc,cfg,store,order,'hash-2',null);assert.equal(granted.size,1);assert.equal((await store.totals()).micros,20000);
  } finally {await db.close();}
});
test('a receipt cannot be reassigned to another Firebase UID',async()=>{
  const {db,store,order,rc}=await fixture();
  try {
    await fulfill(rc,cfg,store,order,'hash-3',null);
    const bob=new AccountStore(db,'bob');const second=await bob.createOrder(randomUUID(),'alby','reading',order.state);
    await assert.rejects(fulfill(rc,cfg,bob,second,'hash-3',null),/Receipt already bound/);
    assert.equal((await bob.totals()).micros,0);
  } finally {await db.close();}
});
test('turn reservation, completion and retry count ten completed turns exactly once',async()=>{
  const {db,store,order,rc}=await fixture();
  try {
    await fulfill(rc,cfg,store,order,'turn-payment',null);
    const released=randomUUID();assert.equal(await store.turn(released,'reserve'),'reserved');await store.turn(released,'release');
    for(let i=0;i<10;i++){const id=randomUUID();assert.equal(await store.turn(id,'reserve'),'reserved');await store.turn(id,'complete');await store.turn(id,'complete');}
    assert.equal(await store.turn(randomUUID(),'reserve'),'exhausted');assert.equal((await store.totals()).completed,10);
  } finally {await db.close();}
});
test('RevenueCat customer creation binds UID and ignores AICREDIT balance',async()=>{
  const requests=[];let missing=true;
  const rc=new RevenueCat(name=>name==='REVENUECAT_SECRET_API_KEY'?'server-secret':'',cfg,async(url,options)=>{
    requests.push({url,options});
    if(url.endsWith('/customers/alice')&&missing){missing=false;return new Response('{}',{status:404});}
    if(url.includes('active_entitlements'))return Response.json({items:[{entitlement_id:'entReading',expires_at:Date.now()+60000}],next_page:null});
    if(url.includes('virtual_currencies?'))return Response.json({items:[{currency_code:'AICREDIT',balance:99999},{currency_code:'ROCHE',balance:7}],next_page:null});
    return Response.json({id:'alice'});
  });
  await rc.ensure({uid:'alice',email:'alice@example.test',email_verified:true});
  const create=requests.find(item=>item.url.endsWith('/customers')&&item.options.method==='POST');
  assert.equal(JSON.parse(create.options.body).id,'alice');
  assert.equal((await rc.snapshot('alice')).roche,7);
  await rc.adjust('alice',3,'receipt-key');
  assert.deepEqual(JSON.parse(requests.at(-1).options.body).adjustments,{ROCHE:3});
  assert.equal(requests.at(-1).options.headers['Idempotency-Key'],'receipt-key');
  await assert.rejects(rc.list('https://attacker.example/'),/Invalid RevenueCat resource/);
});
test('sandbox, wrong owner and wrong product receipts never grant access',async()=>{
  const {db,store,rc}=await fixture();
  const order=await store.createOrder(randomUUID(),'revenuecat','reading',{product,policy:'v3',status:'pending',expiresAt:Date.now()+900000});
  const purchase={customer_id:'alice',environment:'production',store:'rc_billing',ownership:'purchased',quantity:1,product_id:'prodReading',purchased_at:Date.now(),store_purchase_identifier:'transaction',status:'owned',revenue_in_usd:{currency:'USD',gross:0.5,tax:0}};
  rc.purchases=async()=>[{...purchase,environment:'sandbox'},{...purchase,customer_id:'bob'},{...purchase,product_id:'unrelated'}];
  try {await reconcilePayments(()=>'',cfg,store,rc);assert.equal((await store.totals()).micros,0);
    rc.purchases=async()=>[purchase];await reconcilePayments(()=>'',cfg,store,rc);assert.equal((await store.order(order.id)).state.status,'paid');
  }finally{await db.close();}
});
test('ambiguous x402 settlement cannot send another settlement',async()=>{
  await assert.rejects(settleX402(()=>'',{}, {state:{settling:{identity:'proof'}}},{}),/Do not pay again/);
});
test('managed key is encrypted and cumulative provider limit does not reset usage',async()=>{
  const {db,store,order,rc}=await fixture();const original=globalThis.fetch;let limit,usage=0,created=0;const mutations=[];
  const env=name=>({OPENROUTER_ADMIN_KEY:'admin-secret',BILLING_KEY_ENCRYPTION_KEY:Buffer.alloc(32,1).toString('base64')})[name] || '';
  globalThis.fetch=async(url,options)=>{const body=options.body?JSON.parse(options.body):{};
    if(options.method==='POST'){created++;limit=body.limit;return Response.json({key:'sk-user-only',data:{hash:'keyhash'}});}
    if(options.method==='PATCH'){mutations.push(body);limit=body.limit;return Response.json({data:{hash:'keyhash',usage,limit}});}
    return Response.json({data:{hash:'keyhash',usage,limit}});
  };
  try {
    await fulfill(rc,cfg,store,order,'key-payment',null);
    const access=await managedAccess(env,store,{capabilities:{reading:0}});assert.equal(access.apiKey,undefined);assert.equal(access.transport,'relay');
    assert.ok(!(JSON.stringify(await store.account()).includes('sk-user-only')));
    usage=0.01;await managedAccess(env,store,{capabilities:{reading:0}});assert.equal(created,1);assert.equal(limit,0.02);
    await store.allocate('refund-test',(await store.receipts())[0].identity,-20000,-10);
    const revoked=await managedAccess(env,store,{capabilities:{}});assert.equal(revoked.state,'unavailable');assert.equal(mutations.at(-1).disabled,true);
    assert.ok(mutations.every(item=>item.limit_reset===null));
  }finally{globalThis.fetch=original;await db.close();}
});
test('currency and integer-micro policy reject test keys and invalid amounts',()=>{
  assert.equal(usdMicros('0.50'),500000);assert.throws(()=>usdMicros('1e3'));assert.throws(()=>usdMicros(-1));
  assert.throws(()=>configuration(name=>({BILLING_POLICY_VERSION:'v3',REVENUECAT_PROJECT_ID:'p',REVENUECAT_PUBLIC_API_KEY:'rcb_sb_test'})[name]||''),/production Web Billing key/);
});
test('card callback is only a lookup hint and cannot grant money or change owner',async()=>{
  const {db,store,rc}=await fixture();
  try {
    const order=await store.createOrder(randomUUID(),'revenuecat','reading',{product,status:'pending'});
    await recordCardReceipt(store,order.id,'unverified-reference');assert.equal((await store.totals()).micros,0);
    await assert.rejects(recordCardReceipt(new AccountStore(db,'bob'),order.id,'unverified-reference'),/unavailable/);
    await assert.rejects(recordCardReceipt(store,order.id,'different-reference'),/already has/);
  } finally {await db.close();}
});
test('failed refund compensation still removes the spend grant and is retriable',async()=>{
  const {db,store,order,rc}=await fixture();
  try {
    await fulfill(rc,cfg,store,order,'refund-failure',null);
    const adjust=rc.adjust;rc.adjust=async()=>{throw new Error('currency service unavailable');};
    await assert.rejects(fulfill(rc,cfg,store,order,'refund-failure',null,true));
    assert.equal((await store.totals()).micros,0);assert.equal((await store.order(order.id)).state.status,'refunded');
    rc.adjust=adjust;await fulfill(rc,cfg,store,order,'refund-failure',null,true);
    assert.equal((await store.totals()).micros,0);
  }finally{await db.close();}
});
test('repeated checkout request returns its original pending order',async()=>{
  const {db,store}=await fixture();
  try {
    const pending=(await store.orders())[0];pending.state.expiresAt=Date.now()-1000;await store.saveOrder(pending);
    const env=name=>name==='REVENUECAT_SECRET_API_KEY'?'configured':'';
    const request={requestId:randomUUID(),rail:'revenuecat',product:'reading',resourceId:'reading:1'};
    const config={...cfg,products:{reading:product}};
    const first=await createOrder(env,config,store,request),again=await createOrder(env,config,store,{...request,requestId:randomUUID()});
    assert.equal(first.id,again.id);
    await assert.rejects(createOrder(env,config,store,{...request,resourceId:'reading:2'}),/existing checkout/);
  }finally{await db.close();}
});
