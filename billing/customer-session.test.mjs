// Tests for billing/customer-session.mjs using the real helper modules with
// in-memory fetchImpl HTTP fixtures (no network, no new dependencies).

import test from "node:test";
import assert from "node:assert/strict";
import {
  syncCustomerSessionKey,
  deactivateCustomerSessionKey,
} from "./customer-session.mjs";

const UID = "user-123";
const RC_PREFIX = "/v2/projects/p1";
const EXISTING_KEY = "sk-or-existing";
const EXISTING_HASH = "hash-existing";

function respond(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function createHttp() {
  const state = {
    rcCustomerStatus: 200,
    rcAttributes: {},
    rcAttributesReadStatus: 200,
    rcAttributesWriteStatus: 200,
    rcRoche: 100,
    rcRocheStatus: 200,
    orValidateStatus: 200,
    orKeys: new Map([[EXISTING_HASH, { hash: EXISTING_HASH, disabled: false, limit: null }]]),
    nextHash: 1,
  };
  const calls = [];

  const rc = async (url, req = {}) => {
    const path = new URL(url).pathname;
    calls.push({ provider: "rc", method: req.method, path });
    if (path === `${RC_PREFIX}/customers` && req.method === "POST") return respond(200, { id: UID });
    if (path === `${RC_PREFIX}/customers/${UID}`) {
      if (req.method === "GET") return respond(state.rcCustomerStatus, { id: UID });
      if (req.method === "POST") return respond(200, { id: UID });
    }
    if (path === `${RC_PREFIX}/customers/${UID}/attributes`) {
      if (req.method === "GET") {
        if (state.rcAttributesReadStatus !== 200) return respond(state.rcAttributesReadStatus, {});
        return respond(200, {
          items: Object.entries(state.rcAttributes).map(([name, value]) => ({ name, value })),
          next_page: null,
        });
      }
      if (req.method === "POST") {
        if (state.rcAttributesWriteStatus !== 200) return respond(state.rcAttributesWriteStatus, {});
        for (const a of JSON.parse(req.body).attributes) state.rcAttributes[a.name] = a.value;
        return respond(200, {});
      }
    }
    if (path === `${RC_PREFIX}/customers/${UID}/virtual_currencies` && req.method === "GET") {
      if (state.rcRocheStatus !== 200) return respond(state.rcRocheStatus, {});
      return respond(200, {
        items: [{ currency_code: "ROCHE", balance: state.rcRoche }],
        next_page: null,
      });
    }
    return respond(404, {});
  };

  const or = async (url, req = {}) => {
    const path = new URL(url).pathname;
    calls.push({
      provider: "or",
      method: req.method,
      path,
      body: req.body ? JSON.parse(req.body) : null,
      auth: req.headers.Authorization,
    });
    if (path === "/api/v1/key" && req.method === "GET") {
      if (state.orValidateStatus !== 200) return respond(state.orValidateStatus, {});
      return respond(200, {
        data: { disabled: false, expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() },
      });
    }
    if (path === "/api/v1/keys" && req.method === "POST") {
      const hash = `hash-new-${state.nextHash++}`;
      state.orKeys.set(hash, { hash, disabled: false, limit: JSON.parse(req.body).limit });
      return respond(200, { key: `sk-or-${hash}`, data: { hash } });
    }
    const match = path.match(/^\/api\/v1\/keys\/([^/]+)$/);
    if (match) {
      const hash = decodeURIComponent(match[1]);
      const key = state.orKeys.get(hash);
      if (!key) return respond(404, {});
      if (req.method === "GET") return respond(200, { data: key });
      if (req.method === "PATCH") {
        Object.assign(key, JSON.parse(req.body));
        return respond(200, { data: key });
      }
    }
    return respond(404, {});
  };

  return { state, calls, rc, or };
}

function options({ rc, or } = {}) {
  return {
    revenueCat: { apiKey: "rc-secret", projectId: "p1", fetchImpl: rc },
    openRouter: { adminKey: "or-admin", fetchImpl: or },
    limitFromRoche: (snapshot) => snapshot.balance * 0.1,
    withCustomerOperation: async (uid, operation) => {
      assert.equal(uid, UID);
      return operation();
    },
  };
}

test("sync funds an existing valid key in order: validate, balance, PATCH, save, readback", async () => {
  const http = createHttp();
  http.state.rcAttributes = {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  };
  const result = await syncCustomerSessionKey(UID, options(http));

  assert.deepEqual(result, {
    state: "ready",
    customerId: UID,
    roche: 100,
    limitUsd: 10,
    key: EXISTING_KEY,
    hash: EXISTING_HASH,
    keyState: "existing",
    data: { hash: EXISTING_HASH, disabled: false, limit: 10, limit_reset: null },
  });

  const orCalls = http.calls.filter((c) => c.provider === "or");
  assert.deepEqual(
    orCalls.map((c) => `${c.method} ${c.path}`),
    [
      "GET /api/v1/key",
      "PATCH /api/v1/keys/hash-existing",
    ],
  );
  assert.equal(orCalls.length, 2);
  assert.equal(orCalls[0].auth, `Bearer ${EXISTING_KEY}`);
  assert.deepEqual(orCalls[1].body, { limit: 10, limit_reset: null });

  const rcCalls = http.calls.filter((c) => c.provider === "rc").map((c) => c.path);
  assert.deepEqual(rcCalls, [
    `${RC_PREFIX}/customers/${UID}`,
    `${RC_PREFIX}/customers/${UID}/attributes`,
    `${RC_PREFIX}/customers/${UID}/virtual_currencies`,
    `${RC_PREFIX}/customers/${UID}/attributes`,
    `${RC_PREFIX}/customers/${UID}/attributes`,
  ]);
  assert.deepEqual(http.calls.map(c => `${c.provider} ${c.method} ${c.path}`), [
    `rc GET ${RC_PREFIX}/customers/${UID}`,
    `rc GET ${RC_PREFIX}/customers/${UID}/attributes`,
    "or GET /api/v1/key",
    `rc GET ${RC_PREFIX}/customers/${UID}/virtual_currencies`,
    "or PATCH /api/v1/keys/hash-existing",
    `rc POST ${RC_PREFIX}/customers/${UID}/attributes`,
    `rc GET ${RC_PREFIX}/customers/${UID}/attributes`,
  ]);
  assert.equal(http.state.rcAttributes.roche_openrouter_key, EXISTING_KEY);
  assert.equal(http.state.rcAttributes.roche_openrouter_hash, EXISTING_HASH);
});

test("sync creates a new key when the association is missing", async () => {
  const http = createHttp();
  const result = await syncCustomerSessionKey(UID, options(http));

  assert.equal(result.state, "ready");
  assert.equal(result.keyState, "created");
  assert.match(result.hash, /^hash-new-/);
  assert.equal(result.key, `sk-or-${result.hash}`);
  assert.equal(http.state.rcAttributes.roche_openrouter_key, result.key);
  assert.equal(http.state.rcAttributes.roche_openrouter_hash, result.hash);
});

test("sync creates a new key when validation fails with 401", async () => {
  const http = createHttp();
  http.state.orValidateStatus = 401;
  http.state.rcAttributes = {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  };
  const result = await syncCustomerSessionKey(UID, options(http));

  assert.equal(result.keyState, "created");
  assert.notEqual(result.hash, EXISTING_HASH);
  assert.equal(http.state.rcAttributes.roche_openrouter_hash, result.hash);
  const savedKeys = [...http.state.orKeys.keys()];
  assert.ok(savedKeys.includes(EXISTING_HASH));
  assert.ok(savedKeys.includes(result.hash));
  assert.equal(http.state.orKeys.get(EXISTING_HASH).disabled, false);
});

test("sync creates the RevenueCat customer on 404", async () => {
  const http = createHttp();
  http.state.rcCustomerStatus = 404;
  const result = await syncCustomerSessionKey(UID, options(http));
  assert.equal(result.customerId, UID);
  const customerCalls = http.calls.filter((c) => c.path === `${RC_PREFIX}/customers/${UID}` || c.path === `${RC_PREFIX}/customers`);
  assert.deepEqual(customerCalls.map((c) => c.method), ["GET", "POST"]);
});

test("sync propagates non-404 customer read errors without creating", async () => {
  const http = createHttp();
  http.state.rcCustomerStatus = 500;
  await assert.rejects(syncCustomerSessionKey(UID, options(http)), /HTTP 500/);
  assert.equal(http.calls.filter((c) => c.method === "POST" && c.provider === "rc").length, 0);
});

test("sync issues no PATCH when the ROCHE read fails", async () => {
  const http = createHttp();
  http.state.rcAttributes = {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  };
  http.state.rcRocheStatus = 503;
  await assert.rejects(syncCustomerSessionKey(UID, options(http)), /HTTP 503/);
  assert.equal(
    http.calls.filter((c) => c.provider === "or" && c.method === "PATCH").length,
    0,
  );
});

test("sync disables the key when ROCHE is zero and reports unfunded", async () => {
  const http = createHttp();
  http.state.rcRoche = 0;
  const result = await syncCustomerSessionKey(UID, options(http));

  assert.equal(result.state, "unfunded");
  assert.equal(result.roche, 0);
  assert.equal(result.limitUsd, 0);
  const patches = http.calls.filter((c) => c.provider === "or" && c.method === "PATCH");
  assert.deepEqual(patches.map((c) => c.body), [
    { limit: 0, limit_reset: null },
    { disabled: true },
  ]);
  assert.equal(http.state.orKeys.get(result.hash).disabled, true);
});

test("sync propagates a failed association write instead of fake success", async () => {
  const http = createHttp();
  http.state.rcAttributesWriteStatus = 502;
  await assert.rejects(syncCustomerSessionKey(UID, options(http)), /HTTP 502/);
  assert.deepEqual(http.state.rcAttributes, {});
});

test("sync rejects an invalid conversion without patching the key", async () => {
  for (const invalid of [() => -5, () => Number.NaN, () => 0, () => Infinity, () => "1"]) {
    const http = createHttp();
    await assert.rejects(
      syncCustomerSessionKey(UID, { ...options(http), limitFromRoche: invalid }),
    );
    assert.equal(
      http.calls.filter((c) => c.provider === "or" && c.method === "PATCH").length,
      0,
    );
  }
});

test("sync validates arguments before any side effects", async () => {
  const http = createHttp();
  const base = options(http);
  await assert.rejects(syncCustomerSessionKey("", base), /uid/);
  await assert.rejects(syncCustomerSessionKey("  ", base), /uid/);
  await assert.rejects(
    syncCustomerSessionKey(UID, { ...base, withCustomerOperation: undefined }),
    /withCustomerOperation/,
  );
  await assert.rejects(
    syncCustomerSessionKey(UID, { ...base, limitFromRoche: undefined }),
    /limitFromRoche/,
  );
  assert.equal(http.calls.length, 0);
});

test("deactivate disables the key when the hash matches", async () => {
  const http = createHttp();
  http.state.rcAttributes = {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  };
  const result = await deactivateCustomerSessionKey(UID, EXISTING_HASH, options(http));

  assert.deepEqual(result, { deactivated: true });
  assert.equal(http.state.orKeys.get(EXISTING_HASH).disabled, true);
  assert.deepEqual(http.state.rcAttributes, {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  });
});

test("deactivate does nothing without an association", async () => {
  const http = createHttp();
  const result = await deactivateCustomerSessionKey(UID, EXISTING_HASH, options(http));
  assert.deepEqual(result, { deactivated: false });
  assert.equal(http.calls.filter((c) => c.provider === "or").length, 0);
});

test("deactivate does not disable a superseded key", async () => {
  const http = createHttp();
  http.state.rcAttributes = {
    roche_openrouter_key: EXISTING_KEY,
    roche_openrouter_hash: EXISTING_HASH,
  };
  const result = await deactivateCustomerSessionKey(UID, "hash-stale", options(http));
  assert.deepEqual(result, { deactivated: false });
  assert.equal(http.state.orKeys.get(EXISTING_HASH).disabled, false);
});

test("deactivate validates expectedHash and uid before any side effects", async () => {
  const http = createHttp();
  const base = options(http);
  await assert.rejects(deactivateCustomerSessionKey(UID, "", base), /expectedHash/);
  await assert.rejects(deactivateCustomerSessionKey("", EXISTING_HASH, base), /uid/);
  await assert.rejects(
    deactivateCustomerSessionKey(UID, EXISTING_HASH, { ...base, withCustomerOperation: undefined }),
    /withCustomerOperation/,
  );
  assert.equal(http.calls.length, 0);
});


test("zero ROCHE cannot be converted into a positive provider allowance", async () => {
  const http = createHttp();
  http.state.rcRoche = 0;
  await assert.rejects(syncCustomerSessionKey(UID, { ...options(http), limitFromRoche: () => 1 }), /conversion/);
  assert.equal(http.calls.some(c => c.provider === "or" && c.method === "PATCH"), false);
});


test("all HTTP operations remain inside the supplied customer boundary", async () => {
  const http = createHttp();
  let entered = false;
  const wrap = fetchImpl => async (...args) => {
    assert.equal(entered, true);
    return fetchImpl(...args);
  };
  const opts = options({ rc: wrap(http.rc), or: wrap(http.or) });
  opts.withCustomerOperation = async (uid, operation) => {
    assert.equal(uid, UID);
    entered = true;
    try { return await operation(); } finally { entered = false; }
  };
  await syncCustomerSessionKey(UID, opts);
  assert.equal(entered, false);
});

test("association readback failure never returns ready", async () => {
  const http = createHttp();
  const rc = async (url, req = {}) => {
    const result = await http.rc(url, req);
    if (req.method === "POST" && new URL(url).pathname === `${RC_PREFIX}/customers/${UID}/attributes`) {
      http.state.rcAttributesReadStatus = 503;
    }
    return result;
  };
  await assert.rejects(syncCustomerSessionKey(UID, options({ ...http, rc })), /HTTP 503/);
  assert.equal(http.state.rcAttributes.roche_openrouter_hash, "hash-new-1");
  assert.deepEqual(http.calls.at(-1), { provider: "rc", method: "GET", path: `${RC_PREFIX}/customers/${UID}/attributes` });
});
