import { auth } from './firebase';
import { installInferenceKey, loadInferenceKey, loadInferenceKeySource } from './inferenceAccess';
import { getCheckoutCustomer, getRocheBalance, restoreCheckoutCustomer } from './revenueCatCheckout';

export type BillingAccess = {
  state: 'ready' | 'pending' | 'unavailable' | 'needs_attention';
  message: string;
  installed: boolean;
  limitUsd?: number;
  usageUsd?: number;
  remainingTurns?: number;
  souvenirOpeningAvailable?: boolean;
  source?: 'managed' | 'development';
  entitlementIds?: string[];
  entitlementExpirations?: Record<string, number | null>;
  purchasedProductIds?: string[];
  rocheBalance?: number | null;
  connected?: boolean;
  customerStatus?: 'verified' | 'unavailable';
};

function readingEntitlementId(): string {
  return String(import.meta.env.VITE_REVENUECAT_READING_ENTITLEMENT_ID || '').trim();
}

function validatedRocheBalance(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

async function readCommercialFacts(accountUid: string, current: () => boolean): Promise<Pick<BillingAccess, 'entitlementIds' | 'entitlementExpirations' | 'purchasedProductIds' | 'rocheBalance' | 'customerStatus'>> {
  const [customerResult, balanceResult] = await Promise.allSettled([getCheckoutCustomer(), getRocheBalance()]);
  if (!current()) throw new Error('Your account or reading access changed. Check purchased access again.');
  const customer = customerResult.status === 'fulfilled' && customerResult.value?.ownerUid === accountUid ? customerResult.value : null;
  return {
    entitlementIds: customer && Array.isArray(customer.activeEntitlementIds) ? customer.activeEntitlementIds : undefined,
    entitlementExpirations: customer?.entitlementExpirations,
    purchasedProductIds: customer && Array.isArray(customer.purchasedProductIds) ? customer.purchasedProductIds : undefined,
    rocheBalance: rocheBalanceFor(accountUid, balanceResult),
    customerStatus: customer ? 'verified' : 'unavailable',
  };
}

type RocheResult = PromiseSettledResult<{ ownerUid: string; currency: string; balance: number }>;
function rocheBalanceFor(accountUid: string, balanceResult: RocheResult): number | null {
  const value = balanceResult.status === 'fulfilled' ? balanceResult.value : null;
  return value && value.ownerUid === accountUid && value.currency === 'ROCHE'
    ? validatedRocheBalance(value.balance)
    : null;
}

function ownershipSummary(facts: Pick<BillingAccess, 'entitlementIds' | 'purchasedProductIds' | 'rocheBalance' | 'customerStatus'>): string {
  if (facts.customerStatus !== 'verified') return 'Your store purchase history could not be checked right now.';
  const hasPurchases = (facts.entitlementIds?.length ?? 0) > 0 || (facts.purchasedProductIds?.length ?? 0) > 0;
  const purchases = hasPurchases
    ? 'Your account has store purchases on record.'
    : 'Your account has no store purchases on record.';
  const balance = typeof facts.rocheBalance === 'number'
    ? ` Your ROCHE balance is ${facts.rocheBalance}.`
    : ' Your ROCHE balance is unknown right now.';
  return purchases + balance;
}

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
  const facts = await readCommercialFacts(accountUid, current);
  const ownership = ownershipSummary(facts);
  if (existingKey) {
    try {
      const keyCurrent = () => current();
      await ensureFundedKey(accountUid, existingKey, keyCurrent);
      await requireRoche(accountUid, keyCurrent);
      if (!current()) throw new Error('Your account or reading access changed. Check access again.');
      return {
        state: 'ready', installed: false, connected: true, ...facts,
        message: loadInferenceKeySource(accountUid) === 'personal'
          ? 'Your personal reading key is connected and funded. Purchased access stays tied to your account.'
          : 'Your existing reading access is connected and funded.',
      };
    } catch (error) {
      if (!current()) throw error;
      const detail = error instanceof Error && error.message ? error.message : 'Reading access could not be connected.';
      return { state: 'needs_attention', installed: false, connected: false, ...facts, message: `${ownership} ${detail}` };
    }
  }
  try {
  let endpoint: string;
  try {
    const value = billingEndpoint(reconcile);
    if (!value) {
      return {
        state: 'unavailable', installed: false, connected: false, ...facts,
        message: 'Your store purchase status is shown from RevenueCat. Reading access could not be connected here yet.',
      };
    }
    endpoint = value;
  } catch (error) {
    return {
      state: 'unavailable', installed: false, connected: false, ...facts,
      message: error instanceof Error && error.message
        ? error.message
        : 'Purchased reading access has an invalid service address.',
    };
  }
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
  if (result.state === 'pending') return { state: 'pending', installed: false, connected: false, ...facts, message: 'Your purchase is being reconciled. Check access again shortly; do not purchase again.' };
  if (result.state === 'unavailable') return { state: 'unavailable', installed: false, connected: false, ...facts, message: 'Purchased reading access is unavailable. Your current access is unchanged.' };
  if (result.state === 'needs_attention') return { state: 'needs_attention', installed: false, connected: false, ...facts, message: 'Your purchase needs reconciliation. Keep the receipt and contact support; do not purchase again.' };
  const key = typeof result.apiKey === 'string' ? result.apiKey.trim() : '';
  if (result.state === 'ready' && result.source === 'development' && result.provider === 'openrouter' && key) {
    const accessExpiresAt = Date.parse(result.accessExpiresAt);
    if (!(accessExpiresAt > Date.now()) || accessExpiresAt > Date.now() + 31 * 86400000) throw new Error('Development access has an invalid expiry.');
    const installed = install && (!existingKey || loadInferenceKeySource(accountUid) === 'development');
    if (!installed) {
      return {
        state: 'needs_attention', source: 'development', installed: false, connected: false, ...facts,
        message: 'Development access is available but could not be connected on this device. Check access again; do not purchase again.',
      };
    }
    await installInferenceKey(accountUid, key, () => current() && expiresAt > Date.now(), 'development', accessExpiresAt);
    const keyCurrent = () => auth.currentUser === owner && isCurrentSession() && loadInferenceKey(accountUid) === key;
    await ensureFundedKey(accountUid, key, keyCurrent);
    await requireRoche(accountUid, keyCurrent);
    if (!keyCurrent()) throw new Error('Your account or reading access changed. Check purchased access again.');
    return { state: 'ready', source: 'development', installed: true, connected: true, ...facts,
      message: 'Development reading access connected automatically. Your waiting question is ready to retry.' };
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
  if (!installed && !existingKey) {
    return {
      state: 'needs_attention', installed: false, connected: false,
      message: 'Purchased reading access could not be connected on this device. Check access again; do not purchase again.',
    };
  }
  if (installed) await installInferenceKey(accountUid, key, () => current() && expiresAt > Date.now(), 'managed');
  const activeKey = installed ? key : existingKey as string;
  if (installed) {
    const keyCurrent = () => auth.currentUser === owner && isCurrentSession() && loadInferenceKey(accountUid) === activeKey;
    await ensureFundedKey(accountUid, activeKey, keyCurrent);
    await requireRoche(accountUid, keyCurrent);
    if (!keyCurrent()) throw new Error('Your account or reading access changed. Check access again.');
  }
  return {
    state: 'ready', source: 'managed', installed, connected: installed, ...facts, limitUsd: limit, usageUsd: usage,
    message: installed
      ? 'Purchased reading access connected. Return to your reading or retry the waiting question.'
      : existingKey && loadInferenceKeySource(accountUid) === 'personal'
        ? 'Purchased access is ready. Your personal key remains connected and unchanged. Disconnect it, then check access to switch to purchased access.'
        : 'Purchased access is ready to connect.',
  };
  } catch (error) {
    if (!current()) throw error;
    const internal = error instanceof Error && /https?:|fetch|network|key service|api\b/i.test(error.message);
    const detail = error instanceof Error && error.message && !internal ? error.message : 'Reading access could not be connected right now.';
    return {
      state: 'needs_attention', installed: false, connected: false, ...facts,
      message: `${ownership} ${detail} Check reading access again; do not purchase again.`,
    };
  }
}

/**
 * Explicit Restore. Reads the restored RevenueCat customer and ROCHE balance
 * independently, validates ownership, and returns those facts even when the
 * key-connection step fails. A successful restore means restored ownership;
 * it never means connected inference.
 */
export async function restoreBillingPurchases(accountUid: string, isCurrentSession: () => boolean = () => true): Promise<BillingAccess> {
  await auth.authStateReady();
  const owner = auth.currentUser;
  if (!owner || owner.uid !== accountUid || !isCurrentSession()) throw new Error('Restore purchases from your signed-in account.');
  const current = () => auth.currentUser === owner && isCurrentSession();
  const [customerResult, balanceResult] = await Promise.allSettled([restoreCheckoutCustomer(), getRocheBalance()]);
  if (!current()) throw new Error('Your account changed during restore. Check purchases again.');
  const customer = customerResult.status === 'fulfilled' && customerResult.value?.ownerUid === accountUid ? customerResult.value : null;
  const facts: Pick<BillingAccess, 'entitlementIds' | 'entitlementExpirations' | 'purchasedProductIds' | 'rocheBalance' | 'customerStatus'> = {
    entitlementIds: customer && Array.isArray(customer.activeEntitlementIds) ? customer.activeEntitlementIds : undefined,
    entitlementExpirations: customer?.entitlementExpirations,
    purchasedProductIds: customer && Array.isArray(customer.purchasedProductIds) ? customer.purchasedProductIds : undefined,
    rocheBalance: rocheBalanceFor(accountUid, balanceResult),
    customerStatus: customer ? 'verified' : 'unavailable',
  };
  const ownership = ownershipSummary(facts);
  const existingKey = loadInferenceKey(accountUid);
  if (existingKey) {
    try {
      const keyCurrent = () => current() && loadInferenceKey(accountUid) === existingKey;
      await ensureFundedKey(accountUid, existingKey, keyCurrent);
      await requireRoche(accountUid, keyCurrent);
      if (!current() || loadInferenceKey(accountUid) !== existingKey) throw new Error('Your account changed during restore. Check purchases again.');
      return {
        state: 'ready', installed: false, connected: true, ...facts,
        message: `${ownership} Your existing reading access is connected and funded.`,
      };
    } catch (error) {
      if (!current()) throw error instanceof Error ? error : new Error('Your account changed during restore. Check purchases again.');
      const detail = error instanceof Error && error.message ? error.message : 'Reading access could not be connected.';
      return { state: 'needs_attention', installed: false, connected: false, ...facts, message: `${ownership} ${detail}` };
    }
  }
  try {
    const result = await reconcileBillingAccess(accountUid, true, current);
    const connected = result.state === 'ready' && !!result.connected;
    return {
      ...result, ...facts, connected,
      message: `${ownership} ${result.message}${connected ? '' : ' Reading access is not connected yet.'}`,
    };
  } catch (error) {
    if (!current()) throw error instanceof Error ? error : new Error('Your account changed during restore. Check purchases again.');
    const detail = error instanceof Error && error.message ? error.message : 'Reading access could not be connected.';
    return { state: 'needs_attention', installed: false, connected: false, ...facts, message: `${ownership} ${detail}` };
  }
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
  const access = await readBillingAccess(accountUid, true, current);
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
    const entitlementId = readingEntitlementId();
    if (entitlementId) {
      try {
        const customer = await getCheckoutCustomer();
        const expiresAt = customer?.entitlementExpirations?.[entitlementId];
        const expiryOpen = expiresAt === null || (typeof expiresAt === 'number' && Number.isFinite(expiresAt) && expiresAt > Date.now());
        canOpenSouvenir = customer?.ownerUid === accountUid &&
          Array.isArray(customer.activeEntitlementIds) &&
          customer.activeEntitlementIds.includes(entitlementId) &&
          expiryOpen;
      } catch {
        canOpenSouvenir = false;
      }
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
