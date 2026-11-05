import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('download staging refuses to create a page without a verified real inventory', async () => {
  const module=await import('../scripts/stage-native-downloads.mjs').catch(()=>null);
  assert.ok(module,'download staging gate must exist');
  const siteDir=path.join(tmpdir(),'natally-no-inventory-'+process.pid);
  assert.throws(()=>module.stageNativeDownloads({inventoryPath:'missing-inventory.json',directory:siteDir,siteDir}));
  assert.equal(existsSync(siteDir),false);
});
