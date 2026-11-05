/**
 * Firebase Firestore operational store for paid inference operations.
 *
 * Stores request state plus a short per-account operational lock. This is NOT
 * an entitlement store, NOT a balance, and NOT a ledger: purchase rights and
 * NATALTURN balance authority remain RevenueCat alone. The collection is
 * denied to clients by the current Firestore rules; a service account with
 * datastore IAM is required.
 *
 * Security invariants:
 * - The service account JSON is server-only and never appears in results,
 *   errors, or logs.
 * - The Firestore REST endpoint is fixed to the production host and the named
 *   database from the app config (never the implicit default).
 * - Document ids must be sha256 hex; all payload content originates from the
 *   server, never from client input.
 * - No global token cache and no logs are emitted by this module.
 */

import { createSign } from 'node:crypto';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/datastore';
const TIMEOUT_MS = 12000;
const COLLECTION_ID = 'natallyInferenceOperations';
const ID_PATTERN = /^[a-f0-9]{64}$/;
const PRECONDITION_FAILED = 412;

function sanitizeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function fail(code, message) {
  throw sanitizeError(code, message);
}

function readEnvValue(env, name) {
  if (typeof env === 'function') return env(name);
  if (env && typeof env === 'object') return env[name];
  return undefined;
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

async function fetchAccessToken(serviceAccount, fetchImpl) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    aud: TOKEN_ENDPOINT,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
    scope: OAUTH_SCOPE,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(serviceAccount.private_key);
  const assertion = `${header}.${claims}.${signature.toString('base64url')}`;

  let response;
  try {
    response = await fetchImpl(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'error',
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    fail('STORE_NETWORK', 'Store authentication failed');
  }
  if (!response.ok) {
    fail('STORE_AUTH', 'Store authentication failed');
  }
  let body;
  try {
    body = await response.json();
  } catch {
    fail('STORE_RESPONSE', 'Store authentication failed');
  }
  if (!body || typeof body !== 'object' || typeof body.access_token !== 'string' || body.access_token.length === 0) {
    fail('STORE_RESPONSE', 'Store authentication failed');
  }
  return body.access_token;
}

/**
 * Create the inference operations store backed by the approved Firebase
 * operational Firestore database.
 *
 * @param {Record<string, string> | ((name: string) => string | undefined)} env
 *   Environment source providing FIREBASE_SERVICE_ACCOUNT_JSON.
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<{
 *   get(id: string): Promise<{ payload: unknown, updateTime: string } | null>,
 *   create(id: string, payload: unknown): Promise<boolean>,
 *   replace(id: string, payload: unknown, updateTime: string): Promise<boolean>,
 * }>}
 */
export async function createInferenceStore(env, { fetchImpl = fetch } = {}) {
  const raw = readEnvValue(env, 'FIREBASE_SERVICE_ACCOUNT_JSON');
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  if (!serviceAccount || typeof serviceAccount !== 'object' || Array.isArray(serviceAccount)) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  if (serviceAccount.project_id !== firebaseConfig.projectId) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  if (typeof serviceAccount.client_email !== 'string' || serviceAccount.client_email.length === 0) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  if (
    typeof serviceAccount.private_key !== 'string' ||
    !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')
  ) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }
  const databaseId = firebaseConfig.firestoreDatabaseId;
  if (typeof databaseId !== 'string' || databaseId.length === 0) {
    fail('STORE_UNCONFIGURED', 'Store is not configured');
  }

  const firestoreBase = 'https://firestore.googleapis.com/v1/';
  const documentsPath =
    `projects/${encodeURIComponent(firebaseConfig.projectId)}` +
    `/databases/${encodeURIComponent(databaseId)}/documents`;

  const accessToken = await fetchAccessToken(serviceAccount, fetchImpl);
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  function requireId(id) {
    if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
      fail('STORE_INPUT', 'Operation id is invalid');
    }
    return id;
  }

  function resourceName(id) {
    return `${documentsPath}/${COLLECTION_ID}/${id}`;
  }

  function documentUrl(id) {
    return firestoreBase + resourceName(id);
  }

  async function commit(writes) {
    let response;
    try {
      response = await fetchImpl(`${firestoreBase}${documentsPath}:commit`, {
        method: 'POST',
        headers: authHeaders,
        redirect: 'error',
        body: JSON.stringify({ writes }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      fail('STORE_NETWORK', 'Store request failed');
    }
    return response;
  }

  function payloadFields(payload) {
    return { payload: { stringValue: JSON.stringify(payload) } };
  }

  async function readUpdateAndParse(id) {
    let response;
    try {
      response = await fetchImpl(documentUrl(id), {
        method: 'GET',
        headers: authHeaders,
        redirect: 'error',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      fail('STORE_NETWORK', 'Store request failed');
    }
    if (response.status === 404) return null;
    if (!response.ok) {
      fail('STORE_HTTP', 'Store request failed');
    }
    let doc;
    try {
      doc = await response.json();
    } catch {
      fail('STORE_RESPONSE', 'Store response was invalid');
    }
    if (!doc || typeof doc !== 'object' || typeof doc.updateTime !== 'string') {
      fail('STORE_RESPONSE', 'Store response was invalid');
    }
    const stringValue = doc.fields && doc.fields.payload && doc.fields.payload.stringValue;
    if (typeof stringValue !== 'string') {
      fail('STORE_RESPONSE', 'Store response was invalid');
    }
    let payload;
    try {
      payload = JSON.parse(stringValue);
    } catch {
      fail('STORE_RESPONSE', 'Store response was invalid');
    }
    return { payload, updateTime: doc.updateTime };
  }

  /**
   * Read the safe JSON error status code from a failed conditional commit.
   * Returns the code string or undefined; provider messages are never exposed.
   */
  async function conditionalErrorStatus(response) {
    try {
      const body = await response.json();
      if (body && typeof body === 'object' && typeof body.error?.status === 'string') {
        return body.error.status;
      }
    } catch {
      // fall through
    }
    return undefined;
  }

  return {
    /**
     * Read an operational record. Returns null when absent.
     */
    async get(id) {
      return readUpdateAndParse(requireId(id));
    },

    /**
     * Atomically create a record that must not already exist.
     * Returns false only on a recognized already-exists conflict; throws
     * otherwise (never false for arbitrary client errors).
     */
    async create(id, payload) {
      requireId(id);
      const response = await commit([{
        update: {
          name: resourceName(id),
          fields: payloadFields(payload),
        },
        currentDocument: { exists: false },
      }]);
      if (response.ok) return true;
      const errorStatus = await conditionalErrorStatus(response);
      if (response.status === 409 ||
          errorStatus === 'ALREADY_EXISTS' ||
          errorStatus === 'FAILED_PRECONDITION') {
        return false;
      }
      fail('STORE_HTTP', 'Store write failed');
    },

    /**
     * Atomically replace a record only at the given updateTime (CAS).
     * Returns false only on a recognized conflict (precondition or aborted);
     * throws otherwise.
     */
    async replace(id, payload, updateTime) {
      requireId(id);
      if (typeof updateTime !== 'string' || updateTime.length === 0) {
        fail('STORE_INPUT', 'Update time is invalid');
      }
      const response = await commit([{
        update: {
          name: resourceName(id),
          fields: payloadFields(payload),
        },
        currentDocument: { updateTime },
      }]);
      if (response.ok) return true;
      const errorStatus = await conditionalErrorStatus(response);
      if (response.status === 409 || response.status === PRECONDITION_FAILED ||
          errorStatus === 'ABORTED' || errorStatus === 'FAILED_PRECONDITION') {
        return false;
      }
      fail('STORE_HTTP', 'Store write failed');
    },
  };
}
