import test from 'node:test';
import assert from 'node:assert/strict';

test('invoice adapter exists and refuses unconfigured server authority', async () => {
  const module = await import('../billing/customer-invoices.mjs').catch(() => null);
  assert.ok(module, 'real invoice adapter must exist');
  assert.throws(() => module.invoiceConfiguration({}), /configured/);
});
test('invoice pagination is confined to the authenticated customer path', async () => {
  const module = await import('../billing/customer-invoices.mjs').catch(() => null);
  assert.ok(module, 'real invoice adapter must exist');
  const path = '/v2/projects/project/customers/owner/invoices';
  assert.equal(module.validateInvoicePage(path+'?starting_after=next',path).pathname,path);
  for (const url of ['https://evil.invalid'+path,'/v2/projects/project/customers/other/invoices',path+'/file','https://user:pass@api.revenuecat.com'+path]) {
    assert.throws(() => module.validateInvoicePage(url,path), /pagination/);
  }
});

test('missing bearer cannot trigger an identity or invoice request', async () => {
  const {authenticateInvoiceOwner}=await import('../billing/customer-invoices.mjs');
  assert.equal(await authenticateInvoiceOwner(undefined,()=>{throw new Error('Unexpected network request');}),null);
});

// Isolated protocol-boundary specimens only; no provider calls, payment creation,
// customer-facing fixtures or settlement evidence.
const firebase = (await import('../firebase-applet-config.json',{with:{type:'json'}})).default;
const uid='boundary-owner';
const claims={sub:uid,aud:firebase.projectId,iss:'https://securetoken.google.com/'+firebase.projectId,exp:Math.floor(Date.now()/1000)+300,auth_time:100};
const bearer='Bearer header.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.signature';
const json=value=>new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}});

test('owner requires successful Google verification and rejects revoked account session',async()=>{
  const {authenticateInvoiceOwner}=await import('../billing/customer-invoices.mjs');
  assert.equal(await authenticateInvoiceOwner(bearer,async()=>new Response('',{status:401})),null);
  assert.equal(await authenticateInvoiceOwner(bearer,async()=>json({users:[{localId:uid,validSince:'101'}]})),null);
  assert.equal(await authenticateInvoiceOwner(bearer,async()=>json({users:[{localId:uid,validSince:'99'}]})),uid);
});

test('handler ignores caller customer choice and uses only verified owner',async()=>{
  const {invoiceHandler}=await import('../billing/customer-invoices.mjs');
  const urls=[];
  const fetchImpl=async(url)=>{urls.push(String(url));return String(url).includes('accounts:lookup')?json({users:[{localId:uid,validSince:'99'}]}):json({object:'list',items:[],next_page:null});};
  let payload,status=200;
  const res={set(){return this;},status(value){status=value;return this;},json(value){payload=value;return this;}};
  const req={method:'GET',params:{},query:{customer_id:'other-owner'},body:{ownerUid:'other-owner'},get(name){return name==='authorization'?bearer:name==='origin'?'https://natally.robin.mba':undefined;}};
  await invoiceHandler({REVENUECAT_SECRET_API_KEY:'isolated-test-secret',REVENUECAT_PROJECT_ID:'project',BILLING_INVOICE_ALLOWED_ORIGINS:'https://natally.robin.mba'},{fetchImpl})(req,res);
  assert.equal(status,200);assert.equal(payload.ownerUid,uid);assert.deepEqual(payload.invoices,[]);
  assert.ok(urls[1].includes('/customers/'+uid+'/invoices'));assert.ok(!urls.join(' ').includes('other-owner'));
});

test('PDF redirects are returned without fetching file host or forwarding server secret',async()=>{
  const {customerInvoiceFile}=await import('../billing/customer-invoices.mjs');
  const calls=[];
  const url=await customerInvoiceFile({projectId:'project',apiKey:'isolated-test-secret'},uid,'invoice-id',async(url,options)=>{
    calls.push({url,options});return new Response(null,{status:302,headers:{Location:'https://files.example.invalid/invoice.pdf?signature=opaque'}});
  });
  assert.equal(calls.length,1);assert.equal(calls[0].options.redirect,'manual');
  assert.equal(calls[0].options.headers.Authorization,'Bearer isolated-test-secret');
  assert.ok(calls[0].url.startsWith('https://api.revenuecat.com/'));assert.ok(url.startsWith('https://files.example.invalid/'));
});

test('invoice null payment and file fields remain unknown, never paid or fabricated',async()=>{
  const {listCustomerInvoices}=await import('../billing/customer-invoices.mjs');
  const invoices=await listCustomerInvoices({projectId:'project',apiKey:'isolated-test-secret'},uid,async()=>json({object:'list',next_page:null,items:[{
    object:'invoice',id:'protocol-record',issued_at:0,paid_at:null,invoice_url:null,line_items:[],total_amount:{currency:'CAD',gross:0,tax:0},
  }]}));
  assert.equal(invoices[0].paidAt,null);assert.equal(invoices[0].hasFile,false);assert.equal(invoices[0].currency,'CAD');
  assert.equal('receiptUrl' in invoices[0],false);
});

test('only explicitly configured standard native origins are admitted alongside HTTPS',async()=>{
  const {invoiceConfiguration}=await import('../billing/customer-invoices.mjs');
  const base={REVENUECAT_SECRET_API_KEY:'isolated-test-secret',REVENUECAT_PROJECT_ID:'project'};
  assert.deepEqual(invoiceConfiguration({...base,BILLING_INVOICE_ALLOWED_ORIGINS:'http://tauri.localhost,tauri://localhost'}).origins,['http://tauri.localhost','tauri://localhost']);
  for(const origin of ['http://other.invalid','*','null','tauri://other','http://tauri.localhost.evil.invalid']) assert.throws(()=>invoiceConfiguration({...base,BILLING_INVOICE_ALLOWED_ORIGINS:origin}));
});
