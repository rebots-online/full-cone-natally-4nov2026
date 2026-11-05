import { auth } from './firebase';
import { installInferenceKey, loadInferenceKey, loadInferenceKeySource } from './inferenceAccess';
import { getRocheBalance, restoreCheckoutCustomer } from './revenueCatCheckout';

export type BillingAccess = {
  state: 'ready' | 'pending' | 'unavailable' | 'needs_attention';
  message: string;
  installed: boolean;
  limitUsd?: number;
  usageUsd?: number;
  remainingTurns?: number;
  souvenirOpeningAvailable?: boolean;
  source?: 'managed' | 'development';
};

function billingEndpoint(reconcile: boolean): string | null {
  const endpoint = String(import.meta.env.VITE_BILLING_API_URL || '').trim();
  if (!endpoint) return null;
  const result = new URL(endpoint);
  if (result.protocol !== 'https:' || result.username || result.password || result.search || result.hash) {
    throw new Error('Purchased reading access has an invalid service address.');
  }
  return result.href.replace(/\/$/, '') + (reconcile ? '/billing/reconcile' : '/billing/access');
}

/**
 * Validates the currently installed user key directly against OpenRouter.
 * Only the account's own funded key passes: a numeric finite positive
 * limit_remaining, or the user's own paid unlimited key (limit === null and
 * is_free_tier === false). A zero-limit key never passes, not even for
 * free-model inference. No balance, key, or entitlement value is invented.
 */
async function ensureFundedKey(accountUid: string, key: string, isCurrentSession: () => boolean): Promise<string> {
  const owner = auth.currentUser;
  const current = () => !!owner && auth.currentUser === owner && isCurrentSession() && loadInferenceKey(accountUid) === key;
  if (!current()) throw new Error('Your account or reading access changed. Check access again.');
  let result: any;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + key },
      cache: 'no-store', credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!current()) throw new Error('Your account or reading access changed. Check access again.');
    result = await response.json();
    if (!response.ok) throw new Error(result?.error?.message || 'Reading access could not be verified with the provider.');
  } catch (error) {
    if (!current()) throw new Error('Your account or reading access changed. Check access again.');
    throw error instanceof Error && !(error instanceof SyntaxError)
      ? error
      : new Error('Reading access could not be verified. Check access in Profile → Account settings, then retry.');
  }
  if (!current()) throw new Error('Your account or reading access changed. Check access again.');
  const data = result?.data;
  if (!data || data.is_management_key) throw new Error('Reading access must be a user inference key, not a management key.');
  if (data.is_free_tier === true) throw new Error('Reading access requires a paid key. A free-tier key cannot be used here.');
  const limit = data.limit_remaining;
  const funded = (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) ||
    (limit === null && data.limit === null && data.limit_remaining === null && data.is_free_tier === false);
  if (!funded) throw new Error('Your reading access has no available balance. Check access in Profile → Account settings.');
  if (!current()) throw new Error('Your account or reading access changed. Check access again.');
  return key;
}

/**
 * Managed keys additionally require a fresh authoritative ROCHE balance:
 * same owner, ROCHE currency, and a positive balance. Personal and
 * development keys keep their existing user-supplied/authorized behavior
 * and are never gated on ROCHE.
 */
