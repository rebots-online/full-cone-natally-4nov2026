// Actual account balances and immutable grants in the existing named Firestore
// database. Callers supply authenticated owners and verified grant facts.
import { createHash } from 'node:crypto';
import { createFirebaseAuth, FIREBASE_REQUEST_TIMEOUT_MS } from './firebase-auth.mjs';

const ACCOUNTS = 'natallyCreditAccounts';
const GRANTS = 'natallyCreditGrants';
const MAX_ATTEMPTS = 5;
const isRecord = value => typeof value === 'object' && value !== null && !Array.isArray(value);
const hash = value => createHash('sha256').update(value).digest('hex');
function storeError(code, message, retryable = false) {
  const error = new Error(message);
  error.code = code;
  error.retryable = retryable;
  return error;
}
function fail(code, message) { throw storeError(code, message); }
function nonblank(value, label, code = 'CREDIT_STORE_INPUT') {
  if (typeof value !== 'string' || value.trim() === '') fail(code, `${label} is invalid`);
  return value;
}
function amount(value, label, minimum = 0, code = 'CREDIT_STORE_INPUT') {
  if (!Number.isSafeInteger(value) || value < minimum) fail(code, `${label} is invalid`);
  return value;
}
function sourceIdentity(uid, source, sourceId) {
  nonblank(uid, 'Account owner');
  if (source !== 'redemption' && source !== 'payment') fail('CREDIT_STORE_INPUT', 'Grant source is invalid');
  nonblank(sourceId, 'Grant source identity');
  return hash(JSON.stringify([uid, source, sourceId]));
}
function accountPayload(payload, uid) {
  if (!isRecord(payload) || payload.uid !== uid) fail('CREDIT_STORE_DATA', 'Stored credit account owner is invalid');
  return Object.freeze({
    uid,
    creditBalance: amount(payload.creditBalance, 'Stored credit balance', 0, 'CREDIT_STORE_DATA'),
    providerAllowanceUsdMicros: amount(payload.providerAllowanceUsdMicros, 'Stored provider allowance', 0, 'CREDIT_STORE_DATA'),
  });
}
function receiptPayload(payload, uid, source, sourceId, receiptId) {
  if (!isRecord(payload) || payload.uid !== uid || payload.source !== source ||
      payload.sourceId !== sourceId || payload.receiptId !== receiptId) {
    fail('CREDIT_STORE_DATA', 'Stored grant receipt identity is invalid');
  }
  return Object.freeze({
    uid, source, sourceId, receiptId,
    creditQuantity: amount(payload.creditQuantity, 'Stored grant credit quantity', 1, 'CREDIT_STORE_DATA'),
    providerAllowanceUsdMicros: amount(payload.providerAllowanceUsdMicros, 'Stored grant provider allowance', 0, 'CREDIT_STORE_DATA'),
  });
}
function assertSameGrant(receipt, expected) {
  if (receipt.creditQuantity !== expected.creditQuantity ||
      receipt.providerAllowanceUsdMicros !== expected.providerAllowanceUsdMicros) {
    fail('CREDIT_STORE_GRANT_MISMATCH', 'The existing receipt has different grant facts');
  }
}
function addSafe(balance, grant) {
  const total = BigInt(balance) + BigInt(grant);
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) fail('CREDIT_STORE_RANGE', 'The resulting account balance exceeds the safe integer range');
  return Number(total);
}

