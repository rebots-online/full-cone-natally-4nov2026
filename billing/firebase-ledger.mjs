import { createHash, randomUUID } from 'node:crypto';
import { createFirebaseAuth } from './firebase-auth.mjs';

export const digest = value => createHash('sha256').update(value).digest('hex');
export const money = (value, label = 'Money', signed = false) => {
  if (!Number.isSafeInteger(value) || (!signed && value < 0)) throw new Error(`${label} is invalid.`);
  return value;
};
export const available = account => money(account.grantedUsdMicros + account.adjustmentUsdMicros - account.revokedUsdMicros - account.spentUsdMicros, 'Account balance', true);
export function blankAccount(uid) {
  // creditUnits is the firebase balance store's ledger field
  // (BILLING_CREDIT_BALANCE_STORE=firebase): defined here at account
  // creation so a read can never meet an undefined balance. The wallet's
  // absent-means-zero remains solely as read-time normalization for
  // accounts created before the field was frozen in.
  return { schemaVersion: 3, uid, creditUnits: 0, spentUsdMicros: 0, usageChargedUsdMicros: 0,
    keys: [], activeKeyHash: null, keyGeneration: 0, operation: null, redemptionReceipt: null, taxPayable: {} };
}
function validateAccount(account, uid) {
  if (!account || account.uid !== uid) throw new Error('Credit account ownership is invalid.');
  if (![2, 3].includes(account.schemaVersion)) throw Object.assign(new Error('Historical credit records need reconciliation before the balance can be changed.'), { code: 'LEGACY_ACCOUNT' });
  money(account.spentUsdMicros, 'Actual usage');
  if (account.schemaVersion === 2) {
    for (const name of ['grantedUsdMicros', 'revokedUsdMicros']) money(account[name], name);
    money(account.adjustmentUsdMicros, 'Account adjustments', true);
    available(account);
  } else money(account.usageChargedUsdMicros, 'Reconciled usage');
  if (!Array.isArray(account.keys) || !Number.isSafeInteger(account.keyGeneration)) throw new Error('Stored managed-key records are invalid.');
  return account;
}

export async function createBillingStore(environment) {
  const auth = await createFirebaseAuth(environment);
  const path = (collection, id) => `${auth.documentsPath}/${collection}/${id}`;
  async function request(url, method = 'GET', body) {
    const response = await fetch(auth.firestoreBase + url, { method, headers: await auth.getAuthHeaders(), redirect: 'error',
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(12000) });
    return response;
  }
  async function read(collection, id) {
    const name = path(collection, id), response = await request(name);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Credit record read failed (${response.status}).`);
    const document = await response.json();
    if (document.name !== name || typeof document.updateTime !== 'string' || typeof document.fields?.payload?.stringValue !== 'string') throw new Error('Stored credit record is malformed.');
    return { payload: JSON.parse(document.fields.payload.stringValue), updateTime: document.updateTime };
  }
  const write = (collection, id, payload, precondition) => ({ update: { name: path(collection, id), fields: {
    payload: { stringValue: JSON.stringify(payload) }, ...(payload.uid ? { uid: { stringValue: payload.uid } } : {}),
  } }, currentDocument: precondition });
  async function commit(writes) {
    const response = await request(`${auth.documentsPath}:commit`, 'POST', { writes });
    if (response.ok) return true;
    let error; try { error = await response.json(); } catch { /* no provider details */ }
    if ([409, 412].includes(response.status) || ['ABORTED', 'ALREADY_EXISTS', 'FAILED_PRECONDITION'].includes(error?.error?.status)) return false;
    throw new Error(`Credit record update could not be confirmed (${response.status}).`);
  }
  async function account(uid) {
    const state = await read('natallyCreditAccounts', digest(uid));
    return state ? { ...state, payload: validateAccount(state.payload, uid) } : null;
  }
  async function list(collection, uid) {
    const response = await request(`${auth.documentsPath}:runQuery`, 'POST', { structuredQuery: {
      from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: 'uid' }, op: 'EQUAL', value: { stringValue: uid } } },
    } });
    if (!response.ok) throw new Error('Purchase history could not be read.');
    const rows = await response.json();
    return rows.filter(row => row.document).map(row => JSON.parse(row.document.fields.payload.stringValue));
  }
  async function listLegacy(collection, uid) {
    const result = []; let token = '';
    for (let page = 0; page < 200; page++) {
      const response = await request(`${auth.documentsPath}/${collection}?pageSize=100${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`);
      if (!response.ok) throw new Error('Historical grant records could not be read.');
      const body = await response.json();
      for (const document of body.documents || []) {
        const payload = JSON.parse(document.fields?.payload?.stringValue || 'null');
        if (payload?.uid === uid) result.push(payload);
      }
      token = body.nextPageToken;
      if (!token) return result;
    }
    throw new Error('Historical grant pagination exceeded its limit.');
  }
  async function run(uid, requestId, callback, { recoverExisting = false } = {}) {
    const owner = randomUUID();
    let state;
    for (let attempt = 0; attempt < 6; attempt++) {
      state = await account(uid);
      const current = state?.payload || blankAccount(uid), op = current.operation;
      if (op && op.leaseUntil > Date.now()) throw Object.assign(new Error('Your account update is still being completed. Retry the same request shortly.'), { code: 'BILLING_PENDING' });
      if (op && op.requestId !== requestId && op.intent && !recoverExisting) throw Object.assign(new Error('An earlier account update is being reconciled. Retry shortly.'), { code: 'BILLING_PENDING' });
      const next = { ...current, operation: { ...(op || { id: randomUUID(), requestId, intent: null }), owner, leaseUntil: Date.now() + 240000 } };
      if (await commit([write('natallyCreditAccounts', digest(uid), next, state ? { updateTime: state.updateTime } : { exists: false })])) break;
      if (attempt === 5) throw Object.assign(new Error('Another account update is still running.'), { code: 'BILLING_PENDING' });
    }
    const update = async (change, additions = []) => {
      const observed = await account(uid);
      if (observed?.payload.operation?.owner !== owner) throw Object.assign(new Error('This account operation is being recovered. Retry shortly.'), { code: 'BILLING_PENDING' });
      const next = structuredClone(observed.payload);
      await change(next);
      if (next.operation) next.operation.leaseUntil = Date.now() + 240000;
      validateAccount(next, uid);
      if (!await commit([write('natallyCreditAccounts', digest(uid), next, { updateTime: observed.updateTime }), ...additions])) {
        throw Object.assign(new Error('The account update needs confirmation. Retry the same request.'), { code: 'BILLING_PENDING' });
      }
      return next;
    };
    const context = { read: async () => (await account(uid)).payload, update, write, readRecord: read, list,
      intent: intent => update(value => { value.operation.intent = intent; }),
      clearIntent: () => update(value => { value.operation.intent = null; }),
    };
    try {
      const result = await callback(context);
      await update(value => { value.operation = null; });
      return result;
    } catch (error) {
      // An unresolved external effect keeps its exact intent. It is never reset
      // to idle merely because a fetch timed out or a process stopped.
      try { await update(value => { if (!value.operation.intent) value.operation = null; else value.operation.leaseUntil = 0; }); } catch { /* preserve recovery evidence */ }
      throw error;
    }
  }
  return { account, read, list, listLegacy, run, write, commit };
}
