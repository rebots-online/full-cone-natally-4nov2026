/**
 * Read-only RevenueCat authority projection.
 *
 * This module is a read-only projection of RevenueCat's authority: it performs
 * read-only queries against the RevenueCat v2 REST API and projects the
 * customer's purchases, active entitlements, and virtual currency balances
 * into a sanitized access snapshot. It never grants access, mutates any
 * resource, claims readiness, persists state, or exposes financial or
 * receipt data. RevenueCat is the authority for paid-access facts; this module
 * only reads and projects it. The bearer API key is server-only and never appears in
 * results or errors.
 */

const RC_ORIGIN = 'https://api.revenuecat.com';
const RC_BASE = `${RC_ORIGIN}/v2`;
const PROJECT_ID = 'projaba0bd94';
const ENVIRONMENT = 'production';
const PAGE_LIMIT = 100;
const MAX_PAGES = 25;
const TIMEOUT_MS = 12000;
const EXPIRY_WINDOW_MS = 60000;

const SOUVENIR_PRODUCT_ID = 'proda88125bed7';
const EXPERIENTIAL_PRODUCT_ID = 'prod2f046e3b64';

const READING_ENTITLEMENT_ID = 'entlbc6dd8a62a';
const DOWNLOADS_ENTITLEMENT_ID = 'entl2ef69e9c03';

const ROCHE_CURRENCY = 'ROCHE';
const NATALTURN_CURRENCY = 'NATALTURN';

const UID_PATTERN = /^.{1,128}$/s;

function isValidUid(uid) {
  if (!UID_PATTERN.test(uid)) return false;
  for (const ch of uid) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) return false;
  }
  if (uid === '.' || uid === '..') return false;
  return true;
}

/**
 * Project the paid-access facts for a customer from RevenueCat.
 *
 * @param {string} uid Customer app user id.
 * @param {object} options
 * @param {string} options.apiKey RevenueCat secret API key (server-only).
 * @param {typeof fetch} [options.fetchImpl] Injectable fetch for tests.
 * @param {() => number} [options.now] Injectable clock in epoch ms.
 * @returns {Promise<{
 *   accountUid: string,
 *   environment: 'production',
 *   observedAt: string,
 *   expiresAt: string,
 *   remainingTurns: number,
 *   rocheUnits: number,
 *   entitlementIds: string[],
 *   hasReadingPurchase: boolean,
 *   hasExperiencePurchase: boolean,
 *   readingPurchaseIds: string[],
 *   experiencePurchaseIds: string[]
 * }>} Read-only authority projection.
 */
export async function readRevenueCatAccess(uid, { apiKey, fetchImpl = fetch, now = Date.now() } = {}) {
  if (typeof uid !== 'string' || !isValidUid(uid)) {
    throw sanitized('invalid account uid');
  }
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw sanitized('missing revenuecat api key');
  }
  const observedNow = typeof now === 'function' ? now() : now;
  if (typeof observedNow !== 'number' || !Number.isFinite(observedNow)) {
    throw sanitized('invalid clock');
  }
  const encodedUid = encodeURIComponent(uid);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
  };
  const customerPath = `/projects/${PROJECT_ID}/customers/${encodedUid}`;

  const purchasesUrl = enforceProductionPurchasesQuery(
    `${RC_BASE}${customerPath}/purchases?environment=${ENVIRONMENT}&limit=${PAGE_LIMIT}`,
  );
  const purchases = await fetchAllPages(
    fetchImpl,
    headers,
    purchasesUrl,
    true,
  );
  const entitlementLists = await fetchAllPages(
    fetchImpl,
    headers,
    `${RC_BASE}${customerPath}/active_entitlements?limit=${PAGE_LIMIT}`,
    false,
  );
  const currencyLists = await fetchAllPages(
    fetchImpl,
    headers,
    `${RC_BASE}${customerPath}/virtual_currencies?limit=${PAGE_LIMIT}`,
    false,
  );

  const {
    readingPurchaseIds,
    experiencePurchaseIds,
  } = collectPurchases(purchases, uid, observedNow);
  const entitlementIds =
    readingPurchaseIds.length > 0
      ? collectEntitlements(entitlementLists, observedNow)
      : [];
  const rocheUnits = collectBalance(currencyLists, ROCHE_CURRENCY);
  const remainingTurns = collectBalance(currencyLists, NATALTURN_CURRENCY);

  const hasReadingPurchase = readingPurchaseIds.length > 0;
  const hasExperiencePurchase = experiencePurchaseIds.length > 0;

  return {
    accountUid: uid,
    environment: ENVIRONMENT,
    observedAt: new Date(observedNow).toISOString(),
    expiresAt: new Date(observedNow + EXPIRY_WINDOW_MS).toISOString(),
    remainingTurns,
    rocheUnits,
    entitlementIds,
    hasReadingPurchase,
    hasExperiencePurchase,
    readingPurchaseIds,
    experiencePurchaseIds,
  };
}