export async function createFirebaseCreditStore(env, { fetchImpl = fetch } = {}) {
  const { firestoreBase, documentsPath, authHeaders } = await createFirebaseAuth(env, { fetchImpl });
  const resourceName = (collection, id) => `${documentsPath}/${collection}/${id}`;
  async function request(url, method = 'GET', body) {
    try {
      return await fetchImpl(url, {
        method, headers: authHeaders, redirect: 'error',
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(FIREBASE_REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw storeError('CREDIT_STORE_NETWORK', 'The credit store request outcome could not be confirmed', true);
    }
  }
  async function readDocument(collection, id) {
    const name = resourceName(collection, id);
    const response = await request(firestoreBase + name);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw storeError('CREDIT_STORE_HTTP', 'The credit store read could not be confirmed',
        response.status === 408 || response.status === 429 || response.status >= 500);
    }
    let doc;
    try { doc = await response.json(); }
    catch { throw storeError('CREDIT_STORE_RESPONSE', 'The credit store response could not be confirmed', true); }
    if (!isRecord(doc) || doc.name !== name || typeof doc.updateTime !== 'string' || doc.updateTime === '') {
      fail('CREDIT_STORE_DATA', 'Stored credit document metadata is invalid');
    }
    const raw = doc.fields?.payload?.stringValue;
    if (typeof raw !== 'string') fail('CREDIT_STORE_DATA', 'Stored credit payload is invalid');
    let payload;
    try { payload = JSON.parse(raw); }
    catch { fail('CREDIT_STORE_DATA', 'Stored credit payload is invalid'); }
    return { payload, updateTime: doc.updateTime };
  }
  async function accountState(uid) {
    const state = await readDocument(ACCOUNTS, hash(nonblank(uid, 'Account owner')));
    return state === null ? null : { payload: accountPayload(state.payload, uid), updateTime: state.updateTime };
  }
  async function readReceipt(uid, source, sourceId) {
    const receiptId = sourceIdentity(uid, source, sourceId);
    const state = await readDocument(GRANTS, receiptId);
    return state === null ? null : receiptPayload(state.payload, uid, source, sourceId, receiptId);
  }
  const write = (name, payload, currentDocument) => ({
    update: { name, fields: { payload: { stringValue: JSON.stringify(payload) } } },
    currentDocument,
  });
  async function commit(writes) {
    const response = await request(`${firestoreBase}${documentsPath}:commit`, 'POST', { writes });
    if (response.ok) return true;
    let status;
    try { status = (await response.json())?.error?.status; }
    catch { /* Provider messages and response contents are never exposed. */ }
    if (response.status === 409 || response.status === 412 ||
        status === 'ABORTED' || status === 'ALREADY_EXISTS' || status === 'FAILED_PRECONDITION') return false;
    throw storeError('CREDIT_STORE_HTTP', 'The credit grant outcome could not be confirmed',
      response.status === 408 || response.status === 429 || response.status >= 500);
  }
  async function currentResult(expected, created) {
    const receipt = await readReceipt(expected.uid, expected.source, expected.sourceId);
    if (receipt === null) fail('CREDIT_STORE_DATA', 'The confirmed grant receipt is missing');
    assertSameGrant(receipt, expected);
    const state = await accountState(expected.uid);
    if (state === null) fail('CREDIT_STORE_DATA', 'A grant receipt exists without its credit account');
    return Object.freeze({ receipt, account: state.payload, created });
  }
  return Object.freeze({
    async readAccount(uid) {
      const state = await accountState(uid);
      return state?.payload ?? null;
    },
    readReceipt,
    async grantOnce(uid, grant) {
      if (!isRecord(grant)) fail('CREDIT_STORE_INPUT', 'Grant facts are invalid');
      const { source, sourceId } = grant;
      const receiptId = sourceIdentity(uid, source, sourceId);
      const expected = Object.freeze({
        uid, source, sourceId, receiptId,
        creditQuantity: amount(grant.creditQuantity, 'Grant credit quantity', 1),
        providerAllowanceUsdMicros: amount(grant.providerAllowanceUsdMicros, 'Grant provider allowance'),
      });
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const existing = await readReceipt(uid, source, sourceId);
          if (existing !== null) {
            assertSameGrant(existing, expected);
            const state = await accountState(uid);
            if (state === null) fail('CREDIT_STORE_DATA', 'A grant receipt exists without its credit account');
            return Object.freeze({ receipt: existing, account: state.payload, created: false });
          }
          const state = await accountState(uid);
          const next = {
            uid,
            creditBalance: addSafe(state?.payload.creditBalance ?? 0, expected.creditQuantity),
            providerAllowanceUsdMicros: addSafe(state?.payload.providerAllowanceUsdMicros ?? 0, expected.providerAllowanceUsdMicros),
          };
          const committed = await commit([
            write(resourceName(GRANTS, receiptId), expected, { exists: false }),
            write(resourceName(ACCOUNTS, hash(uid)), next,
              state === null ? { exists: false } : { updateTime: state.updateTime }),
          ]);
          if (committed) return await currentResult(expected, true);
        } catch (error) {
          if (error?.retryable !== true) throw error;
        }
        // Conflict or ambiguous transport: reread the same immutable identity
        // before any subsequent CAS; never blindly repeat an increment.
      }
      fail('CREDIT_STORE_RETRY_EXHAUSTED', 'The grant outcome could not be confirmed; retry with the same source identity');
    },
  });
}
