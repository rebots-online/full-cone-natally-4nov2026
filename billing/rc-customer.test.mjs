import test from "node:test";
import assert from "node:assert/strict";
import {
  readCustomerKey,
  saveCustomerKey,
  readCustomer,
  createCustomer,
} from "./revenuecat-customer.mjs";

const UID = "user-1234";
const PROJECT_ID = "proj_abc";
const OPTIONS = { apiKey: "sk_test_key", projectId: PROJECT_ID };
const ATTRIBUTES_URL = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${UID}/attributes?limit=100`;
const CUSTOMER_URL = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${UID}`;
const CUSTOMERS_URL = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers`;

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function attribute(name, value) {
  return { name, value };
}

function attributesPage(items, nextPage) {
  return jsonResponse({ items, next_page: nextPage ?? null });
}

test("readCustomerKey returns null when no attributes exist and performs no POST", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init?.method });
    return attributesPage([]);
  };
  const result = await readCustomerKey(UID, { ...OPTIONS, fetchImpl });
  assert.equal(result, null);
  assert.deepEqual(calls, [{ url: ATTRIBUTES_URL, method: "GET" }]);
});

test("readCustomerKey hits the /v2 attributes endpoint with limit=100", async () => {
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    return attributesPage([
      attribute("roche_openrouter_key", "key-value"),
      attribute("roche_openrouter_hash", "hash-value"),
    ]);
  };
  const result = await readCustomerKey(UID, { ...OPTIONS, fetchImpl });
  assert.deepEqual(result, { key: "key-value", hash: "hash-value" });
  assert.deepEqual(urls, [ATTRIBUTES_URL]);
});

test("readCustomerKey follows pagination on same origin and exact pathname only", async () => {
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    if (urls.length === 1) {
      return attributesPage(
        [attribute("roche_openrouter_key", "k")],
        `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${UID}/attributes?limit=100&cursor=page2`
      );
    }
    return attributesPage([attribute("roche_openrouter_hash", "h")], null);
  };
  const result = await readCustomerKey(UID, { ...OPTIONS, fetchImpl });
  assert.deepEqual(result, { key: "k", hash: "h" });
  assert.equal(urls.length, 2);
  for (const url of urls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://api.revenuecat.com");
    assert.equal(parsed.pathname, `/v2/projects/${PROJECT_ID}/customers/${UID}/attributes`);
  }
});

test("readCustomerKey rejects a pagination URL off a different origin", async () => {
  const fetchImpl = async () =>
    attributesPage(
      [],
      "https://evil.example.com/v2/projects/x/customers/y/attributes?limit=100"
    );
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /unexpected pagination URL/
  );
});

test("readCustomerKey rejects a repeated pagination URL that does not advance", async () => {
  const fetchImpl = async () => attributesPage([], ATTRIBUTES_URL);
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /did not advance/
  );
});

test("readCustomerKey rejects a page with duplicate attribute names", async () => {
  const fetchImpl = async () =>
    attributesPage([
      attribute("roche_openrouter_key", "a"),
      attribute("roche_openrouter_key", "b"),
    ]);
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /duplicate attribute/
  );
});

test("readCustomerKey rejects malformed attribute items instead of skipping them", async () => {
  const fetchImpl = async () =>
    attributesPage([{ name: 42, value: "x" }]);
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /malformed attribute/
  );
});

test("readCustomerKey rejects an incomplete key/hash pair", async () => {
  const fetchImpl = async () =>
    attributesPage([attribute("roche_openrouter_key", "only-key")]);
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /incomplete key\/hash/
  );
});

test("readCustomerKey surfaces HTTP errors with a numeric status and no body", async () => {
  const fetchImpl = async () => jsonResponse({ detail: "nope" }, 403);
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    (error) => {
      assert.equal(error.status, 403);
      assert.equal(typeof error.status, "number");
      assert.doesNotMatch(error.message, /nope/);
      return true;
    }
  );
});

test("saveCustomerKey POSTs then verifies via exact readback", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init?.method, body: init?.body });
    if (init?.method === "POST") return jsonResponse({});
    return attributesPage([
      attribute("roche_openrouter_key", "k1"),
      attribute("roche_openrouter_hash", "h1"),
    ]);
  };
  await saveCustomerKey(UID, { key: "k1", hash: "h1" }, { ...OPTIONS, fetchImpl });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, ATTRIBUTES_URL.replace("?limit=100", ""));
  assert.equal(calls[0].method, "POST");
  assert.deepEqual(JSON.parse(calls[0].body), {
    attributes: [
      { name: "roche_openrouter_key", value: "k1" },
      { name: "roche_openrouter_hash", value: "h1" },
    ],
  });
  assert.equal(calls[1].url, ATTRIBUTES_URL);
});

test("saveCustomerKey fails when readback does not match what was saved", async () => {
  const fetchImpl = async (url, init) => {
    if (init?.method === "POST") return jsonResponse({});
    return attributesPage([
      attribute("roche_openrouter_key", "other"),
      attribute("roche_openrouter_hash", "h1"),
    ]);
  };
  await assert.rejects(
    saveCustomerKey(UID, { key: "k1", hash: "h1" }, { ...OPTIONS, fetchImpl }),
    /verification failed after save/
  );
});

test("readCustomer GETs the /v2 customer endpoint and never creates", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init?.method });
    return jsonResponse({ id: UID });
  };
  const customer = await readCustomer(UID, { ...OPTIONS, fetchImpl });
  assert.deepEqual(customer, { id: UID });
  assert.deepEqual(calls, [{ url: CUSTOMER_URL, method: "GET" }]);
});

test("createCustomer POSTs and returns created true when id matches uid", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init?.method });
    return jsonResponse({ id: UID });
  };
  const { created, customer } = await createCustomer(UID, { ...OPTIONS, fetchImpl });
  assert.equal(created, true);
  assert.deepEqual(customer, { id: UID });
  assert.deepEqual(calls, [{ url: CUSTOMERS_URL, method: "POST" }]);
});

test("createCustomer on 409 loads the existing customer and returns created false", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init?.method });
    if (init?.method === "POST") return jsonResponse({ detail: "exists" }, 409);
    return jsonResponse({ id: UID });
  };
  const { created, customer } = await createCustomer(UID, { ...OPTIONS, fetchImpl });
  assert.equal(created, false);
  assert.deepEqual(customer, { id: UID });
  assert.deepEqual(calls, [
    { url: CUSTOMERS_URL, method: "POST" },
    { url: CUSTOMER_URL, method: "GET" },
  ]);
});

test("createCustomer rejects a POST response whose id does not match uid", async () => {
  const fetchImpl = async () => jsonResponse({ id: "someone-else" });
  await assert.rejects(
    createCustomer(UID, { ...OPTIONS, fetchImpl }),
    /does not match/
  );
});

test("createCustomer propagates transport errors without retrying creation", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts += 1;
    throw new TypeError("network down");
  };
  await assert.rejects(
    createCustomer(UID, { ...OPTIONS, fetchImpl }),
    /RevenueCat API request failed/
  );
  assert.equal(attempts, 1);
});

test("createCustomer propagates non-409 HTTP errors without retrying creation", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts += 1;
    return jsonResponse({ detail: "server exploded" }, 500);
  };
  await assert.rejects(
    createCustomer(UID, { ...OPTIONS, fetchImpl }),
    (error) => {
      assert.equal(error.status, 500);
      return true;
    }
  );
  assert.equal(attempts, 1);
});

test("readCustomer rejects a GET response whose id does not match uid", async () => {
  const fetchImpl = async () => jsonResponse({ id: "someone-else" });
  await assert.rejects(
    readCustomer(UID, { ...OPTIONS, fetchImpl }),
    /does not match/
  );
});

test("createCustomer rejects when the 409 fallback GET returns a mismatched id", async () => {
  const fetchImpl = async (url, init) => {
    if (init?.method === "POST") return jsonResponse({ detail: "exists" }, 409);
    return jsonResponse({ id: "someone-else" });
  };
  await assert.rejects(
    createCustomer(UID, { ...OPTIONS, fetchImpl }),
    /does not match/
  );
});

test("readCustomerKey rejects an A-B-A pagination loop before re-fetching a visited URL", async () => {
  const urls = [];
  const pageA = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${UID}/attributes?limit=100&cursor=a`;
  const pageB = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${UID}/attributes?limit=100&cursor=b`;
  const fetchImpl = async (url) => {
    urls.push(url);
    if (urls.length === 1) return attributesPage([], pageA);
    if (urls.length === 2) return attributesPage([], pageB);
    return attributesPage([], ATTRIBUTES_URL);
  };
  await assert.rejects(
    readCustomerKey(UID, { ...OPTIONS, fetchImpl }),
    /did not advance/
  );
  assert.equal(urls.length, 3);
});

test("errors never embed secrets in their message", async () => {
  const fetchImpl = async () => jsonResponse({ detail: "denied" }, 401);
  await assert.rejects(readCustomerKey(UID, { ...OPTIONS, fetchImpl }), (error) => {
    assert.doesNotMatch(error.message, /sk_test_key/);
    return true;
  });
});
