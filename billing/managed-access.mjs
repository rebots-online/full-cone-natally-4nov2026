import { createKeyCipher } from './key-cipher.mjs';
import { money } from './firebase-ledger.mjs';
import { readCustomerKey } from './revenuecat-customer.mjs';

export const usdMicros = value => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('OpenRouter usage is invalid.');
  return money(Math.ceil(value * 1000000 - 1e-7), 'Provider usage');
};
export function createManagedAccess(environment, wallet) {
  const cipher = createKeyCipher(environment), adminKey = environment.OPENROUTER_ADMIN_KEY;
  if (typeof adminKey !== 'string' || !adminKey) throw new Error('OPENROUTER_ADMIN_KEY is required.');
  async function provider(method, suffix = '', body) {
    const response = await fetch(`https://openrouter.ai/api/v1/keys${suffix}`, {
      method, headers: { Authorization: `Bearer ${adminKey}`, 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Managed reading access could not be confirmed (${response.status}).`);
    const result = await response.json();
    if (!result || typeof result.data !== 'object' || result.data === null) throw new Error('Managed reading access returned invalid data.');
    return result;
  }
  const readKey = async hash => (await provider('GET', `/${encodeURIComponent(hash)}`)).data;
  async function updateKey(context, hash, body) {
    const state = await context.read();
    const intent = { kind: 'key_update', hash, body };
    if (state.operation.intent && JSON.stringify(state.operation.intent) !== JSON.stringify(intent)) throw Object.assign(new Error('A previous key operation requires recovery.'), { code: 'BILLING_PENDING' });
    await context.intent(intent);
    await provider('PATCH', `/${encodeURIComponent(hash)}`, body);
    const checked = await readKey(hash);
    for (const [field, value] of Object.entries(body)) if (checked[field] !== value) throw Object.assign(new Error('The provider key update is awaiting confirmation.'), { code: 'BILLING_PENDING' });
    await context.clearIntent();
    return checked;
  }
  async function recover(context) {
    await wallet.recover(context);
    const state = await context.read(), intent = state.operation.intent;
    if (!intent) return;
    if (intent.kind === 'key_update') {
      const checked = await readKey(intent.hash);
      if (!Object.entries(intent.body).every(([name, value]) => checked[name] === value)) {
        await provider('PATCH', `/${encodeURIComponent(intent.hash)}`, intent.body);
        const after = await readKey(intent.hash);
        if (!Object.entries(intent.body).every(([name, value]) => after[name] === value)) throw Object.assign(new Error('Managed key recovery is still pending.'), { code: 'BILLING_PENDING' });
      }
      await context.clearIntent(); return;
    }
    if (intent.kind === 'key_create') {
      let offset = 0, found = false;
      for (let page = 0; page < 100; page++) {
        const result = await provider('GET', `?include_disabled=true&offset=${offset}`);
        if (!Array.isArray(result.data)) throw new Error('Managed-key reconciliation list is invalid.');
        for (const key of result.data.filter(key => key.name === intent.name)) {
          found = true;
          await provider('PATCH', `/${encodeURIComponent(key.hash)}`, { disabled: true });
          if ((await readKey(key.hash)).disabled !== true) throw new Error('An unclaimed reading key could not be retired.');
        }
        if (result.data.length < 100) break;
        offset += result.data.length;
        if (page === 99) throw new Error('Managed-key reconciliation exceeded its page limit.');
      }
      if (!found && Date.parse(intent.expiresAt) > Date.now()) throw Object.assign(new Error('Reading key creation is still being reconciled. Retry this request shortly.'), { code: 'BILLING_PENDING' });
      await context.clearIntent(); return;
    }
    throw Object.assign(new Error('This account operation still needs reconciliation.'), { code: 'BILLING_PENDING' });
  }
  async function checkpointUsage(context) {
    let state = await context.read();
    for (const key of state.keys) {
      const actual = await readKey(key.hash), usage = usdMicros(actual.usage);
      await context.update(account => {
        const stored = account.keys.find(value => value.hash === key.hash);
        const delta = Math.max(0, usage - stored.usageAccountedUsdMicros);
        account.spentUsdMicros = money(account.spentUsdMicros + delta);
        stored.usageAccountedUsdMicros = Math.max(usage, stored.usageAccountedUsdMicros);
      });
    }
    return context.read();
  }
  async function migrate(context) {
    let state = await context.read();
    if (state.schemaVersion === 3 && !state.migrationPending) return;
    // Old local amounts remain provenance only. Retire their spending authority
    // and begin new usage checkpoints without granting or charging history.
    for (const key of state.keys) if (!(await readKey(key.hash)).disabled) await updateKey(context, key.hash, { disabled: true });
    state = await checkpointUsage(context);
    await context.update(account => {
      const snapshot = structuredClone(account); delete snapshot.operation;
      account.legacySnapshot = snapshot;
      account.schemaVersion = 3;
      account.usageChargedUsdMicros = account.spentUsdMicros;
      for (const field of ['grantedUsdMicros', 'adjustmentUsdMicros', 'revokedUsdMicros']) delete account[field];
      account.keys.forEach(key => { key.retired = true; }); account.activeKeyHash = null; account.migrationPending = false;
    });
  }
  async function ensure(context, uid, { forceFresh = false } = {}) {
    await recover(context);
    await migrate(context);
    let state = await checkpointUsage(context);
    let key = state.keys.find(item => item.hash === state.activeKeyHash), actual = key ? await readKey(key.hash) : null;
    if (key && (forceFresh || actual.disabled || Date.parse(key.expiresAt) < Date.now() + 60000)) {
      if (!actual.disabled) await updateKey(context, key.hash, { disabled: true });
      await context.update(account => { account.keys.find(item => item.hash === key.hash).retired = true; account.activeKeyHash = null; });
      state = await checkpointUsage(context); key = null; actual = null;
    }
    let financial = await wallet.reconcileUsage(context);
    const remaining = financial.availableUsdMicros;
    if (remaining === 0) {
      if (key && !actual.disabled) await updateKey(context, key.hash, { disabled: true });
      return envelope(state, null, financial);
    }
    if (!key) {
      const expiresAt = new Date(Date.now() + 3600000).toISOString();
      const name = `Natally ${uid} ${state.operation.id}`;
      await context.intent({ kind: 'key_create', name, expiresAt });
      const result = await provider('POST', '', { name, limit: 0, limit_reset: null, expires_at: expiresAt });
      if (typeof result.key !== 'string' || !result.key || typeof result.data.hash !== 'string' || !result.data.hash) throw Object.assign(new Error('Reading key creation is pending confirmation.'), { code: 'BILLING_PENDING' });
      key = { hash: result.data.hash, encrypted: cipher.encrypt(uid, result.data.hash, result.key), expiresAt, usageAccountedUsdMicros: 0, retired: false, generation: state.keyGeneration + 1 };
      state = await context.update(account => { account.keys.push(key); account.activeKeyHash = key.hash; account.keyGeneration = key.generation; account.operation.intent = null; });
      actual = result.data;
    }
    state = await checkpointUsage(context);
    financial = await wallet.reconcileUsage(context);
    key = state.keys.find(item => item.hash === key.hash);
    const limit = money(key.usageAccountedUsdMicros + financial.availableUsdMicros) / 1000000;
    actual = await updateKey(context, key.hash, { limit, limit_reset: null });
    if (actual.disabled || !Number.isFinite(Date.parse(actual.expires_at)) || Date.parse(actual.expires_at) <= Date.now() || usdMicros(actual.usage) >= usdMicros(actual.limit)) throw new Error('The reading key is not yet funded and active.');
    return envelope(await context.read(), { key, actual, plaintext: cipher.decrypt(uid, key.hash, key.encrypted) }, financial);
  }
  function envelope(state, ready, financial) {
    const base = { accountUid: state.uid, expiresAt: new Date(Date.now() + 120000).toISOString(), state: ready ? 'ready' : 'unfunded',
      message: ready ? 'Your balance is available.' : 'Add credits to continue.', provider: 'openrouter', source: 'managed',
      currency: 'ROCHE', creditBalance: financial.balance, balanceSource: 'revenuecat',
      availableUsdMicros: financial.availableUsdMicros, spentUsdMicros: state.spentUsdMicros, redemptionReceipt: state.redemptionReceipt };
    return ready ? { ...base, apiKey: ready.plaintext, hash: ready.key.hash, keyGeneration: ready.key.generation, accessExpiresAt: ready.key.expiresAt,
      limitUsd: ready.actual.limit, usageUsd: ready.actual.usage } : base;
  }
  async function logout(context, expectedHash) {
    await recover(context);
    const state = await context.read();
    if (state.activeKeyHash !== expectedHash) return { deactivated: false };
    await updateKey(context, expectedHash, { disabled: true });
    await checkpointUsage(context);
    if ((await context.read()).schemaVersion === 3) await wallet.reconcileUsage(context);
    await context.update(account => { account.keys.find(key => key.hash === expectedHash).retired = true; account.activeKeyHash = null; });
    return { deactivated: true };
  }
  async function retireActive(context) {
    await recover(context);
    await migrate(context);
    let state = await context.read();
    if (state.activeKeyHash) await logout(context, state.activeKeyHash);
    await checkpointUsage(context);
    await wallet.reconcileUsage(context);
    return context.read();
  }
  async function legacyKeys(uid) {
    const values = new Map(); let offset = 0;
    for (let page = 0; page < 200; page++) {
      const result = await provider('GET', `?include_disabled=true&offset=${offset}`);
      if (!Array.isArray(result.data)) throw new Error('Historical provider keys could not be read.');
      for (const key of result.data) if (key.name === `Natally ${uid}` || key.name?.startsWith(`Natally ${uid} `)) values.set(key.hash, key);
      if (result.data.length < 100) break;
      offset += result.data.length;
      if (page === 199) throw new Error('Historical provider keys exceeded the pagination limit.');
    }
    if (environment.REVENUECAT_SECRET_API_KEY && environment.REVENUECAT_PROJECT_ID) {
      let association;
      try { association = await readCustomerKey(uid, { apiKey: environment.REVENUECAT_SECRET_API_KEY, projectId: environment.REVENUECAT_PROJECT_ID }); }
      catch (error) { if (error.status !== 404) throw error; }
      if (association && !values.has(association.hash)) values.set(association.hash, await readKey(association.hash));
    }
    return [...values.values()].map(key => ({ hash: key.hash, encrypted: null, expiresAt: key.expires_at, usageAccountedUsdMicros: usdMicros(key.usage), retired: false, generation: 0 }));
  }
  return { ensure, recover, checkpointUsage, logout, envelope, retireActive, legacyKeys };
}
