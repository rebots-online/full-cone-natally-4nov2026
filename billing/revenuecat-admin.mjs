import { mkdtemp, writeFile, readFile, rm, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const COLLECTION = 'natallyBillingProviderLocks';
const fail = code => Object.assign(new Error('RevenueCat account administration is temporarily unavailable. Retry shortly.'), { code });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function profileJson(raw) {
  let profile;
  try { profile = JSON.parse(raw); } catch { throw fail('REVENUECAT_PROFILE_INVALID'); }
  if (!profile || profile.token_type !== 'oauth' || !profile.access_token || !profile.refresh_token) throw fail('REVENUECAT_PROFILE_INVALID');
  return profile;
}

// The official CLI owns OAuth refresh. Its only credential file lives in a
// private runtime temporary directory, never the repository or source archive.
// A distinct Firestore lease serializes refresh across all runtime instances.

// Shared request validation for both admin transports (static key and CLI).
function validateAdminRequest(environment, method, requestPath, body, idempotencyKey) {
  const project = environment.REVENUECAT_PROJECT_ID;
  if (typeof requestPath !== 'string' || !requestPath.startsWith('/')) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  const relative = requestPath.startsWith('/v2/') ? requestPath.slice(3) : requestPath;
  const url = new URL('https://api.revenuecat.com/v2' + relative);
  const customersPath = `/v2/projects/${encodeURIComponent(project || '')}/customers`;
  const creatingCustomer = method === 'POST' && url.pathname === customersPath && !url.search;
  if (!project || url.origin !== 'https://api.revenuecat.com' || url.hash ||
      (!creatingCustomer && (!url.pathname.startsWith(customersPath + '/') || !/^\/v2\/projects\/[^/]+\/customers\/[^/]+\/virtual_currencies(?:\/transactions)?$/.test(url.pathname)))) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  if (idempotencyKey !== undefined && (typeof idempotencyKey !== 'string' || !idempotencyKey || idempotencyKey.length > 255 || /[\x00-\x1f\x7f]/.test(idempotencyKey))) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  if (method === 'GET') {
    if (url.pathname.endsWith('/transactions') || body !== undefined) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  } else if (method === 'POST') {
    if (creatingCustomer) {
      if (!body || Object.keys(body).length !== 1 || typeof body.id !== 'string' || !body.id.trim() || body.id.length > 1500) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
    } else if (!url.pathname.endsWith('/transactions') || typeof idempotencyKey !== 'string' || !idempotencyKey ||
        !body?.adjustments || Object.keys(body.adjustments).length !== 1 || !Number.isSafeInteger(body.adjustments.ROCHE)) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  } else throw fail('REVENUECAT_ADMIN_ARGUMENTS');
  return url;
}

export function createRevenueCatAdmin(environment, { getLedger } = {}) {
  if (typeof environment.REVENUECAT_SECRET_API_KEY === 'string' && environment.REVENUECAT_SECRET_API_KEY) {
    // Static-key transport: the project v2 secret speaks the same validated
    // customer/currency REST surface directly — no CLI profile, no Secret
    // Manager, no GCP metadata server. Host-anywhere path (local, Oracle,
    // Netlify) per the cost-gating ruling; the CLI transport below remains
    // for runtimes provisioned with the rotating profile.
    const staticAdmin = () => {};
    staticAdmin.request = async (method, requestPath, body, { idempotencyKey } = {}) => {
      const url = validateAdminRequest(environment, method, requestPath, body, idempotencyKey);
      const headers = { Authorization: `Bearer ${environment.REVENUECAT_SECRET_API_KEY}`, 'Content-Type': 'application/json' };
      if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
      let response;
      try {
        response = await fetch(url.href, { method, headers, redirect: 'error',
          ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000) });
      } catch { throw fail('REVENUECAT_API_UNCONFIRMED'); }
      let data; try { data = await response.json(); } catch { throw fail('REVENUECAT_API_RESPONSE'); }
      if (!response.ok) throw Object.assign(fail('REVENUECAT_API_FAILED'), { status: response.status });
      return data;
    };
    return staticAdmin;
  }

  async function execute(args, input, directRequest) {
    const project = environment.REVENUECAT_PROJECT_ID;
    const secret = environment.REVENUECAT_CLI_PROFILE_SECRET_RESOURCE;
    if (!project || !/^projects\/[A-Za-z0-9-]+\/secrets\/[A-Za-z0-9_-]+$/.test(secret || '') || typeof getLedger !== 'function') throw fail('REVENUECAT_ADMIN_CONFIGURATION');
    if (!Array.isArray(args) || args.some(value => typeof value !== 'string')) throw fail('REVENUECAT_ADMIN_ARGUMENTS');
    const ledger = await getLedger(), owner = randomUUID();
    const id = createHash('sha256').update('revenuecat-auth:' + project).digest('hex');
    let acquired = false, directory;
    for (let attempt = 0; attempt < 20; attempt++) {
      const observed = await ledger.read(COLLECTION, id);
      if (!observed || observed.payload.leaseUntil <= Date.now()) {
        acquired = await ledger.commit([ledger.write(COLLECTION, id, { owner, leaseUntil: Date.now() + 240000 }, observed ? { updateTime: observed.updateTime } : { exists: false })]);
        if (acquired) break;
      }
      await pause(250);
    }
    if (!acquired) throw fail('REVENUECAT_ADMIN_BUSY');
    try {
      const identity = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
        headers: { 'Metadata-Flavor': 'Google' }, signal: AbortSignal.timeout(12000),
      });
      if (!identity.ok) throw fail('REVENUECAT_ADMIN_IDENTITY');
      const { access_token: token } = await identity.json();
      if (!token) throw fail('REVENUECAT_ADMIN_IDENTITY');
      const url = `https://secretmanager.googleapis.com/v1/${secret}`;
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const latest = await fetch(url + '/versions/latest:access', { headers, signal: AbortSignal.timeout(12000) });
      if (!latest.ok) throw fail('REVENUECAT_PROFILE_READ');
      const body = await latest.json(), raw = Buffer.from(body.payload?.data || '', 'base64').toString('utf8');
      const before = profileJson(raw);
      directory = await mkdtemp(join(tmpdir(), 'natally-rc-'));
      await chmod(directory, 0o700);
      const profilePath = join(directory, 'default.json');
      await writeFile(profilePath, raw, { mode: 0o600 });
      const commandArgs = [...args];
      if (input !== undefined) {
        const inputPath = join(directory, 'input.json');
        await writeFile(inputPath, JSON.stringify(input), { mode: 0o600 });
        commandArgs.push('--file', inputPath);
      }
      commandArgs.push('--profile', 'default', '--project-id', project, '--json', '--no-input', '--no-color');
      const childEnvironment = { ...process.env, RC_CONFIG_DIR: directory, RC_PROFILE: 'default', RC_PROJECT_ID: project };
      // Explicit profile selection must not be shadowed by ambient CLI overrides.
      for (const name of ['RC_API_KEY', 'RC_BASE_URL', 'RC_HEADERS', 'RC_GUIDED', 'REVENUECAT_CLI_PROFILE_JSON']) delete childEnvironment[name];
      let result, commandError;
      try {
        result = await new Promise((resolveCommand, reject) => {
          const child = spawn(environment.REVENUECAT_CLI_EXECUTABLE || '/usr/local/bin/natally-revenuecat', commandArgs, {
            cwd: directory, env: childEnvironment, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
          });
          let output = '', size = 0, aborted = false;
          const timer = setTimeout(() => { aborted = true; child.kill('SIGKILL'); }, 120000);
          child.stdout.on('data', chunk => { size += chunk.length; if (size > 8 * 1024 * 1024) { aborted = true; child.kill('SIGKILL'); } else output += chunk; });
          child.stderr.on('data', () => {});
          child.on('error', () => { clearTimeout(timer); reject(fail('REVENUECAT_CLI_START')); });
          child.on('close', code => { clearTimeout(timer); if (aborted || code !== 0) reject(fail(aborted ? 'REVENUECAT_CLI_TIMEOUT' : 'REVENUECAT_CLI_FAILED')); else resolveCommand(output); });
        });
      } catch (error) { commandError = error; }
      // Persist a refresh even when the requested provider operation failed.
      const refreshed = await readFile(profilePath, 'utf8');
      const after = profileJson(refreshed);
      if (JSON.stringify(after) !== JSON.stringify(before)) {
        const current = await ledger.read(COLLECTION, id);
        if (current?.payload.owner !== owner || current.payload.leaseUntil <= Date.now()) throw fail('REVENUECAT_AUTH_LEASE_LOST');
        const saved = await fetch(url + ':addVersion', { method: 'POST', headers,
          body: JSON.stringify({ payload: { data: Buffer.from(refreshed).toString('base64') } }), signal: AbortSignal.timeout(12000) });
        if (!saved.ok) throw fail('REVENUECAT_PROFILE_PERSIST');
      }
      if (commandError) throw commandError;
      let parsed;
      try { parsed = JSON.parse(result); } catch { throw fail('REVENUECAT_CLI_RESPONSE'); }
      if (parsed?.error) throw fail('REVENUECAT_CLI_FAILED');
      if (directRequest) {
        // The official CLI refreshed OAuth above. That refreshed profile is
        // durably saved before any idempotent currency mutation is dispatched.
        const current = await ledger.read(COLLECTION, id);
        if (current?.payload.owner !== owner || current.payload.leaseUntil <= Date.now()) throw fail('REVENUECAT_AUTH_LEASE_LOST');
        const requestHeaders = { Authorization: `Bearer ${after.access_token}`, 'Content-Type': 'application/json' };
        if (directRequest.idempotencyKey) requestHeaders['Idempotency-Key'] = directRequest.idempotencyKey;
        let response;
        try {
          response = await fetch(directRequest.url, {
            method: directRequest.method, headers: requestHeaders, redirect: 'error',
            ...(directRequest.body === undefined ? {} : { body: JSON.stringify(directRequest.body) }),
            signal: AbortSignal.timeout(12000),
          });
        } catch { throw fail('REVENUECAT_API_UNCONFIRMED'); }
        let data;
        try { data = await response.json(); } catch { throw fail('REVENUECAT_API_RESPONSE'); }
        if (!response.ok) throw Object.assign(fail('REVENUECAT_API_FAILED'), { status: response.status });
        return data;
      }
      return parsed?.data ?? parsed;
    } finally {
      if (directory) {
        const absolute = resolve(directory), temporaryRoot = resolve(tmpdir()) + sep;
        if (absolute.startsWith(temporaryRoot) && absolute.split(sep).at(-1).startsWith('natally-rc-')) await rm(absolute, { recursive: true, force: true });
      }
      try {
        const current = await ledger.read(COLLECTION, id);
        if (current?.payload.owner === owner) await ledger.commit([ledger.write(COLLECTION, id, { owner: null, leaseUntil: 0 }, { updateTime: current.updateTime })]);
      } catch { /* A failed release expires without exposing the profile. */ }
    }
  }
  const command = (args, input) => execute(args, input);
  command.request = (method, requestPath, body, { idempotencyKey } = {}) => {
    const project = environment.REVENUECAT_PROJECT_ID;
    const url = validateAdminRequest(environment, method, requestPath, body, idempotencyKey);
    // Read the configured currency through the official CLI to refresh OAuth.
    // V2 exposes a project list, not GET /projects/{id}; that nonexistent route
    // would abort every balance read before the requested operation ran.
    return execute(['api', 'GET', `/projects/${encodeURIComponent(project)}/virtual_currencies/ROCHE`], undefined, { method, url: url.href, body, idempotencyKey });
  };
  return command;
}
