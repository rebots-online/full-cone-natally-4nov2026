import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'node:crypto';
import { BillingError, required } from './billing-config.mjs';
const keyName = uid => 'natally-' + createHash('sha256').update(uid).digest('hex').slice(0,24);
function encryptionKey(env) {
  const key = Buffer.from(required(env,'BILLING_KEY_ENCRYPTION_KEY'),'base64');
  if (key.length !== 32) throw new BillingError('Invalid billing encryption key.');
  return key;
}
function seal(env, uid, value) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm',encryptionKey(env),iv);
  cipher.setAAD(Buffer.from(uid));
  const data = Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);
  return [iv,cipher.getAuthTag(),data].map(part=>part.toString('base64')).join('.');
}
function unseal(env, uid, value) {
  const [iv,tag,data] = value.split('.').map(part=>Buffer.from(part,'base64'));
  const cipher = createDecipheriv('aes-256-gcm',encryptionKey(env),iv);
  cipher.setAAD(Buffer.from(uid)); cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data),cipher.final()]).toString('utf8');
}
async function provider(env, path = '', method = 'GET', body) {
  const response = await fetch('https://openrouter.ai/api/v1/keys' + path, {method,
    headers:{Authorization:'Bearer '+required(env,'OPENROUTER_ADMIN_KEY'),'Content-Type':'application/json'},
    ...(body ? {body:JSON.stringify(body)} : {}),signal:AbortSignal.timeout(10000),redirect:'error'});
  if (!response.ok) throw new BillingError('Reading access is being reconciled. Do not purchase again.');
  return response.json();
}
export async function managedAccess(env, store, snapshot) {
  const account = await store.account(), totals = await store.totals();
  const base = {accountUid:store.uid,expiresAt:new Date(Date.now()+60000).toISOString(),includedTurns:totals.turns,
    remainingTurns:Math.max(0,totals.turns-totals.completed-totals.reserved),reservedTurns:totals.reserved};
  const canRead = Object.hasOwn(snapshot.capabilities,'reading');
  if (!account.key && (totals.micros <= 0 || !canRead)) return {...base,state:'unavailable'};
  if (!env('OPENROUTER_ADMIN_KEY') || !env('BILLING_KEY_ENCRYPTION_KEY')) return {...base,state:'pending'};
  let key = account.key;
  if (key?.creating) {
    // A key's plaintext is only returned on creation. Disable every orphan before
    // attempting a replacement, and do not repeat an uncertain creation request.
    const list = await provider(env,'?include_disabled=true');
    const found = list.data?.filter(item=>item.name === key.name) || [];
    for (const orphan of found) await provider(env,'/'+encodeURIComponent(orphan.hash),'PATCH',{disabled:true});
    if (!found.length) return {...base,state:'needs_attention'};
    account.key = {generation:key.generation}; await store.saveAccount(account); key = account.key;
  }
  if (!key?.hash) {
    encryptionKey(env);
    const generation = (key?.generation || 0)+1;
    const name = keyName(store.uid)+'-'+generation;
    account.key = {generation,name,creating:true}; await store.saveAccount(account);
    const created = await provider(env,'','POST',{name,limit:Math.max(0,totals.micros)/1000000,limit_reset:null,include_byok_in_limit:true});
    if (!created.key || !created.data?.hash) throw new BillingError('Reading key creation needs reconciliation.');
    account.key = {generation,name,hash:created.data.hash,encrypted:seal(env,store.uid,created.key)};
    await store.saveAccount(account); key = account.key;
  }
  const path = '/'+encodeURIComponent(key.hash);
  const existing = await provider(env,path);
  const usage = existing.data?.usage;
  if (typeof usage !== 'number' || !Number.isFinite(usage) || usage < 0) throw new BillingError('Reading usage needs reconciliation.');
  const limit = Math.max(0,totals.micros)/1000000;
  const disabled = !canRead || limit <= usage || totals.turns <= totals.completed;
  await provider(env,path,'PATCH',{limit,limit_reset:null,disabled,include_byok_in_limit:true});
  if (disabled) return {...base,state:'unavailable',limitUsd:limit,usageUsd:usage};
  return {...base,state:'ready',provider:'openrouter',source:'managed',apiKey:unseal(env,store.uid,key.encrypted),keyGeneration:key.generation,limitUsd:limit,usageUsd:usage};
}
export async function suspendManagedAccess(env,store) {
  const account = await store.account();
  if (account.key?.hash && env('OPENROUTER_ADMIN_KEY')) await provider(env,'/'+encodeURIComponent(account.key.hash),'PATCH',{disabled:true});
}
