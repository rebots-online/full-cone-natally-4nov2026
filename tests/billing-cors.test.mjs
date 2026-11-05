import test from 'node:test';
import assert from 'node:assert/strict';
import {billingOriginAllowed} from '../netlify/lib/billing-cors.mjs';
test('canonical desktop origins allowed, legacy origin explicit, no wildcard or suffix matching',()=>{
  for(const origin of ['https://natally.robin.mba','http://tauri.localhost','tauri://localhost'])assert.equal(billingOriginAllowed(()=>'',origin),true);
  for(const origin of [null,'null','https://natally.robin.mba.evil.test','https://evil.test','https://natally.surge.sh'])assert.equal(billingOriginAllowed(()=>'',origin),false);
  assert.equal(billingOriginAllowed(n=>n==='BILLING_ALLOWED_ORIGIN'?'https://natally.surge.sh':'','https://natally.surge.sh'),true);
  assert.equal(billingOriginAllowed(()=>'*','https://evil.test'),false);
});
