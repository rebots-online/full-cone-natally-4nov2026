// Derive resources in private staging and promote only changed bytes. Windows
// shell/thumbnail readers can map existing icons; identical icons need no rewrite.
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const master = 'public/branding/natally-icon-master.png';
const guideMaster = 'public/branding/natally-guide.png';
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
function promote(from, to) {
  if (existsSync(to) && digest(from) === digest(to)) return;
  mkdirSync(path.dirname(to), {recursive:true}); copyFileSync(from,to);
}
function tree(from,to) {
  for (const item of readdirSync(from,{withFileTypes:true})) {
    if (item.isDirectory()) tree(path.join(from,item.name),path.join(to,item.name));
    else promote(path.join(from,item.name),path.join(to,item.name));
  }
}
mkdirSync('build',{recursive:true});
const scratch = mkdtempSync(path.resolve('build/icon-generation-'));
const native = path.join(scratch,'native'), web = path.join(scratch,'web'), guide = path.join(scratch,'guide');
execFileSync('cargo',['tauri','icon',master,'--output',native],{stdio:'inherit'});
execFileSync('cargo',['tauri','icon',master,'--output',web,'--png','180','--png','192','--png','512'],{stdio:'inherit'});
execFileSync('cargo',['tauri','icon',guideMaster,'--output',guide,'--png','512'],{stdio:'inherit'});
for (const item of readdirSync(native,{withFileTypes:true})) {
  if (item.name === 'android') continue;
  if (item.isDirectory()) tree(path.join(native,item.name),path.join('src-tauri/icons',item.name));
  else promote(path.join(native,item.name),path.join('src-tauri/icons',item.name));
}
tree(web,'public/branding');
promote(path.join(native,'icon.ico'),'public/favicon.ico');
promote(path.join(native,'32x32.png'),'public/favicon-32.png');
promote(path.join(guide,'512x512.png'),'public/branding/natally-guide-512.png');
const resources = 'src-tauri/gen/android/app/src/main/res';
tree(path.join(native,'android'),resources);
const background = path.join(resources,'values/ic_launcher_background.xml');
const backgroundXml = '<resources><color name="ic_launcher_background">#120c1c</color></resources>\n';
if (!existsSync(background) || readFileSync(background,'utf8') !== backgroundXml) writeFileSync(background,backgroundXml);
promote(path.join(guide,'512x512.png'),path.join(resources,'drawable-nodpi/natally_guide.png'));
const provenance = JSON.parse(readFileSync('public/branding/icon-provenance.json','utf8'));
provenance.sourceSha256 = digest(master); provenance.alphaCorners = true;
provenance.guideLayer = {path:guideMaster,sha256:digest(guideMaster),prompt:'Exact Natally character in three-quarter guide pose, pointing to viewer right; transparent cutout, no chart, no background. Chart composed independently for tap and Android opening animation.'};
provenance.cornerEdit = 'Remove only pixels outside the rounded gold frame; preserve all interior artwork and use alpha-transparent outer corners.';
const provenanceBytes = JSON.stringify(provenance,null,2)+'\n';
if (readFileSync('public/branding/icon-provenance.json','utf8') !== provenanceBytes) writeFileSync('public/branding/icon-provenance.json',provenanceBytes);
