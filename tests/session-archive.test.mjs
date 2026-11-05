import test from 'node:test';
import assert from 'node:assert/strict';
import {grantArchive,archiveFor,recordExchange,saveAudioChunk,deleteArchive} from '../netlify/lib/session-archive.mjs';
test('grant identity is stable and duration starts from fulfillment',async()=>{
 const calls=[];const store={uid:'owner',db:{query:async(...args)=>{calls.push(args);return {rows:[]};}}};
 const now=Date.now();const first=await grantArchive(store,{receiptId:'receipt',resourceId:'chart',fulfilledAt:now});
 assert.equal(first,await grantArchive(store,{receiptId:'receipt',resourceId:'chart',fulfilledAt:now+1000}));
 assert.equal(calls[0][1][5].getTime()-now,366*86400000);assert.match(calls[0][0],/ON CONFLICT/);
});
test('reads isolate owners and reject deleted or expired content',async()=>{
 const store={uid:'other',db:{query:async(sql,args)=>{assert.equal(args[1],'other');return {rows:[]};}}};
 await assert.rejects(archiveFor(store,'id'),e=>e.status===404);
 for(const row of [{deleted_at:new Date(),expires_at:new Date(Date.now()+10000)},{expires_at:new Date(0)}]){
 store.db.query=async()=>({rows:[row]});await assert.rejects(archiveFor(store,'id'),e=>e.status===410);
 }
});
test('authoritative exchanges require explicit consent',async()=>{
 let queries=0;const store={uid:'owner',db:{query:async()=>{queries++;return {rows:[{expires_at:new Date(Date.now()+10000),consent_at:null}]};}}};
 assert.equal(await recordExchange(store,{sessionId:'id',requestId:'turn',question:'q',answer:'a'}),false);assert.equal(queries,1);
});
test('identical audio retry is idempotent and conflicting retry is rejected',async()=>{
 const data=Buffer.from('audio');let calls=0;
 const store={uid:'owner',db:{query:async()=>({rows:[++calls%2===1?{expires_at:new Date(Date.now()+10000),consent_at:new Date()}:{total:1,mime:'audio/wav',data}]})}};
 await saveAudioChunk(store,'id','turn',0,1,'audio/wav',data);
 await assert.rejects(saveAudioChunk(store,'id','turn',0,1,'audio/wav',Buffer.from('different')),e=>e.status===409);
});
test('owner deletion remains possible after expiry and clears content atomically',async()=>{
 const queries=[];const store={uid:'owner',db:{query:async(sql,args)=>{queries.push(sql);return {rows:sql.startsWith('SELECT')?[{id:'id'}]:[]};}}};
 await deleteArchive(store,'id');assert.equal(queries[1],'BEGIN');assert.match(queries[2],/DELETE FROM session_exchanges/);assert.match(queries[4],/snapshot=NULL/);assert.equal(queries[5],'COMMIT');
});
