// Apply this installation's approved defaults using the full annotated environment.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';
import { createKStoreClient, parseEnvironmentDocument, serializeAssignment, synchronizeEnvironment, checkEnvironment } from './environment.mjs';
import { pathToFileURL } from 'node:url';

export async function updateBillingEnvironment(updates, { checkpoint = 'v130-billing' } = {}) {
  const client = createKStoreClient();
  const before = readFileSync('.env', 'utf8');
  const local = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
  for (const [name, content] of [['env', before], ['env-local', local]]) {
    const hash = createHash('sha256').update(content).digest('hex');
    const target = `CREDENTIALS/Natally/${checkpoint}-${name}-${hash.slice(0, 16)}.env`;
    try { const old = await client.read_document(target); if (old.content !== content) throw Error('Environment checkpoint mismatch'); }
    catch (error) { if (error.code !== 'KSTORE_NOT_FOUND') throw error; await client.write_with_exact_readback(target, content, {title: 'Exact pre-edit Natally environment checkpoint'}); }
  }
  let text = before;
  const localValues = parseEnvironmentDocument(local).valueMap;
  for (const [name, value] of Object.entries(updates)) {
    if (localValues[name] && localValues[name] !== value) throw Error(`Explicit local override requires reconciliation for ${name}`);
    const parsed = parseEnvironmentDocument(text);
    const entry = parsed.entries.find(e => e.name === name);
    const lines = text.split('\n');
    if (entry) lines.splice(entry.line, entry.end-entry.line+1, serializeAssignment(name,value));
    else lines.push(serializeAssignment(name,value));
    text = lines.join('\n');
  }
  // These obsolete quantities/campaigns do not participate in the permanent-code contract.
  text = text.replace(/^BILLING_REDEMPTION_(?:CAMPAIGN|CREDITS)=.*\r?\n/gm, '');
  const template = readFileSync('.env.example','utf8');
  const synchronized = synchronizeEnvironment({template,environment:text,local});
  const checked = checkEnvironment({template,environment:synchronized,local});
  if (!checked.ok) throw Error(`Environment validation failed: ${checked.findings.join(', ')}`);
  writeFileSync('.env', synchronized);
  return Object.keys(updates);
}

export async function configureBillingEnvironment() {
  const client = createKStoreClient();
  const configured={...parseEnvironmentDocument(readFileSync('.env','utf8')).valueMap,...(existsSync('.env.local')?parseEnvironmentDocument(readFileSync('.env.local','utf8')).valueMap:{})};
  const signing = parseEnvironmentDocument((await client.read_document('CREDENTIALS/prefetch-android-signing.md')).content).valueMap;
  for (const name of ['SQUASH_ANDROID_KEYSTORE_FILE','SQUASH_ANDROID_KEY_ALIAS','SQUASH_ANDROID_STORE_PASSWORD','SQUASH_ANDROID_KEY_PASSWORD','SQUASH_ANDROID_CERT_SHA256']) if (!signing[name]) throw Error(`Canonical signing binding missing: ${name}`);
  const secretPath = 'CREDENTIALS/Natally/credentials.env';
  let content='';
  try { content=(await client.read_document(secretPath)).content; } catch(error) { if(error.code!=='KSTORE_NOT_FOUND') throw error; }
  if (!configured.BILLING_KEY_ENCRYPTION_KEY && !parseEnvironmentDocument(content).valueMap.BILLING_KEY_ENCRYPTION_KEY) {
    content += '\n# AES-256-GCM envelope key for Natally managed OpenRouter key custody. Generated once; preserve existing values.\n'+serializeAssignment('BILLING_KEY_ENCRYPTION_KEY',randomBytes(32).toString('base64'))+'\n';
    await client.write_with_exact_readback(secretPath,content,{title:'Natally server credentials'});
  }
  return updateBillingEnvironment({
    BILLING_REDEMPTION_CODE:configured.BILLING_REDEMPTION_CODE||'Ch4n3l.C3351', BILLING_REDEMPTION_ALLOWANCE_USD:configured.BILLING_REDEMPTION_ALLOWANCE_USD||'10.00',
    BILLING_KEY_ENCRYPTION_KEY:configured.BILLING_KEY_ENCRYPTION_KEY||`kstore://admin-manual/${secretPath}#BILLING_KEY_ENCRYPTION_KEY`,
    BILLING_TOPUP_ALLOCATION_BPS:'4000',
    BILLING_ALLOWED_ORIGIN:configured.BILLING_ALLOWED_ORIGIN||'https://natally.robin.mba,https://natally.surge.sh,http://tauri.localhost,https://tauri.localhost,tauri://localhost',
    BILLING_GCP_PROJECT:configured.BILLING_GCP_PROJECT||'rochemediaservices-infra', BILLING_GCP_REGION:configured.BILLING_GCP_REGION||'us-west1', BILLING_GCP_SERVICE:configured.BILLING_GCP_SERVICE||'natally-billing',
    ANDROID_KEYSTORE_PATH:signing.SQUASH_ANDROID_KEYSTORE_FILE, ANDROID_KEY_ALIAS:signing.SQUASH_ANDROID_KEY_ALIAS,
    ANDROID_KEYSTORE_PASSWORD:'kstore://admin-manual/CREDENTIALS/prefetch-android-signing.md#SQUASH_ANDROID_STORE_PASSWORD',
    ANDROID_KEY_PASSWORD:'kstore://admin-manual/CREDENTIALS/prefetch-android-signing.md#SQUASH_ANDROID_KEY_PASSWORD',
    ANDROID_SIGNING_CERT_SHA256:signing.SQUASH_ANDROID_CERT_SHA256,
  });
}
if(import.meta.url===pathToFileURL(process.argv[1]??'').href)configureBillingEnvironment().then(names=>console.log('Configured bindings: '+names.join(', '))).catch(e=>{console.error(e.message);process.exitCode=1;});
