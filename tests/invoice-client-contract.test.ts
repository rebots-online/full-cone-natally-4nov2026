import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('invoice client requires explicit endpoint and owner-bound authenticated reads', () => {
  const file = new URL('../src/services/customerInvoices.ts',import.meta.url);
  assert.ok(existsSync(file));
  const source = readFileSync(file,'utf8');
  assert.ok(source.includes('VITE_BILLING_INVOICES_ENDPOINT'));
  assert.ok(source.includes('getIdToken()'));
  assert.ok(source.includes('payload.ownerUid !== ownerUid'));
});
