import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const source=await readFile(new URL('../src/services/purchaseGate.ts',import.meta.url),'utf8');
const {code}=await transform(source,{loader:'ts',format:'esm'});
const {waitForPurchase}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('purchase gate awaits explicit completion, preserves owner, and settles once',async()=>{
  globalThis.window=new EventTarget();const owner={uid:'alice'};let detail;
  window.addEventListener('natally:purchase-required',event=>{detail=event.detail;});
  let resumed=0;const pending=waitForPurchase(owner,()=>true).then(()=>resumed++);
  assert.equal(detail.owner,owner);await Promise.resolve();assert.equal(resumed,0);
  detail.resolve();detail.resolve();detail.reject();await pending;assert.equal(resumed,1);
});
test('dismissal rejects without automatically resuming a reading',async()=>{
  globalThis.window=new EventTarget();window.addEventListener('natally:purchase-required',event=>event.detail.reject());
  await assert.rejects(waitForPurchase({uid:'alice'},()=>true),error=>error.code==='purchase_dismissed');
});
test('account change cancels pending checkout wait',async()=>{
  globalThis.window=new EventTarget();let current=true;
  const pending=waitForPurchase({uid:'alice'},()=>current);current=false;
  await assert.rejects(pending,error=>error.code==='auth_required');
});
