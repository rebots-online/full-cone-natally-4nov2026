// RevenueCat V2 customer attributes adapter (billing/revenuecat-customer.mjs).
//
// Stores the OpenRouter provisioning key/hash as customer attributes on a
// RevenueCat V2 customer whose id equals the Firebase UID. No retries, no
// logging, no environment reads; secrets pass through options only and are
// never embedded in errors.

const BASE_URL = "https://api.revenuecat.com";
const TIMEOUT_MS = 15000;
const KEY_FIELD = "roche_openrouter_key";
const HASH_FIELD = "roche_openrouter_hash";
const CURRENCY_CODE = "ROCHE";
const MAX_VALUE_LENGTH = 500;
const MAX_PAGES = 50;

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertOptions(options) {
  const apiKey = options?.apiKey;
  const projectId = options?.projectId;
  assertNonEmptyString(apiKey, "apiKey");
  assertNonEmptyString(projectId, "projectId");
  const fetchImpl = options?.fetchImpl ?? fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("fetchImpl must be a function");
  }
  return { apiKey, projectId, fetchImpl };
}

async function request(method, url, { apiKey, fetchImpl }, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let response;
    try {
      response = await fetchImpl(url, {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      throw new Error("RevenueCat API request failed");
    }
    let payload = null;
    try {
      payload = await response.json();
    } catch {}
    if (!response.ok) {
      const error = new Error(`RevenueCat API returned HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("RevenueCat API returned unexpected payload shape");
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

function attributesPath(projectId, uid) {
  return `/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(uid)}/attributes`;
}

async function readAttributes(options) {
  const { apiKey, projectId, fetchImpl } = assertOptions(options);
  const expectedPath = attributesPath(projectId, options.uid);
  let url = new URL(`${BASE_URL}${expectedPath}`);
  url.searchParams.set("limit", "100");
  const attrs = new Map();
  const visited = new Set();
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const requestUrl = url.toString();
    if (url.origin !== BASE_URL || url.pathname !== expectedPath) {
      throw new Error("RevenueCat API returned an unexpected pagination URL");
    }
    if (visited.has(requestUrl)) {
      throw new Error("RevenueCat API pagination did not advance");
    }
    visited.add(requestUrl);
    const payload = await request("GET", requestUrl, { apiKey, fetchImpl });
    if (!Array.isArray(payload.items)) {
      throw new Error("RevenueCat API returned unexpected payload shape");
    }
    for (const item of payload.items) {
      if (!item || typeof item.name !== "string" || typeof item.value !== "string") {
        throw new Error("RevenueCat API returned a malformed attribute");
      }
      if (attrs.has(item.name)) {
        throw new Error(`RevenueCat API returned duplicate attribute ${item.name}`);
      }
      attrs.set(item.name, item.value);
    }
    const next = payload.next_page;
    if (next === null || next === undefined) return Object.fromEntries(attrs);
    assertNonEmptyString(next, "next_page");
    const nextUrl = next.startsWith("http") ? new URL(next) : new URL(next, `${BASE_URL}${expectedPath}`);
    url = nextUrl;
  }
  throw new Error("RevenueCat attributes pagination exceeded page limit");
}

export async function readCustomerKey(uid, options) {
  assertNonEmptyString(uid, "uid");
  const attrs = await readAttributes({ ...options, uid });
  const key = attrs[KEY_FIELD];
  const hash = attrs[HASH_FIELD];
  if (key === undefined && hash === undefined) return null;
  if (key === undefined || hash === undefined || key.length === 0 || hash.length === 0) {
    throw new Error("RevenueCat customer has an incomplete key/hash attribute pair");
  }
  return { key, hash };
}

export async function saveCustomerKey(uid, { key, hash }, options) {
  assertNonEmptyString(uid, "uid");
  assertValue(key, "key");
  assertValue(hash, "hash");
  const { apiKey, projectId, fetchImpl } = assertOptions(options);
  const path = attributesPath(projectId, uid);
  await request("POST", `${BASE_URL}${path}`, { apiKey, fetchImpl }, {
    attributes: [
      { name: KEY_FIELD, value: key },
      { name: HASH_FIELD, value: hash },
    ],
  });
  const attrs = await readAttributes({ ...options, uid });
  if (attrs[KEY_FIELD] !== key || attrs[HASH_FIELD] !== hash) {
    throw new Error("RevenueCat attribute verification failed after save");
  }
}

function assertValue(value, label) {
  assertNonEmptyString(value, label);
  if (value.length > MAX_VALUE_LENGTH) {
    throw new Error(`${label} exceeds ${MAX_VALUE_LENGTH} characters`);
  }
}

export async function readCustomer(uid, options) {
  assertNonEmptyString(uid, "uid");
  const { apiKey, projectId, fetchImpl } = assertOptions(options);
  const url = `${BASE_URL}/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(uid)}`;
  const customer = await request("GET", url, { apiKey, fetchImpl });
  if (customer?.id !== uid) {
    throw new Error("RevenueCat API returned a customer id that does not match the requested uid");
  }
  return customer;
}

export async function createCustomer(uid, options) {
  assertNonEmptyString(uid, "uid");
  const { apiKey, projectId, fetchImpl } = assertOptions(options);
  const url = `${BASE_URL}/v2/projects/${encodeURIComponent(projectId)}/customers`;
  let customer;
  try {
    customer = await request("POST", url, { apiKey, fetchImpl }, { id: uid });
  } catch (error) {
    if (error?.status !== 409) throw error;
    const existing = await readCustomer(uid, options);
    return { created: false, customer: existing };
  }
  if (customer?.id !== uid) {
    throw new Error("RevenueCat API returned a customer id that does not match the requested uid");
  }
  return { created: true, customer };
}

function balancesPath(projectId, uid) {
  return `/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(uid)}/virtual_currencies`;
}

export async function readCustomerRoche(uid, options) {
  assertNonEmptyString(uid, "uid");
  const { apiKey, projectId, fetchImpl } = assertOptions(options);
  const expectedPath = balancesPath(projectId, uid);
  let url = new URL(`${BASE_URL}${expectedPath}`);
  url.searchParams.set("include_empty_balances", "true");
  url.searchParams.set("limit", "100");
  let roche = null;
  const visited = new Set();
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const requestUrl = url.toString();
    if (url.origin !== BASE_URL || url.pathname !== expectedPath) {
      throw new Error("RevenueCat API returned an unexpected pagination URL");
    }
    if (visited.has(requestUrl)) {
      throw new Error("RevenueCat API pagination did not advance");
    }
    visited.add(requestUrl);
    const payload = await request("GET", requestUrl, { apiKey, fetchImpl });
    if (!Array.isArray(payload.items)) {
      throw new Error("RevenueCat API returned unexpected payload shape");
    }
    for (const item of payload.items) {
      if (!item || item.currency_code !== CURRENCY_CODE) continue;
      if (roche !== null) {
        throw new Error("RevenueCat API returned duplicate ROCHE balances");
      }
      const balance = item.balance;
      if (!Number.isSafeInteger(balance) || balance < 0) {
        throw new Error("RevenueCat API returned a malformed ROCHE balance");
      }
      roche = balance;
    }
    const next = payload.next_page;
    if (next === null || next === undefined) break;
    assertNonEmptyString(next, "next_page");
    if (page === MAX_PAGES - 1) {
      throw new Error("RevenueCat API pagination exceeded the maximum number of pages");
    }
    const nextUrl = next.startsWith("http") ? new URL(next) : new URL(next, `${BASE_URL}${expectedPath}`);
    nextUrl.searchParams.set("include_empty_balances", "true");
    nextUrl.searchParams.set("limit", "100");
    url = nextUrl;
  }
  if (roche === null) {
    throw new Error("RevenueCat customer has no ROCHE balance");
  }
  return { customerId: uid, currency: CURRENCY_CODE, balance: roche };
}
