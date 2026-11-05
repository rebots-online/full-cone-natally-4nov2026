#!/usr/bin/env node
// Completed-artifact deployment helper (KStore rev8). Runs only under the
// build_all.sh coordinator (Linux) or its ps1 half (Windows); imported functions stay unit-testable.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ALLOWED_DOMAINS = ['natally.surge.sh', 'natally.robin.mba'];
const EXPECTED_SERVED = ['index.html', 'marketing.html', 'pwa-build.json', 'sw.js'];
const SERVED_VERIFICATION_EXCLUDES = ['CNAME'];
const HEX64 = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);

export function parseDomains(input) {
  const list = String(input ?? '').split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
  if (list.length !== ALLOWED_DOMAINS.length || [...list].sort().join(',') !== [...ALLOWED_DOMAINS].sort().join(',') || new Set(list).size !== list.length) {
    throw Error(`Exactly the two existing hosts must be given once: ${ALLOWED_DOMAINS.join(',')} (got "${input}")`);
  }
  return list;
}

// Minimal ZIP central-directory reader; extraction itself is delegated to
// Python's standard zipfile after members are validated here.
export function parseZipCentralDirectory(buffer) {
  const eocd = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw Error('Not a ZIP archive (no end-of-central-directory).');
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = [];
  for (let i = 0; i < count; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw Error('Corrupt ZIP central directory.');
    const externalAttrs = buffer.readUInt32LE(offset + 38);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    entries.push({ name: buffer.toString('utf8', offset + 46, offset + 46 + nameLength), externalAttrs });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

export function validateZipMembers(entries) {
  const seen = new Set();
  for (const { name, externalAttrs } of entries) {
    const normalized = name.replace(/\\/g, '/');
    if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) throw Error(`Absolute ZIP member path rejected: ${name}`);
    if (normalized.split('/').includes('..')) throw Error(`ZIP traversal member rejected: ${name}`);
    if (((externalAttrs >>> 16) & 0o170000) === 0o120000) throw Error(`ZIP symlink member rejected: ${name}`);
    if (!normalized || !name || name.includes('\0') || normalized.includes(':')) throw Error(`Invalid ZIP member name rejected: ${JSON.stringify(name)}`);
    const destination = zipDestination(normalized);
    if (seen.has(destination)) throw Error(`Duplicate ZIP member destination: ${name}`);
    seen.add(destination);
  }
  return [...seen];
}

function zipDestination(normalized) {
  const segments = normalized.split('/').filter(segment => segment !== '.');
  if (segments[segments.length - 1] === '') segments.pop();
  if (segments.some(segment => segment === '')) throw Error(`Invalid ZIP member path rejected: ${normalized}`);
  const mapped = segments.map(segment => segment.replace(/[. ]+$/, '').toLowerCase());
  if (mapped.some(segment => segment === '')) throw Error(`Invalid ZIP member path rejected: ${normalized}`);
  const destination = mapped.join('/');
  if (!destination) throw Error(`Invalid ZIP member path rejected: ${normalized}`);
  return destination;
}

export function validateArchiveLayout(memberNames) {
  const rootAllowed = new Set(['version.json', 'install-web.sh']);
  for (const name of memberNames) {
    if (!name.startsWith('site/') && name !== 'site' && !rootAllowed.has(name)) throw Error(`Web archive contains an unexpected root entry: ${name}`);
  }
  for (const required of ['site/', 'version.json', 'install-web.sh']) {
    if (!memberNames.some(name => required === 'site/' ? name.startsWith('site/') : name === required)) {
      throw Error(`Web archive is missing expected ${required}`);
    }
  }
}

export function stagingRootFor(inventory, directory = root) {
  return path.join(directory, 'build', `deploy-${inventory.version}-${inventory.invocationId}`);
}

export function createRunDirectory(inventory, directory = root) {
  const parent = stagingRootFor(inventory, directory);
  mkdirSync(parent, { recursive: true });
  let runDir;
  do {
    runDir = path.join(parent, `run-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`);
  } while (existsSync(runDir));
  mkdirSync(runDir, { recursive: true });
  return runDir;
}

export function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }

