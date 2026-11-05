/**
 * Firebase Firestore operational store for Blink payment operations.
 *
 * Stores immutable operational records that associate a quote, its Blink
 * invoice, and a verified settlement. This is NOT an entitlement store, NOT a
 * balance, and NOT a ledger: access authority remains RevenueCat alone. The
 * collection is denied to clients by root firestore.rules; a service account
 * with datastore IAM is required.
 *
 * Security invariants:
 * - The service account JSON is server-only and never appears in results,
 *   errors, or logs.
 * - The Firestore REST endpoint is fixed to the production host and the named
 *   database from the app config (never the implicit default).
 * - Document ids must be sha256 hex; all payload content originates from the
 *   server, never from client input.
 * - No logs are emitted by this module.
 */

import { createFirebaseAuth, FIREBASE_REQUEST_TIMEOUT_MS as TIMEOUT_MS } from '../../billing/firebase-auth.mjs';

const COLLECTION_ID = 'natallyBlinkOperations';
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

/**
 * Create the Blink operations store backed by the approved Firebase
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
export async function createBlinkStore(env, { fetchImpl = fetch } = {}) {
  const { firestoreBase, documentsPath, authHeaders } = await createFirebaseAuth(env, { fetchImpl });

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
