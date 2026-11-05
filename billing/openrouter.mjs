// Low-level OpenRouter provisioning key API adapter (billing/openrouter.mjs).
//
// IMPORTANT: This module is NOT authoritative customer resolution or
// concurrency coordination. The caller MUST resolve the customer's
// RevenueCat association and serialize create operations BEFORE invoking
// createManagedKey/reconcileManagedKey. A missing existingKeyHash parameter
// is NOT evidence that the customer has no key; reconcileManagedKey requires
// an explicit existingKeyHash (non-empty string, or null only after the
// caller has verified absence against authoritative customer/provider
// records). Calling this module alone does NOT make provisioning complete.
//
// No persistence, no hosting, no SDK dependencies. Secrets are accepted via
// explicit options only, never read from or logged to the environment, and
// never embedded in errors.

const BASE_URL = "https://openrouter.ai/api/v1/keys";
const KEY_INFO_URL = "https://openrouter.ai/api/v1/key";
const TIMEOUT_MS = 15000;
const EXPIRY_MS = 60 * 60 * 1000;

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertOptions(options) {
  const adminKey = options?.adminKey;
  assertNonEmptyString(adminKey, "adminKey");
  const fetchImpl = options?.fetchImpl ?? fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("fetchImpl must be a function");
  }
  return { adminKey, fetchImpl };
}

function assertObjectData(payload) {
  if (payload === null || typeof payload !== "object" || typeof payload.data !== "object" || payload.data === null) {
    throw new Error("OpenRouter keys API returned no data object");
  }
}

function assertFiniteLimit(limit) {
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 0) {
    throw new Error("limit must be a finite non-negative number");
  }
  return limit;
}

function redactError(cause) {
  // Never leak response bodies, bearer tokens, or underlying error details.
  return new Error("OpenRouter keys API request failed");
}

async function request(method, url, { adminKey, fetchImpl }, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      method,
      headers: {
        Authorization: `Bearer ${adminKey}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });

    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      // Body intentionally not included in the error.
      throw new Error(`OpenRouter keys API returned HTTP ${response.status}`);
    }
    return payload;
  } catch (cause) {
    if (cause instanceof Error && /OpenRouter keys API/.test(cause.message)) {
      throw cause;
    }
    throw redactError(cause);
  } finally {
    clearTimeout(timer);
  }
}

function keyExpiryIso() {
  return new Date(Date.now() + EXPIRY_MS).toISOString();
}

export async function createManagedKey({ name }, options) {
  assertNonEmptyString(name, "name");
  const opts = assertOptions(options);
  // Creation is ALWAYS zero-limit; callers cannot pass a funded creation.
  // No automatic retry: if the outcome is uncertain (transport error,
  // ambiguous HTTP status, or a malformed success response), throw a generic
  // pending error; the POST may still have succeeded.
  let payload;
  try {
    payload = await request("POST", BASE_URL, opts, {
      name,
      limit: 0,
      limit_reset: null,
      expires_at: keyExpiryIso(),
    });
  } catch {
    throw new Error(
      "OpenRouter key creation outcome is pending; reconcile before retrying",
    );
  }
  const key = payload?.key;
  const data = payload?.data;
  if (
    typeof key !== "string" ||
    key.length === 0 ||
    typeof data?.hash !== "string" ||
    data.hash.length === 0
  ) {
    throw new Error(
      "OpenRouter key creation outcome is pending; reconcile before retrying",
    );
  }
  return { key, hash: data.hash, data };
}

export async function readManagedKey(hash, options) {
  assertNonEmptyString(hash, "hash");
  const opts = assertOptions(options);
  const payload = await request(
    "GET",
    `${BASE_URL}/${encodeURIComponent(hash)}`,
    opts,
  );
  assertObjectData(payload);
  const data = payload.data;
  if (typeof data?.hash === "string" && data.hash.length > 0 && data.hash !== hash) {
    throw new Error("OpenRouter key response hash mismatch");
  }
  return data;
}

export async function validateManagedKey(key, options) {
  assertNonEmptyString(key, "key");
  const opts = assertOptions(options);
  let payload;
  try {
    payload = await request("GET", KEY_INFO_URL, { ...opts, adminKey: key });
  } catch (cause) {
    if (cause instanceof Error && /HTTP 40[13]\b/.test(cause.message)) {
      return false;
    }
    throw cause;
  }
  assertObjectData(payload);
  const data = payload.data;
  if (typeof data !== "object" || data === null) {
    throw new Error("OpenRouter key info returned no data object");
  }
  if (data.disabled === true) return false;
  if (typeof data.expires_at !== "string" || data.expires_at.length === 0) {
    return false;
  }
  const expiresAt = Date.parse(data.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  if (expiresAt > Date.now() + EXPIRY_MS) return false;
  return true;
}

export async function setManagedKeyLimit(hash, absoluteLimitUsd, options) {
  assertNonEmptyString(hash, "hash");
  const limit = assertFiniteLimit(absoluteLimitUsd);
  const opts = assertOptions(options);
  const payload = await request(
    "PATCH",
    `${BASE_URL}/${encodeURIComponent(hash)}`,
    opts,
    { limit, limit_reset: null },
  );
  assertObjectData(payload);
  const data = payload.data;
  if (typeof data?.hash === "string" && data.hash.length > 0 && data.hash !== hash) {
    throw new Error("OpenRouter key response hash mismatch");
  }
  return data;
}

export async function disableManagedKey(hash, options) {
  assertNonEmptyString(hash, "hash");
  const opts = assertOptions(options);
  const payload = await request(
    "PATCH",
    `${BASE_URL}/${encodeURIComponent(hash)}`,
    opts,
    { disabled: true },
  );
  assertObjectData(payload);
  const data = payload.data;
  if (typeof data?.hash === "string" && data.hash.length > 0 && data.hash !== hash) {
    throw new Error("OpenRouter key response hash mismatch");
  }
  return data;
}

export async function reconcileManagedKey(
  { existingKeyHash, existingKey, name, readLimitUsd },
  options,
) {
  if (typeof readLimitUsd !== "function") {
    throw new Error("readLimitUsd must be a function");
  }
  const absent = existingKeyHash === null && existingKey === null;
  if (!absent) {
    assertNonEmptyString(existingKeyHash, "existingKeyHash");
    assertNonEmptyString(existingKey, "existingKey");
  }
  let state = "existing";
  let resolved = { key: existingKey, hash: existingKeyHash };
  if (absent || !(await validateManagedKey(existingKey, options))) {
    state = "created";
    resolved = await createManagedKey({ name }, options);
  }
  const limitUsd = await readLimitUsd();
  assertFiniteLimit(limitUsd);
  let data = await setManagedKeyLimit(resolved.hash, limitUsd, options);
  if (limitUsd === 0) {
    data = await disableManagedKey(resolved.hash, options);
  }
  return { state, key: resolved.key, hash: resolved.hash, data };
}