function listFiles(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, base, out);
    else out.push({ path: path.relative(base, full).replace(/\\/g, '/'), bytes: statSync(full).size, sha256: sha256(readFileSync(full)), served: !SERVED_VERIFICATION_EXCLUDES.includes(entry.name) });
  }
  return out;
}

export function buildSiteManifest(siteDir) {
  const manifest = listFiles(siteDir, siteDir);
  for (const expected of EXPECTED_SERVED) {
    if (!manifest.some(entry => entry.path === expected)) throw Error(`Deployed site is missing expected served file: ${expected}`);
  }
  return manifest;
}

export function verifyReleaseIdentity({ inventory, versionJson, siteVersionJson, pwaBuild }) {
  if (!versionJson || typeof versionJson !== 'object') throw Error('Web archive is missing the root version.json.');
  if (versionJson.version !== inventory.version) {
    throw Error(`version.json identity (version ${JSON.stringify(versionJson.version)}) does not match the selected inventory (${inventory.version}).`);
  }
  if (versionJson.invocationId !== undefined && versionJson.invocationId !== inventory.invocationId) {
    throw Error(`version.json identity (invocationId ${JSON.stringify(versionJson.invocationId)}) does not match the selected inventory (${inventory.invocationId}).`);
  }
  if (siteVersionJson) {
    if (siteVersionJson.version !== inventory.version || (siteVersionJson.invocationId !== undefined && siteVersionJson.invocationId !== inventory.invocationId)) {
      throw Error(`site/version.json identity (${siteVersionJson.version}/${siteVersionJson.invocationId}) does not match the selected inventory (${inventory.version}/${inventory.invocationId}).`);
    }
  }
  if (!pwaBuild || typeof pwaBuild !== 'object') throw Error('Web archive is missing the extracted site/pwa-build.json.');
  if (pwaBuild.version !== inventory.version || pwaBuild.invocationId !== inventory.invocationId) {
    throw Error(`site/pwa-build.json identity (${pwaBuild.version}/${pwaBuild.invocationId}) does not match the selected inventory (${inventory.version}/${inventory.invocationId}).`);
  }
}

export function redact(text, secrets = []) {
  let out = String(text ?? '');
  for (const secret of secrets) if (secret) out = out.split(secret).join('<redacted>');
  return out;
}

export function resolveNpmCli(env = process.env) {
  if (env.npm_execpath && existsSync(env.npm_execpath)) return env.npm_execpath;
  const candidate = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (existsSync(candidate)) return candidate;
  throw Error('Could not resolve the installed npm CLI (npm_execpath or Node-adjacent npm-cli.js).');
}

export function publishToSurge({ siteDir, domain, env = process.env, spawn = spawnSync }) {
  const npmCli = resolveNpmCli(env);
  const result = spawn(process.execPath, [npmCli, 'exec', '--offline', '--yes', '--package=surge', '--', 'surge', siteDir, domain], {
    encoding: 'utf8', timeout: 300000, maxBuffer: 32 * 1024 * 1024, env: { ...env },
  });
  const output = redact(`${result.stdout ?? ''}\n${result.stderr ?? ''}`, [env.SURGE_TOKEN]);
  if (result.status !== 0) throw Error(`Surge publish failed for ${domain} (exit ${result.status ?? 'signal'}):\n${output}`);
  return output;
}

export async function fetchOne(url, { fetchImpl = fetch, timeoutMs = 30000, retries = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchImpl(url, { headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      return { status: response.status, bytes: Buffer.from(await response.arrayBuffer()), attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 250 * attempt));
    }
  }
  throw Error(`Fetch failed after ${retries} attempts for ${url}: ${lastError?.message}`);
}

export function servedUrl(host, filePath, cacheBust) {
  const segments = filePath.split('/').map(encodeURIComponent).join('/');
  return `https://${host}/${segments === '' ? '' : segments}?cachebust=${cacheBust}`;
}

