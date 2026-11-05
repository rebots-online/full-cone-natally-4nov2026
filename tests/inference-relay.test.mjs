import test from 'node:test';
import assert from 'node:assert/strict';
import { relayTurn } from '../netlify/lib/inference-relay.mjs';
import { managedAccess } from '../netlify/lib/billing-access.mjs';
import {AccountStore} from '../netlify/lib/billing-store.mjs';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
const id='8b729878-79aa-4b35-b0cc-d04b0699b822';
const env=n=>({OPENROUTER_ADMIN_KEY:'admin-secret',BILLING_KEY_ENCRYPTION_KEY:Buffer.alloc(32,7).toString('base64')})[n]||'';
const snapshot={capabilities:{reading:true}};
function store(uid='alice') {
  let account={},states=new Map(),turns=new Map();
  return {uid,account:async()=>structuredClone(account),saveAccount:async a=>{account=structuredClone(a);},
    totals:async()=>({micros:1000000,turns:1,completed:[...turns.values()].filter(v=>v==='completed').length,reserved:[...turns.values()].filter(v=>v==='reserved').length}),
    inference:async id=>structuredClone(states.get(id)),saveInference:async(id,s)=>{states.set(id,structuredClone(s));},
    turn:async(id,action)=>{if(action==='reserve'){if(turns.has(id))return turns.get(id);if(turns.size)return 'exhausted';turns.set(id,'reserved');return 'reserved';}if(turns.get(id)==='reserved')turns.set(id,action==='complete'?'completed':'released');return turns.get(id);},turns};
}
function providerFrames(frames) {return new Response(new ReadableStream({start(c){for(const frame of frames)c.enqueue(new TextEncoder().encode('data: '+JSON.stringify(frame)+'\n\n'));c.close();}}),{headers:{'Content-Type':'text/event-stream'}});}
const frame=(delta,finish=null)=>({model:'provider/free',choices:[{delta,finish_reason:finish}]});
const body={requestId:id,payload:{prompt:'Explore my chart',systemInstruction:'Natally'}};
async function keys(run){const original=globalThis.fetch;globalThis.fetch=async(url,options)=>{
  assert.match(String(url),/^https:\/\/openrouter.ai\/api\/v1\/keys/);
  return Response.json(options?.method==='POST'?{key:'managed-secret',data:{hash:'managed-hash'}}:{data:{usage:0}});
};try{await run();}finally{globalThis.fetch=original;}}
test('managed access returns metadata only, relay streams and completes once; duplicate replays',()=>keys(async()=>{
  const s=store();const access=await managedAccess(env,s,snapshot);assert.equal(access.transport,'relay');assert.equal(access.apiKey,undefined);assert.ok(!JSON.stringify(access).includes('managed-secret'));
  let calls=0;const events=[];const provider=async(url,options)=>{calls++;assert.equal(options.headers.Authorization,'Bearer managed-secret');assert.equal(JSON.parse(options.body).model,'openrouter/free');return providerFrames([frame({content:'Hello '}),frame({content:'Robin'},'stop')]);};
  await relayTurn(env,s,snapshot,body,new AbortController().signal,e=>events.push(e),provider);
  assert.equal(events[0].progress,'Hello ');assert.equal(events.at(-1).result.text,'Hello Robin');assert.equal(s.turns.get(id),'completed');
  await relayTurn(env,s,snapshot,body,new AbortController().signal,e=>events.push(e),provider);assert.equal(calls,1);
}));
test('no capability causes no provider request or reservation',()=>keys(async()=>{
  const s=store();await assert.rejects(relayTurn(env,s,{capabilities:{}},body,new AbortController().signal,()=>{},()=>assert.fail()),/Reading access required/);assert.equal(s.turns.size,0);
}));
test('tool continuation only accepts server issued IDs and completes same reservation',()=>keys(async()=>{
  const s=store();let calls=0;const provider=async()=>++calls===1?providerFrames([frame({tool_calls:[{index:0,id:'chart',function:{name:'calculate_astrology',arguments:'{"operation":"natal"}'}}]},'tool_calls')]):providerFrames([frame({content:'Reading'},'stop')]);
  await relayTurn(env,s,snapshot,{...body,enableTools:true},new AbortController().signal,()=>{},provider);
  await assert.rejects(relayTurn(env,s,snapshot,{requestId:id,results:[{id:'forged',content:'x'}]},new AbortController().signal,()=>{},provider),/Invalid calculation/);assert.equal(calls,1);
  await relayTurn(env,s,snapshot,{requestId:id,results:[{id:'chart',content:'{}'}]},new AbortController().signal,()=>{},provider);assert.equal(s.turns.get(id),'completed');assert.equal(calls,2);
}));
test('failed and cancelled providers release turn; incomplete stream cannot complete',()=>keys(async()=>{
  for(const provider of [async()=>providerFrames([frame({content:'partial'})]),async()=>{throw new DOMException('cancelled','AbortError');}]){
    const s=store();await assert.rejects(relayTurn(env,s,snapshot,body,new AbortController().signal,()=>{},provider));assert.equal(s.turns.get(id),'released');assert.equal((await s.inference(id)).status,'failed');
  }
}));
test('account isolation and finite allowance prevent a second reserved request',()=>keys(async()=>{
  const a=store(),b=store('bob');await relayTurn(env,a,snapshot,{...body,enableTools:true},new AbortController().signal,()=>{},async()=>providerFrames([frame({tool_calls:[{index:0,id:'chart',function:{name:'calculate_astrology',arguments:'{}'}}]},'tool_calls')]));
  assert.equal(await b.inference(id),undefined);
  await assert.rejects(relayTurn(env,a,snapshot,{...body,requestId:'33ecac50-abed-41c7-8592-7462f80290f4'},new AbortController().signal,()=>{},()=>assert.fail()),/allowance exhausted/);
}));
test('durable database scopes replay by UID and expires abandoned reservations and payloads',async()=>{
  const db=new PGlite();
  try {
    for(const file of ['202610250001_billing.sql','202610260001_inference.sql','202610260002_openings.sql'])await db.exec(await readFile(new URL('../netlify/database/migrations/'+file,import.meta.url),'utf8'));
    await db.query("INSERT INTO billing_accounts(uid) VALUES('alice'),('bob')");
    const a=new AccountStore(db,'alice'),b=new AccountStore(db,'bob');
    await db.query("INSERT INTO billing_turns(uid,id,status) VALUES('alice',$1,'reserved')",[id]);
    await a.saveInference(id,{status:'tools',expiresAt:Date.now()-1,payloadExpiresAt:Date.now()-1,messages:[{content:'private'}]});
    assert.equal(await b.inference(id),undefined);await a.expireInference();
    assert.deepEqual(await a.inference(id),{status:'expired'});assert.equal((await a.totals()).reserved,0);
    const order=await a.createOrder('14d48a59-808a-40ad-904d-92d5be02cad5','revenuecat','reading',{status:'paid',product:{kind:'bundle'}});
    const opening='93393de8-42ef-42c4-a861-28cd7aee71a5';
    assert.equal(await a.openingAvailable(),true);
    assert.equal(await a.opening(opening,'reserve','natal'),'reserved');assert.equal(await a.opening(opening,'complete'),'completed');
    assert.equal((await a.totals()).completed,0,'opening does not consume any of ten followups');
    assert.equal(await a.opening('cb7b56e5-5d5c-4bc5-89aa-7b065d519c14','reserve','natal'),'exhausted');
    assert.equal(await a.opening('cb7b56e5-5d5c-4bc5-89aa-7b065d519c14','reserve','now'),'reserved');
    assert.equal(await b.opening('e2b534d0-a230-4cb5-9fb5-ad65f42e6ce3','reserve','natal'),'exhausted');
  }finally{await db.close();}
});
test('runtime deadline continues partial prose without marking a completed turn',()=>keys(async()=>{
  const s=store(),events=[],signal=AbortSignal.abort(new DOMException('time budget','TimeoutError'));
  const provider=async()=>new Response(new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('data: '+JSON.stringify(frame({content:'Partial reading'}))+'\n\n'));setTimeout(()=>c.error(signal.reason),1);}}));
  await relayTurn(env,s,snapshot,body,signal,e=>events.push(e),provider);
  assert.equal(events.at(-1).continue,true);assert.equal(s.turns.get(id),'reserved');
  await relayTurn(env,s,snapshot,{requestId:id},new AbortController().signal,e=>events.push(e),async()=>providerFrames([frame({content:' finished'},'stop')]));
  assert.equal(events.at(-1).result.text,'Partial reading finished');assert.equal(s.turns.get(id),'completed');
}));
