import { copyFileSync, lstatSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { required, verifyCompletedInventory } from './release-state.mjs';

const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[character]);

/** Called only in the existing coordinator's full-site staging, after all builds.
 * No empty page, partial matrix, invented files, workspace export or deployment. */
export function stageNativeDownloads({inventoryPath,directory,siteDir}) {
  const {inventory} = verifyCompletedInventory(inventoryPath,directory);
  const dist = realpathSync(path.join(directory,'dist'));
  const names = new Set();
  const artifacts = required.filter(target => !['web','pwa'].includes(target)).map(target => {
    const artifact = inventory.artifacts[target];
    const source = path.resolve(directory,artifact.path);
    const relative = path.relative(dist,realpathSync(source));
    if (!relative || relative.startsWith('..'+path.sep) || path.isAbsolute(relative) || lstatSync(source).isSymbolicLink() || !lstatSync(source).isFile() || artifact.bytes <= 0) throw new Error('Download artifact is not a real retained build file.');
    const filename = path.basename(source);
    if (names.has(filename)) throw new Error('Download artifact names collide.');
    names.add(filename);
    return {target,source,filename,bytes:artifact.bytes,sha256:artifact.sha256};
  });
  const downloads = path.join(siteDir,'downloads');
  // All inventory and source validations precede creating any customer-visible file.
  rmSync(downloads,{recursive:true,force:true});
  mkdirSync(downloads,{recursive:true});
  for (const artifact of artifacts) {
    const target = path.join(downloads,artifact.filename);
    copyFileSync(artifact.source,target);
    if (lstatSync(target).size !== artifact.bytes || hash(target) !== artifact.sha256) throw new Error('Copied download failed integrity verification.');
  }
  const manifest={version:inventory.version,invocationId:inventory.invocationId,artifacts:artifacts.map(({source,...artifact})=>artifact)};
  writeFileSync(path.join(downloads,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  writeFileSync(path.join(downloads,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Natally downloads ${escape(inventory.version)}</title><style>body{font:16px/1.5 system-ui;max-width:64rem;margin:2rem auto;padding:0 1rem;background:#171020;color:#f7eddf}a{color:#ffe2a3}li{margin:1.5rem 0}code{display:block;overflow-wrap:anywhere;font-size:.8rem}</style><h1>Natally ${escape(inventory.version)}</h1><p>Verified build files. Choose the package for your device. These are test builds; signing and platform installation requirements still apply.</p><ul>${artifacts.map(artifact=>`<li><a href="${encodeURIComponent(artifact.filename)}" download>${escape(artifact.target)} — ${escape(artifact.filename)}</a> (${artifact.bytes.toLocaleString('en-CA')} bytes)<code>SHA-256 ${artifact.sha256}</code></li>`).join('')}</ul><p><a href="manifest.json">Download checksums and release identity</a> · <a href="../app.html?app=1">Return to Natally</a></p></html>`);
  return manifest;
}
