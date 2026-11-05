import { auth } from './firebase';
import { installInferenceKey, loadInferenceKey, loadInferenceKeySource, removeInferenceKey } from './inferenceAccess';
import { waitForPurchase } from './purchaseGate';

export type BillingAccess = {
  state: 'ready' | 'pending' | 'unavailable' | 'needs_attention';
  message: string;
  installed: boolean;
  limitUsd?: number;
  usageUsd?: number;
  source?: 'managed' | 'development';
};

function billingEndpoint(reconcile: boolean): string | null {
  const endpoint = String(import.meta.env.VITE_BILLING_API_URL || 'https://natally-hosted-chat.netlify.app').trim();
  if (!endpoint) return null;
  const result = new URL(endpoint);
  if (result.protocol !== 'https:' || result.username || result.password || result.search || result.hash) {
    throw new Error('Purchased reading access has an invalid service address.');
  }
  return result.href.replace(/\/$/, '') + (reconcile ? '/billing/reconcile' : '/billing/access');
}

/** A purchase-success callback is a reconciliation trigger, never proof of payment. */
async function requestBillingAccess(accountUid: string, reconcile: boolean, install: boolean, isCurrentSession: () => boolean): Promise<BillingAccess> {
  await auth.authStateReady();
  const owner = auth.currentUser;
  if (!owner || owner.uid !== accountUid || !isCurrentSession()) throw new Error('Open purchased access from your signed-in account.');
  const existingKey = loadInferenceKey(accountUid);
  const current = () => auth.currentUser === owner && isCurrentSession() && loadInferenceKey(accountUid) === existingKey;
  const endpoint = billingEndpoint(reconcile);
  if (!endpoint) return { state: 'unavailable', message: 'Purchasing is not connected yet. Your current reading access is unchanged.', installed: false };
  const token = await owner.getIdToken();
  if (!current()) throw new Error('Your account or reading access changed. Check purchased access again.');
  const response = await fetch(endpoint, {
    method: reconcile ? 'POST' : 'GET',
    headers: { Authorization: 'Bearer ' + token, ...(reconcile ? { 'Content-Type': 'application/json' } : {}) },
    ...(reconcile ? { body: '{}' } : {}),
    credentials: 'omit', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Purchased access could not be confirmed. Check access again; another purchase is not needed.');
  const result = await response.json();
  const expiresAt = typeof result?.expiresAt === 'string' ? Date.parse(result.expiresAt) : NaN;
  if (!current()) throw new Error('Your account or reading access changed. Check purchased access again.');
  if (result?.accountUid !== accountUid || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || expiresAt > Date.now() + 5 * 60 * 1000) {
    throw new Error('The purchased-access response is stale or belongs to a different account. Check access again.');
  }
  if (result.state === 'pending') return { state: 'pending', message: 'Your purchase is being reconciled. Check access again shortly; do not purchase again.', installed: false };
  if (result.state === 'unavailable') return { state: 'unavailable', message: 'Purchased reading access is unavailable. Your current access is unchanged.', installed: false };
  if (result.state === 'needs_attention') return { state: 'needs_attention', message: 'Your purchase needs reconciliation. Keep the receipt and contact support; do not purchase again.', installed: false };
  const key = typeof result.apiKey === 'string' ? result.apiKey.trim() : '';
  if (import.meta.env.DEV && result.state === 'ready' && result.source === 'development' && result.provider === 'openrouter' && key) {
    const accessExpiresAt = Date.parse(result.accessExpiresAt);
    if (!(accessExpiresAt > Date.now()) || accessExpiresAt > Date.now() + 31 * 86400000) throw new Error('Development access has an invalid expiry.');
    const installed = install && (!existingKey || loadInferenceKeySource(accountUid) === 'development');
    if (installed) await installInferenceKey(accountUid, key, () => current() && expiresAt > Date.now(), 'development', accessExpiresAt);
    return { state: 'ready', source: 'development', installed, message: installed
      ? 'Development reading access connected automatically. Your waiting question is ready to retry.'
      : 'Development access is available. Your existing reading key is unchanged.' };
  }
  const limit = result.limitUsd;
  const usage = result.usageUsd;
  if (result.state !== 'ready' || result.provider !== 'openrouter' || result.source !== 'managed' || result.transport !== 'relay' ||
      !Number.isSafeInteger(result.keyGeneration) || result.keyGeneration < 1 ||
      typeof limit !== 'number' || !Number.isFinite(limit) || limit < 0 ||
      typeof usage !== 'number' || !Number.isFinite(usage) || usage < 0) {
    throw new Error('Purchased reading access returned an incomplete key record. Check access again.');
  }
  // A personal key is never silently adopted or replaced by paid access.
  const installed = install;
  if (installed && loadInferenceKeySource(accountUid) === 'managed') removeInferenceKey(accountUid);
  return {
    state: 'ready', source: 'managed', installed, limitUsd: limit, usageUsd: usage,
    message: 'Purchased reading access is ready through the secure reading service.',
  };
}

const accessRequests = new Map<string, Promise<void>>();

/** Fresh browsers recover their account's grant before submitting any inference. */
export async function ensureReadingAccess(accountUid: string, isCurrentSession: () => boolean): Promise<string> {
  if (!isCurrentSession()) throw new Error('Your account changed.');
  const existing = loadInferenceKey(accountUid);
  if (import.meta.env.DEV && existing && loadInferenceKeySource(accountUid) !== 'managed') return existing;
  let pending = accessRequests.get(accountUid);
  if (!pending) {
    pending = (async()=>{
      const owner=auth.currentUser;
      const current=()=>isCurrentSession() && auth.currentUser===owner && owner?.uid===accountUid;
      let access=await readBillingAccess(accountUid,true,current);
      if(access.state==='unavailable') {
        if(!owner||!current())throw new Error('Your account changed.');
        await waitForPurchase(owner,current);
        if(!current())throw new Error('Your account changed.');
        access=await readBillingAccess(accountUid,true,current);
      }
      for(let retry=0;access.state==='pending' && retry<12;retry++) {
        await new Promise(resolve=>setTimeout(resolve,1000));
        if(!current())throw new Error('Your account changed.');
        access=await readBillingAccess(accountUid,true,current);
      }
      if(access.state!=='ready')throw Object.assign(new Error(access.message),{code:'reading_access_required'});
    })().finally(() => { accessRequests.delete(accountUid); });
    accessRequests.set(accountUid, pending);
  }
  await pending;
  if (!isCurrentSession()) throw new Error('Your account changed.');
  return 'managed-relay';
}

export function reconcileBillingAccess(accountUid: string, install = true, isCurrentSession: () => boolean = () => true): Promise<BillingAccess> {
  return requestBillingAccess(accountUid, true, install, isCurrentSession);
}

export function readBillingAccess(accountUid: string, install = true, isCurrentSession: () => boolean = () => true): Promise<BillingAccess> {
  return requestBillingAccess(accountUid, false, install, isCurrentSession);
}