export async function verifyServedFiles({ manifest, host, fetchImpl = fetch, timeoutMs = 30000, retries = 3, concurrency = 6 } = {}) {
  const cacheBust = Date.now().toString(36);
  const byPath = Object.fromEntries(manifest.map(entry => [entry.path, entry]));
  const jobs = manifest.filter(entry => entry.served).map(entry => ({ entry, url: servedUrl(host, entry.path, cacheBust) }));
  const index = byPath['index.html'];
  if (index) jobs.push({ entry: { path: '', sha256: index.sha256 }, url: servedUrl(host, '', cacheBust) });
  const results = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const fetched = await fetchOne(job.url, { fetchImpl, timeoutMs, retries });
        const match = sha256(fetched.bytes) === job.entry.sha256;
        results.push({ host, path: job.entry.path || '/', url: job.url, status: fetched.status, sha256: sha256(fetched.bytes), attempts: fetched.attempts, match });
      } catch (error) {
        results.push({ host, path: job.entry.path || '/', url: job.url, error: error.message, match: false });
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length || 1) }, worker));
  const failures = results.filter(result => !result.match);
  return { host, results, ok: failures.length === 0, failures };
}

function extractZip(zipPath, destination) {
  const result = spawnSync('python', ['-m', 'zipfile', '-e', zipPath, destination], { encoding: 'utf8' });
  if (result.status !== 0) throw Error(`ZIP extraction failed: ${result.stderr ?? result.stdout}`);
}

export function prepareStaging({ inventoryPath, directory = root, verifyCompletedInventory }) {
  const { inventory, selected } = verifyCompletedInventory(inventoryPath, directory);
  const runDir = createRunDirectory(inventory, directory);
  try {
    const webZip = path.join(directory, inventory.artifacts.web.path);
    const entries = validateZipMembers(parseZipCentralDirectory(readFileSync(webZip)));
    validateArchiveLayout(entries);
    extractZip(webZip, path.join(runDir, 'package'));
    const packageDir = path.join(runDir, 'package');
    const readJsonIfExists = file => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined);
    verifyReleaseIdentity({
      inventory,
      versionJson: readJsonIfExists(path.join(packageDir, 'version.json')),
      siteVersionJson: readJsonIfExists(path.join(packageDir, 'site', 'version.json')),
      pwaBuild: readJsonIfExists(path.join(packageDir, 'site', 'pwa-build.json')),
    });
    const siteDir = path.join(packageDir, 'site');
    const manifest = buildSiteManifest(siteDir);
    const reportPath = path.join(runDir, 'deployment-report.json');
    writeFileSync(path.join(runDir, 'local-manifest.json'), JSON.stringify({ selected: { ...selected, sourceFingerprint: inventory.sourceFingerprint }, version: inventory.version, invocationId: inventory.invocationId, webZip: inventory.artifacts.web.path, manifest }, null, 2) + '\n');
    return { inventory, selected, runDir, siteDir, manifest, reportPath };
  } catch (error) {
    writeFileSync(path.join(runDir, 'deployment-report.json'), JSON.stringify({ state: 'preparation-failed', selectedArtifact: { inventory: path.resolve(directory, inventoryPath), version: inventory.version, invocationId: inventory.invocationId }, error: error.message }, null, 2) + '\n');
    throw error;
  }
}

function deployToolGitSha() {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim(); }
  catch { return 'unknown'; }
}

function writeReport(reportPath, report) {
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { inventoryPath: undefined, domains: undefined, verifyOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--inventory') args.inventoryPath = argv[++i];
    else if (flag === '--domains') args.domains = argv[++i];
    else if (flag === '--verify-only') args.verifyOnly = true;
    else if (flag === '--web-first') args.webFirst = true;
    else throw Error(`Unknown deploy-existing argument: ${flag}`);
  }
  if (!args.inventoryPath) throw Error('--inventory <path-to-test-build-inventory.json> is required.');
  if (!args.domains) throw Error('--domains "natally.surge.sh,natally.robin.mba" (or SURGE_DOMAINS) is required; no product-domain fallback.');
  args.domains = parseDomains(args.domains);
  return args;
}

