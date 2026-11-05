import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Controlled transport/auth seams exercise the real client. No provider writes,
// payment simulation, deployed fixture, or successful live-receipt claim.
const auth={currentUser:null};
globalThis.__invoiceBoundaryAuth=auth;
const bundled=await build({entryPoints:['src/services/customerInvoices.ts'],bundle:true,write:false,format:'esm',
  define:{'import.meta.env':JSON.stringify({VITE_BILLING_INVOICES_ENDPOINT:'https://invoice-protocol.invalid/invoices'})},
  plugins:[{name:'invoice-auth-boundary',setup(builder){builder.onResolve({filter:/^\.\/firebase$/},()=>({path:'auth',namespace:'boundary'}));builder.onLoad({filter:/.*/,namespace:'boundary'},()=>({contents:'export const auth=globalThis.__invoiceBoundaryAuth;'}));}}]});
const client=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const originalFetch=globalThis.fetch;
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const owner={uid:'boundary-owner',getIdToken:async()=> 'isolated-test-bearer'};

test('account switch discards an already requested invoice response',async()=>{
  auth.currentUser=owner;
  let release;
  globalThis.fetch=()=>new Promise(resolve=>{release=resolve;});
  try {
    const result=client.getCustomerInvoices(owner.uid,()=>true);
    await tick();auth.currentUser={uid:'other-owner'};
    release(new Response(JSON.stringify({ownerUid:owner.uid,invoices:[]})));
    await assert.rejects(result,/account changed/);
  } finally {globalThis.fetch=originalFetch;auth.currentUser=null;}
});

test('caller cancellation aborts the actual invoice network request',async()=>{
  auth.currentUser=owner;
  let signal,reject;
  globalThis.fetch=(_url,options)=>{signal=options.signal;return new Promise((_resolve,fail)=>{reject=fail;});};
  const controller=new AbortController();
  let pending;
  try {
    pending=client.getCustomerInvoices(owner.uid,()=>true,controller.signal).catch(()=>undefined);
    await tick();controller.abort();
    assert.equal(signal.aborted,true);
  } finally {reject?.(new DOMException('Aborted','AbortError'));await pending;globalThis.fetch=originalFetch;auth.currentUser=null;}
});