function collectPurchases(items, uid, observedNow) {
  const readingPurchaseIds = [];
  const experiencePurchaseIds = [];
  for (const item of items) {
    if (!isPlainObject(item)) {
      throw sanitized('unexpected purchase shape');
    }
    if (item.status !== 'owned') continue;
    if (item.environment !== ENVIRONMENT) continue;
    if (item.customer_id !== uid) continue;
    if (!Number.isFinite(item.purchased_at) || item.purchased_at < 0 || item.purchased_at > observedNow) continue;
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) continue;
    const productId = item.product_id;
    if (productId === SOUVENIR_PRODUCT_ID || productId === EXPERIENTIAL_PRODUCT_ID) {
      if (typeof item.id !== 'string' || item.id.length === 0) {
        throw sanitized('unexpected purchase id');
      }
    }
    if (productId === SOUVENIR_PRODUCT_ID) {
      readingPurchaseIds.push(item.id);
    } else if (productId === EXPERIENTIAL_PRODUCT_ID) {
      experiencePurchaseIds.push(item.id);
    }
  }
  return { readingPurchaseIds, experiencePurchaseIds };
}

function collectEntitlements(lists, observedNow) {
  const entitlementIds = [];
  for (const item of lists) {
    if (!isPlainObject(item)) {
      throw sanitized('unexpected entitlement shape');
    }
    const entitlementId = item.entitlement_id;
    if (entitlementId !== READING_ENTITLEMENT_ID && entitlementId !== DOWNLOADS_ENTITLEMENT_ID) {
      continue;
    }
    const expiresAt = item.expires_at;
    const lifetime = expiresAt === null;
    if (!lifetime && (!Number.isFinite(expiresAt) || expiresAt <= observedNow)) {
      continue;
    }
    entitlementIds.push(entitlementId);
  }
  return entitlementIds;
}

function collectBalance(lists, currencyCode) {
  let value = null;
  let seen = false;
  for (const item of lists) {
    if (!isPlainObject(item)) {
      throw sanitized('unexpected virtual currency shape');
    }
    if (item.currency_code !== currencyCode) continue;
    if (seen) {
      throw sanitized(`duplicate ${currencyCode} balance`);
    }
    seen = true;
    const balance = item.balance;
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw sanitized(`malformed ${currencyCode} balance`);
    }
    value = balance;
  }
  return seen ? value : 0;
}

async function fetchAllPages(fetchImpl, headers, initialUrl, requireProduction) {
  const initial = new URL(initialUrl);
  const expectedPathname = initial.pathname;
  const items = [];
  let url = initialUrl;
  const visited = new Set();

  for (let page = 0; page < MAX_PAGES; page += 1) {
    if (visited.has(url)) {
      throw sanitized('pagination cycle detected');
    }
    visited.add(url);

    if (requireProduction) {
      url = enforceProductionPurchasesQuery(url);
    }

    let response;
    try {
      response = await fetchImpl(url, {
        method: 'GET',
        headers,
        redirect: 'error',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      throw sanitized('revenuecat request failed');
    }

    if (response.status === 404 && page === 0) {
      return items;
    }
    if (!response.ok) {
      throw sanitized(`revenuecat request failed with status ${response.status}`);
    }

    let body;
    try {
      body = await response.json();
    } catch {
      throw sanitized('revenuecat returned invalid json');
    }
    if (!isPlainObject(body) || body.object !== 'list' || !Array.isArray(body.items)) {
      throw sanitized('unexpected list shape');
    }
    items.push(...body.items);

    const nextPage = body.next_page;
    if (nextPage === null || nextPage === undefined) {
      return items;
    }
    url = resolveNextPage(nextPage, expectedPathname);
  }
  throw sanitized('pagination exceeded page bound');
}

function enforceProductionPurchasesQuery(urlString) {
  const parsed = new URL(urlString);
  for (const key of parsed.searchParams.keys()) {
    if (key !== 'starting_after' && key !== 'limit' && key !== 'environment') {
      throw sanitized('unexpected purchases query key');
    }
  }
  const environment = parsed.searchParams.get('environment');
  if (environment !== null && environment !== ENVIRONMENT) {
    throw sanitized('purchases environment must be production');
  }
  parsed.searchParams.set('environment', ENVIRONMENT);
  return parsed.toString();
}

function resolveNextPage(nextPage, expectedPathname) {
  if (typeof nextPage !== 'string' || nextPage.length === 0) {
    throw sanitized('invalid pagination cursor');
  }
  let resolved;
  try {
    resolved = new URL(nextPage, RC_ORIGIN);
  } catch {
    throw sanitized('invalid pagination cursor');
  }
  if (resolved.origin !== RC_ORIGIN) {
    throw sanitized('invalid pagination host');
  }
  if (resolved.username || resolved.password || resolved.hash) {
    throw sanitized('invalid pagination cursor');
  }
  if (resolved.pathname !== expectedPathname) {
    throw sanitized('invalid pagination path');
  }
  return resolved.toString();
}

function sanitized(message) {
  return new Error(`revenuecat access: ${message}`);
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