async function requireRoche(accountUid: string, current: () => boolean): Promise<void> {
  if (loadInferenceKeySource(accountUid) !== 'managed') return;
  const balance = await getRocheBalance();
  if (!current()) throw new Error('Your account or reading access changed. Check access again.');
  if (balance.ownerUid !== accountUid || balance.currency !== 'ROCHE' || !(balance.balance > 0)) {
    throw new Error('No available ROCHE. Top up ROCHE in the store, or connect a personal key in Profile → Account settings.');
  }
  if (!current()) throw new Error('Your account or reading access changed. Check access again.');
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
  if (result.state === 'ready' && result.source === 'development' && result.provider === 'openrouter' && key) {
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
  if (result.state !== 'ready' || result.provider !== 'openrouter' || result.source !== 'managed' || !key ||
      !Number.isSafeInteger(result.keyGeneration) || result.keyGeneration < 1 ||
      typeof limit !== 'number' || !Number.isFinite(limit) || limit < 0 ||
      typeof usage !== 'number' || !Number.isFinite(usage) || usage < 0) {
    throw new Error('Purchased reading access returned an incomplete key record. Check access again.');
  }
  // A personal key is never silently adopted or replaced by paid access.
  const installed = install && (!existingKey || loadInferenceKeySource(accountUid) !== 'personal');
  if (installed) await installInferenceKey(accountUid, key, () => current() && expiresAt > Date.now(), 'managed');
  return {
    state: 'ready', source: 'managed', installed, limitUsd: limit, usageUsd: usage,
    message: installed
      ? 'Purchased reading access connected. Return to your reading or retry the waiting question.'
      : existingKey && loadInferenceKeySource(accountUid) === 'personal'
        ? 'Purchased access is ready. Your personal key remains connected and unchanged. Disconnect it, then check access to switch to purchased access.'
        : 'Purchased access is ready to connect.',
  };
}

/** Fresh browsers recover their account's grant before submitting any inference. */
export async function ensureReadingAccess(accountUid: string, isCurrentSession: () => boolean): Promise<string> {
  if (!isCurrentSession()) throw new Error('Your account changed.');
  await auth.authStateReady();
  if (!isCurrentSession()) throw new Error('Your account changed.');
  const owner = auth.currentUser;
  if (!owner || owner.uid !== accountUid || !isCurrentSession()) throw new Error('Your account changed.');
  const current = () => auth.currentUser === owner && isCurrentSession();
  const existing = loadInferenceKey(accountUid);
  if (existing) {
    const keyCurrent = () => current() && loadInferenceKey(accountUid) === existing;
    await ensureFundedKey(accountUid, existing, keyCurrent);
    await requireRoche(accountUid, keyCurrent);
    if (!current() || loadInferenceKey(accountUid) !== existing) throw new Error('Your account changed.');
    return existing;
  }
  const access = await readBillingAccess(accountUid, true, () => current() && !loadInferenceKey(accountUid));
  if (!current()) throw new Error('Your account changed.');
  const installedKey = loadInferenceKey(accountUid);
  if (!installedKey) throw new Error(access.state === 'pending'
    ? 'Your reading access is being prepared. Your question is kept here; retry shortly.'
    : 'Reading access could not be connected automatically. Your question is kept here; check reading access and retry.');
  await ensureFundedKey(accountUid, installedKey, () => current() && loadInferenceKey(accountUid) === installedKey);
  await requireRoche(accountUid, () => current() && loadInferenceKey(accountUid) === installedKey);
  if (!current() || loadInferenceKey(accountUid) !== installedKey) throw new Error('Your account changed.');
  return installedKey;
}

export function reconcileBillingAccess(accountUid: string, install = true, isCurrentSession: () => boolean = () => true): Promise<BillingAccess> {
  return requestBillingAccess(accountUid, true, install, isCurrentSession);
}

export function readBillingAccess(accountUid: string, install = true, isCurrentSession: () => boolean = () => true): Promise<BillingAccess> {
  return requestBillingAccess(accountUid, false, install, isCurrentSession);
}

/**
 * Read-only UI affordance gate; grants nothing. Souvenir replay/read/export
 * is checked independently from ROCHE and key funding: an already-purchased
 * souvenir stays openable after ROCHE is spent. Entitlement does not enable
 * inference; no key is provisioned here.
 */
export async function readPaidConversationAccess(accountUid: string): Promise<{ canInfer: boolean; canOpenSouvenir: boolean }> {
  try {
    await auth.authStateReady();
    const owner = auth.currentUser;
    if (!owner || owner.uid !== accountUid) return { canInfer: false, canOpenSouvenir: false };
    const current = () => auth.currentUser === owner;
    let canOpenSouvenir = false;
    try {
      const customer = await restoreCheckoutCustomer();
      canOpenSouvenir = customer?.entitlements.active['natally_reading']?.isActive === true;
    } catch {
      canOpenSouvenir = false;
    }
    if (!current()) return { canInfer: false, canOpenSouvenir: false };
    let canInfer = false;
    if (loadInferenceKey(accountUid)) {
      try {
        await ensureReadingAccess(accountUid, () => auth.currentUser?.uid === accountUid);
        canInfer = true;
      } catch {
        canInfer = false;
      }
    }
    if (!current()) return { canInfer: false, canOpenSouvenir: false };
    return { canInfer, canOpenSouvenir };
  } catch {
    return { canInfer: false, canOpenSouvenir: false };
  }
}
