import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('web projection retains individual provider transactions, not just product set', () => {
  const source = readFileSync(new URL('../src/services/revenueCatCheckout.ts',import.meta.url),'utf8');
  assert.ok(source.includes('purchaseHistory: projectPurchaseHistory(info)'), 'real SDK history must be projected');
});
test('billing renders owner-bound records and explicitly discloses unavailable receipts', () => {
  const source = readFileSync(new URL('../src/components/AccountBillingDialog.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('purchaseHistory.map('), 'individual records must be rendered');
  assert.ok(!source.includes('distinct {productCount'), 'unique SKU count is not a transaction history');
  assert.ok(source.includes('does not establish a tax-inclusive charged total or supply tax details or receipt links'), 'missing financial data must not be invented');
});

test('native history rejects malformed records and distinguishes unavailable from empty', async () => {
  const { validatePurchaseHistory } = await import('../src/services/purchaseHistory');
  assert.equal(validatePurchaseHistory(undefined), undefined);
  assert.deepEqual(validatePurchaseHistory([]), []);
  for (const invalid of [null, {}, [null], [{kind:'transaction'}], [{kind:'latest_product',transactionId:null,productIdentifier:'invalid-date',store:null,purchaseDate:Number.MAX_VALUE}]]) {
    assert.throws(() => validatePurchaseHistory(invalid), /malformed/);
  }
});

test('historical native price is preserved verbatim, including unknown currency symbols', async () => {
  // Projection-unit specimen only, never a paid record or customer-facing fixture.
  const {validatePurchaseHistory}=await import('../src/services/purchaseHistory');
  const record={kind:'transaction',transactionId:'protocol-record',productIdentifier:'protocol-product',purchaseDate:0,store:'PLAY_STORE'};
  const price={amountMicros:990000,currency:'CAD',formatted:'CA$0.99'};
  assert.deepEqual(validatePurchaseHistory([{...record,price}])?.[0].price,price);
  assert.equal(validatePurchaseHistory([{...record,price:null}])?.[0].price,null);
  assert.equal(validatePurchaseHistory([{...record,price:{...price,currency:'$'}}])?.[0].price?.currency,'$');
  assert.throws(()=>validatePurchaseHistory([{...record,price:{...price,amountMicros:Number.MAX_SAFE_INTEGER+1}}]),/malformed/);
  const native=readFileSync(new URL('../src-tauri/gen/android/app/src/main/java/mba/robin/natally/NatallyBillingPlugin.kt',import.meta.url),'utf8');
  const projection=native.slice(native.indexOf('private fun projection'),native.indexOf('private fun quote'));
  assert.ok(projection.includes('transaction.price?.let'));
});