export async function runDeploy({ inventoryPath, domains, verifyOnly, webFirst = false, directory = root, verifyCompletedInventory, fetchImpl, spawn = spawnSync, log = console.log }) {
  const staging = prepareStaging({ inventoryPath, directory, verifyCompletedInventory });
  const baseReport = {
    scope: webFirst ? 'web' : 'complete-matrix',
    artifactMatrixComplete: staging.inventory.artifactMatrixComplete,
    pendingTargets: staging.inventory.required.filter(target => staging.inventory.artifacts[target]?.state === 'pending'),
    state: verifyOnly ? 'verify-only-not-published' : 'publishing',
    note: verifyOnly ? 'Not published; no remote validation was performed and no Surge auth was required.' : undefined,
    selectedArtifact: {
      inventory: path.resolve(directory, inventoryPath),
      inventorySha256: staging.selected.inventorySha256,
      webZip: staging.inventory.artifacts.web.path,
      webZipSha256: staging.inventory.artifacts.web.sha256,
      sourceFingerprint: staging.inventory.sourceFingerprint,
      version: staging.inventory.version,
      invocationId: staging.inventory.invocationId,
    },
    deployToolGitSha: deployToolGitSha(),
    domains,
  };
  if (verifyOnly) {
    writeReport(staging.reportPath, { ...baseReport, published: false, http: null });
    log(`Verify-only complete. Not published, no remote validation. Report: ${staging.reportPath}`);
    return { ...baseReport, staging, exitCode: 0 };
  }
  const publish = [];
  const http = [];
  let failure = null;
  writeReport(staging.reportPath, { ...baseReport, state: 'publishing', published: false, publish, http });
  for (const domain of domains) {
    try {
      const output = publishToSurge({ siteDir: staging.siteDir, domain, spawn });
      publish.push({ domain, status: 'published', output });
      log(`Published to ${domain}`);
    } catch (error) {
      publish.push({ domain, status: 'failed', error: redact(error.message, [process.env.SURGE_TOKEN]) });
      failure ??= `Publish to ${domain} failed`;
    }
    try {
      const verification = await verifyServedFiles({ manifest: staging.manifest, host: domain, fetchImpl });
      http.push(verification);
      if (!verification.ok && !failure) failure = `Served-byte verification failed for ${domain}`;
    } catch (error) {
      http.push({ host: domain, ok: false, failures: [{ error: error.message }], results: [] });
      failure ??= `Served-byte verification failed for ${domain}`;
    }
    writeReport(staging.reportPath, { ...baseReport, state: failure ? 'failing' : 'publishing', published: false, publish, http, errors: failure ? [failure] : [] });
  }
  const report = { ...baseReport, state: failure ? 'failed' : 'published', published: !failure, publish, http, errors: failure ? [failure] : [] };
  writeReport(staging.reportPath, report);
  log(`${failure ? 'Deployment FAILED' : 'Deployment complete'}. Report: ${staging.reportPath}`);
  return { ...baseReport, staging, failure, exitCode: failure ? 1 : 0 };
}

async function main() {
  if (process.env.NATALLY_DEPLOY_COORDINATOR !== '1') {
    throw Error('deploy-existing.mjs must run through build_all.sh (bash build_all.sh --deploy-existing <inventory>), which sets the coordinator context on either host.');
  }
  const args = parseArgs();
  const { verifyCompletedInventory, verifyWebInventory } = await import('./release-state.mjs');
  const result = await runDeploy({ ...args, verifyCompletedInventory: args.webFirst ? verifyWebInventory : verifyCompletedInventory });
  console.log(`Staging: ${result.staging.runDir}`);
  process.exitCode = result.exitCode;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
