import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { required, verifyCompletedInventory } = await import('../scripts/release-state.mjs');
const deploy = await import('../scripts/deploy-existing.mjs');

const fixturesRoot = path.join(repo, 'build', 'deploy-existing-tests');
const runTag = new Date().toISOString().replace(/[:.]/g, '-');
const hex64 = bytes => createHash('sha256').update(bytes).digest('hex');
const UUID = '0f1e2d3c-4b5a-6978-8796-a5b4c3d2e1f0';
const VERSION = '9.90.00001';
const PREFIX = `natally-ai-studio-v${VERSION}`;

function makeCentralDir(entries) {
  const records = [];
  let offset = 0;
  for (const { name, attrs = 0 } of entries) {
    const nameBuf = Buffer.from(name);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(20, 4);
    record.writeUInt16LE(nameBuf.length, 28);
    record.writeUInt32LE(attrs, 38);
    records.push(Buffer.concat([record, nameBuf]));
    offset += 46 + nameBuf.length;
  }
  const central = Buffer.concat(records);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(central.length, 12);
  return Buffer.concat([central, eocd]);
}

function makeWebPackage(dir, { pwaInvocationId = UUID, withSiteVersionJson = false, sitePwaVersion = VERSION } = {}) {
  const packageDir = path.join(dir, 'webpackage');
  mkdirSync(path.join(packageDir, 'site'), { recursive: true });
  writeFileSync(path.join(packageDir, 'site/index.html'), `<html>v${VERSION}</html>\n`);
  writeFileSync(path.join(packageDir, 'site/marketing.html'), `<html>marketing v${VERSION}</html>\n`);
  writeFileSync(path.join(packageDir, 'site/sw.js'), '//sw\n');
  writeFileSync(path.join(packageDir, 'site/CNAME'), 'natally.surge.sh\n');
  writeFileSync(path.join(packageDir, 'site/pwa-build.json'), JSON.stringify({ version: sitePwaVersion, invocationId: pwaInvocationId }));
  if (withSiteVersionJson) writeFileSync(path.join(packageDir, 'site/version.json'), JSON.stringify({ version: VERSION, invocationId: UUID }));
  writeFileSync(path.join(packageDir, 'version.json'), JSON.stringify({ version: VERSION, major: 9, minor: 90, build: 1, versionCode: 90001, stampedAt: new Date().toISOString() }));
  writeFileSync(path.join(packageDir, 'install-web.sh'), '#!/usr/bin/env bash\n');
  const zipPath = path.join(dir, 'dist', `${PREFIX}-webapp.zip`);
  const built = spawnSync('python', ['-m', 'zipfile', '-c', zipPath, 'version.json', 'install-web.sh', 'site'], { cwd: packageDir, encoding: 'utf8' });
  assert.equal(built.status, 0, built.stderr);
  return zipPath;
}

function makeFixture(name, packageOptions = {}) {
  const dir = path.join(fixturesRoot, `${name}-${runTag}`);
  mkdirSync(path.join(dir, 'dist'), { recursive: true });
  mkdirSync(path.join(dir, 'dist-web'), { recursive: true });
  writeFileSync(path.join(dir, 'dist-web/index.html'), 'CANARY-.mutable-dist-web-not-deployed');
  const zipPath = makeWebPackage(dir, packageOptions);
  const zipBytes = readFileSync(zipPath);
  const artifacts = {};
  for (const target of required) {
    if (target === 'web') {
      artifacts[target] = { state: 'verified', path: `dist/${PREFIX}-webapp.zip`, bytes: zipBytes.length, sha256: hex64(zipBytes) };
      continue;
    }
    const name2 = target === 'pwa' ? `${PREFIX}-pwa-build.json` : `${PREFIX}-${target}.bin`;
    const bytes = target === 'pwa' ? Buffer.from(JSON.stringify({ version: VERSION, invocationId: UUID })) : Buffer.from(`artifact-${target}`);
    writeFileSync(path.join(dir, 'dist', name2), bytes);
    artifacts[target] = { state: 'verified', path: `dist/${name2}`, bytes: bytes.length, sha256: hex64(bytes) };
  }
  const sourceInputs = { 'scripts/deploy-existing.mjs': hex64(Buffer.from('deploy-existing')), 'scripts/release-state.mjs': hex64(Buffer.from('release-state')) };
  const sourceFingerprint = createHash('sha256').update(Object.entries(sourceInputs).map(([name, hash]) => `${name}\0${hash}\n`).join('')).digest('hex');
  const inventory = { prefix: PREFIX, major: 9, minor: 90, build: 1, version: VERSION, invocationId: UUID, phase: 'frozen', kind: 'tauri2-test-build', required, artifacts, artifactMatrixComplete: true, sourceInputsMatch: true, missing: [], completedAt: new Date().toISOString(), sourceInputs, sourceFingerprint };
  const inventoryPath = path.join(dir, 'dist', `${PREFIX}-test-build-inventory.json`);
  writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
  return { dir, inventoryPath, inventory, zipPath };
}

test('verifyCompletedInventory accepts the real completed historical inventory', () => {
  const result = verifyCompletedInventory('dist/natally-ai-studio-v1.13.86779-test-build-inventory.json', repo);
  assert.equal(result.inventory.version, '1.13.86779');
  assert.equal(result.selected.inventorySha256, hex64(readFileSync(path.join(repo, 'dist/natally-ai-studio-v1.13.86779-test-build-inventory.json'))));
});

test('verifyCompletedInventory accepts a completed synthetic inventory independently of current source', () => {
  const f = makeFixture('verify-ok');
  const result = verifyCompletedInventory(f.inventoryPath, f.dir);
  assert.equal(result.inventory.invocationId, UUID);
});

test('verifyCompletedInventory rejects incomplete, reduced, damaged and mispathed inventories', () => {
  const f = makeFixture('verify-bad');
  const pristine = readFileSync(f.inventoryPath, 'utf8');
  const load = () => JSON.parse(pristine);
  const save = inv => writeFileSync(f.inventoryPath, JSON.stringify(inv));
  const bad = load(); delete bad.artifacts.pwa; save(bad);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /pwa/);
  const reduced = load(); reduced.required = ['web']; save(reduced);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /matrix/);
  const damaged = load(); writeFileSync(path.join(f.dir, damaged.artifacts.web.path), 'altered'); save(damaged);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /bytes changed/);
  const resized = load(); resized.artifacts.web.bytes += 1; save(resized);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /bytes changed|size changed/);
  const mispathed = load(); mispathed.artifacts.web.path = 'elsewhere/web.zip'; save(mispathed);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /Invalid artifact path/);
  const incomplete = load(); incomplete.artifactMatrixComplete = false; save(incomplete);
  assert.throws(() => verifyCompletedInventory(f.inventoryPath, f.dir), /completed release/);
  const badName = path.join(f.dir, 'dist', 'wrong-name.json');
  writeFileSync(badName, readFileSync(f.inventoryPath));
  assert.throws(() => verifyCompletedInventory(badName, f.dir), /named with its recorded prefix/);
});

test('ZIP member validation confines paths and rejects traversal, absolute, symlink and duplicates', () => {
  const ok = deploy.validateZipMembers(deploy.parseZipCentralDirectory(makeCentralDir([{ name: 'site/index.html' }, { name: 'version.json' }])));
  assert.deepEqual(ok.sort(), ['site/index.html', 'version.json']);
  assert.throws(() => deploy.validateZipMembers([{ name: '../evil.js' }]), /traversal/);
  assert.throws(() => deploy.validateZipMembers([{ name: '/abs.js' }]), /Absolute/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'C:/abs.js' }]), /Absolute/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'link.js', externalAttrs: 0o120777 << 16 }]), /symlink/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'a.js' }, { name: 'a.js' }]), /Duplicate/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/./index.html' }, { name: 'site/index.html' }]), /Duplicate/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'SITE/index.html' }, { name: 'site/index.html' }]), /Duplicate/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/index.html.' }, { name: 'site/index.html' }]), /Duplicate/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/a:b.js' }]), /Invalid ZIP member name/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'bad\0.js' }]), /Invalid ZIP member name/);
  assert.throws(() => deploy.validateZipMembers([{ name: '' }]), /Invalid ZIP member name/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site//x.js' }]), /Invalid ZIP member path/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/.. /x.js' }]), /Invalid ZIP member path/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/.../x.js' }]), /Invalid ZIP member path/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/... ' }]), /Invalid ZIP member path/);
  assert.throws(() => deploy.validateZipMembers([{ name: 'site/index.html/...' }]), /Invalid ZIP member path/);
  assert.doesNotThrow(() => deploy.validateZipMembers([{ name: 'site/./index.html' }]));
  assert.throws(() => deploy.validateArchiveLayout(['version.json']), /site/);
  assert.throws(() => deploy.validateArchiveLayout(['site/index.html']), /version\.json/);
  assert.throws(() => deploy.validateArchiveLayout(['site/index.html', 'version.json', 'install-web.sh', 'stray.txt']), /unexpected root entry: stray\.txt/);
  assert.doesNotThrow(() => deploy.validateArchiveLayout(['site/index.html', 'site/pwa-build.json', 'version.json', 'install-web.sh']));
});

test('prepareStaging extracts the retained ZIP artifact, never mutable dist-web, and re-runs in fresh run directories', () => {
  const f = makeFixture('staging');
  const first = deploy.prepareStaging({ inventoryPath: f.inventoryPath, directory: f.dir, verifyCompletedInventory });
  assert.equal(readFileSync(path.join(first.siteDir, 'index.html'), 'utf8'), `<html>v${VERSION}</html>\n`);
  assert.ok(!existsSync(path.join(first.siteDir, 'CANARY-.mutable-dist-web-not-deployed')));
  assert.ok(!readFileSync(path.join(first.siteDir, 'index.html'), 'utf8').includes('CANARY'));
  assert.equal(first.manifest.filter(entry => !entry.served).map(entry => entry.path).join(','), 'CNAME');
  const second = deploy.prepareStaging({ inventoryPath: f.inventoryPath, directory: f.dir, verifyCompletedInventory });
  assert.notEqual(first.runDir, second.runDir);
  assert.ok(existsSync(first.runDir) && existsSync(second.runDir));
});

test('extracted site/pwa-build.json must match the selected inventory exactly', () => {
  const f = makeFixture('staging-pwa-mismatch', { pwaInvocationId: 'ffffffff-ffff-4fff-8fff-ffffffffffff' });
  const inv = JSON.parse(readFileSync(f.inventoryPath, 'utf8'));
  const zipBytes = readFileSync(f.zipPath);
  inv.artifacts.web.bytes = zipBytes.length;
  inv.artifacts.web.sha256 = hex64(zipBytes);
  writeFileSync(f.inventoryPath, JSON.stringify(inv));
  assert.throws(() => deploy.prepareStaging({ inventoryPath: f.inventoryPath, directory: f.dir, verifyCompletedInventory }), /site\/pwa-build\.json identity/);
});

test('optional site/version.json is validated only when present', () => {
  const ok = makeFixture('staging-site-version-ok', { withSiteVersionJson: true });
  assert.doesNotThrow(() => deploy.prepareStaging({ inventoryPath: ok.inventoryPath, directory: ok.dir, verifyCompletedInventory }));
  const bad = makeFixture('staging-site-version-bad', { withSiteVersionJson: true });
  const inv = JSON.parse(readFileSync(bad.inventoryPath, 'utf8'));
  writeFileSync(path.join(bad.dir, 'webpackage/site/version.json'), JSON.stringify({ version: 'wrong', invocationId: UUID }));
  const zipPath = path.join(bad.dir, 'dist', `${PREFIX}-webapp.zip`);
  const rebuilt = spawnSync('python', ['-m', 'zipfile', '-c', zipPath, 'version.json', 'install-web.sh', 'site'], { cwd: path.join(bad.dir, 'webpackage'), encoding: 'utf8' });
  assert.equal(rebuilt.status, 0, rebuilt.stderr);
  const zipBytes = readFileSync(zipPath);
  inv.artifacts.web.bytes = zipBytes.length;
  inv.artifacts.web.sha256 = hex64(zipBytes);
  writeFileSync(bad.inventoryPath, JSON.stringify(inv));
  assert.throws(() => deploy.prepareStaging({ inventoryPath: bad.inventoryPath, directory: bad.dir, verifyCompletedInventory }), /site\/version\.json identity/);
});

test('preparation failure writes a separate failed report in its named run directory', () => {
  const f = makeFixture('preparation-failure', { pwaInvocationId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' });
  const inv = JSON.parse(readFileSync(f.inventoryPath, 'utf8'));
  const zipBytes = readFileSync(f.zipPath);
  inv.artifacts.web.bytes = zipBytes.length;
  inv.artifacts.web.sha256 = hex64(zipBytes);
  writeFileSync(f.inventoryPath, JSON.stringify(inv));
  assert.throws(() => deploy.prepareStaging({ inventoryPath: f.inventoryPath, directory: f.dir, verifyCompletedInventory }), /site\/pwa-build\.json identity/);
  const parent = deploy.stagingRootFor(inv, f.dir);
  const runDirs = readdirSync(parent);
  assert.equal(runDirs.length, 1);
  const report = JSON.parse(readFileSync(path.join(parent, runDirs[0], 'deployment-report.json'), 'utf8'));
  assert.equal(report.state, 'preparation-failed');
  assert.match(report.error, /site\/pwa-build\.json identity/);
});

test('exactly the two existing hosts are accepted, each once', () => {
  assert.deepEqual(deploy.parseDomains('natally.surge.sh,natally.robin.mba'), ['natally.surge.sh', 'natally.robin.mba']);
  assert.deepEqual(deploy.parseDomains(' natally.robin.mba , natally.surge.sh '), ['natally.robin.mba', 'natally.surge.sh']);
  assert.throws(() => deploy.parseDomains('natally.surge.sh'), /two existing hosts/);
  assert.throws(() => deploy.parseDomains('natally.surge.sh,natally.surge.sh'), /two existing hosts/);
  assert.throws(() => deploy.parseDomains('natally.surge.sh,evil.example.com'), /two existing hosts/);
  assert.throws(() => deploy.parseDomains(''), /two existing hosts/);
});

test('HTTP byte verifier counts every served file plus root, and any mismatch or timeout fails', async () => {
  const indexBytes = Buffer.from('index-bytes');
  const swBytes = Buffer.from('sw-bytes');
  const manifest = [
    { path: 'index.html', sha256: hex64(indexBytes), served: true },
    { path: 'sw.js', sha256: hex64(swBytes), served: true },
    { path: 'CNAME', sha256: hex64(Buffer.from('c')), served: false },
  ];
  const requested = [];
  const fetchOk = async url => {
    requested.push(String(url));
    const body = String(url).includes('sw.js') ? swBytes : indexBytes;
    return { ok: true, status: 200, arrayBuffer: async () => body };
  };
  const good = await deploy.verifyServedFiles({ manifest, host: 'natally.surge.sh', fetchImpl: fetchOk, retries: 1 });
  assert.equal(good.ok, true);
  assert.equal(good.results.length, 3);
  assert.ok(requested.some(url => url.startsWith('https://natally.surge.sh/?cachebust=')));
  assert.ok(requested.every(url => url.includes('cachebust=')));
  const fetchMismatch = async url => ({ ok: true, status: 200, arrayBuffer: async () => Buffer.from('tampered') });
  const bad = await deploy.verifyServedFiles({ manifest, host: 'natally.robin.mba', fetchImpl: fetchMismatch, retries: 1 });
  assert.equal(bad.ok, false);
  assert.equal(bad.failures.length, 3);
  const fetchTimeout = async () => { throw new Error('timeout'); };
  const timedOut = await deploy.verifyServedFiles({ manifest, host: 'natally.surge.sh', fetchImpl: fetchTimeout, retries: 2 });
  assert.equal(timedOut.ok, false);
  assert.ok(timedOut.results.every(result => /2 attempts/.test(result.error ?? '')));
});

function deployEnv() {
  const env = { ...process.env, NATALLY_DEPLOY_COORDINATOR: '1' };
  delete env.SURGE_TOKEN;
  return env;
}

test('Node deploy CLI VerifyOnly (coordinator env) publishes nothing and writes no version/state/artifact bytes', async () => {
  const inventoryPath = 'dist/natally-ai-studio-v1.13.86779-test-build-inventory.json';
  const before = {
    version: readFileSync(path.join(repo, 'version.json')),
    state: existsSync(path.join(repo, 'build/release-state.json')) ? readFileSync(path.join(repo, 'build/release-state.json')) : null,
    inventory: readFileSync(path.join(repo, inventoryPath)),
  };
  const child = spawnSync(process.execPath, ['scripts/deploy-existing.mjs', '--inventory', inventoryPath, '--domains', 'natally.surge.sh,natally.robin.mba', '--verify-only'], { cwd: repo, env: deployEnv(), encoding: 'utf8' });
  assert.equal(child.status, 0, child.stderr);
  const stagingParent = readdirSync(path.join(repo, 'build')).filter(name => name.startsWith('deploy-1.13.86779-')).map(name => path.join(repo, 'build', name))[0];
  const runDir = readdirSync(stagingParent).sort((a, b) => statSync(path.join(stagingParent, b)).mtimeMs - statSync(path.join(stagingParent, a)).mtimeMs)[0];
  const report = JSON.parse(readFileSync(path.join(stagingParent, runDir, 'deployment-report.json'), 'utf8'));
  assert.equal(report.state, 'verify-only-not-published');
  assert.match(report.note, /Not published/);
  assert.ok(/no Surge auth was required|no remote validation/.test(report.note));
  assert.equal(readFileSync(path.join(repo, 'version.json')).equals(before.version), true);
  assert.equal((existsSync(path.join(repo, 'build/release-state.json')) ? readFileSync(path.join(repo, 'build/release-state.json')) : null)?.equals(before.state), true);
  assert.equal(readFileSync(path.join(repo, inventoryPath)).equals(before.inventory), true);
});

test('real PowerShell coordinator VerifyOnly succeeds on the preserved v1.13 inventory and catches a missing Checked function', () => {
  const inventoryPath = 'dist/natally-ai-studio-v1.13.86779-test-build-inventory.json';
  const before = {
    version: readFileSync(path.join(repo, 'version.json')),
    state: existsSync(path.join(repo, 'build/release-state.json')) ? readFileSync(path.join(repo, 'build/release-state.json')) : null,
    inventory: readFileSync(path.join(repo, inventoryPath)),
  };
  const child = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/build-all-platforms.ps1', '-DeployExisting', inventoryPath, '-DeployDomains', 'natally.surge.sh,natally.robin.mba', '-VerifyOnly'], { cwd: repo, encoding: 'utf8' });
  const output = `${child.stdout ?? ''}\n${child.stderr ?? ''}`;
  assert.equal(child.status, 0, output);
  assert.doesNotMatch(output, /is not recognized/);
  assert.match(output, /Completed inventory verified: natally-ai-studio-v1\.13\.86779-test-build-inventory\.json/);
  assert.match(output, /Verify-only complete\. Not published/);
  assert.equal(readFileSync(path.join(repo, 'version.json')).equals(before.version), true);
  assert.equal((existsSync(path.join(repo, 'build/release-state.json')) ? readFileSync(path.join(repo, 'build/release-state.json')) : null)?.equals(before.state), true);
  assert.equal(readFileSync(path.join(repo, inventoryPath)).equals(before.inventory), true);
});

test('CLI routing rejects bad flag combinations and missing arguments before any deployment', () => {
  const f = makeFixture('routing');
  const run = (args, extraEnv = {}) => spawnSync(process.execPath, ['scripts/deploy-existing.mjs', ...args], { cwd: repo, env: { ...deployEnv(), ...extraEnv }, encoding: 'utf8' });
  const missingInventory = run(['--verify-only']);
  assert.notEqual(missingInventory.status, 0);
  assert.match(missingInventory.stderr, /--inventory/);
  const unknown = run(['--inventory', f.inventoryPath, '--domains', 'natally.surge.sh,natally.robin.mba', '--frobnicate']);
  assert.notEqual(unknown.status, 0);
  assert.match(unknown.stderr, /Unknown deploy-existing argument/);
  const badDomains = run(['--inventory', f.inventoryPath, '--domains', 'natally.surge.sh']);
  assert.notEqual(badDomains.status, 0);
  assert.match(badDomains.stderr, /two existing hosts/);
  const outside = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/build-all-platforms.ps1', '-VerifyOnly'], { cwd: repo, encoding: 'utf8' });
  assert.notEqual(outside.status, 0);
  assert.match(outside.stderr ?? outside.stdout, /-VerifyOnly requires -DeployExisting/);
  const combined = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/build-all-platforms.ps1', '-DeployExisting', 'x', '-Major', '2'], { cwd: repo, encoding: 'utf8' });
  assert.notEqual(combined.status, 0);
  assert.match(combined.stderr ?? combined.stdout, /cannot be combined with -Continue or -Major/);
});

test('publish or byte-check failure fails nonzero, attempts both domains, and keeps the report current after each host', async () => {
  const f = makeFixture('publish-failure');
  const observedStates = [];
  const failingSpawn = () => ({ status: 1, stdout: 'surge says no', stderr: 'boom' });
  const latestReport = () => {
    const parent = deploy.stagingRootFor(f.inventory, f.dir);
    const runDir = readdirSync(parent).sort((a, b) => statSync(path.join(parent, b)).mtimeMs - statSync(path.join(parent, a)).mtimeMs)[0];
    return JSON.parse(readFileSync(path.join(parent, runDir, 'deployment-report.json'), 'utf8'));
  };
  const result = await deploy.runDeploy({
    inventoryPath: f.inventoryPath, domains: ['natally.surge.sh', 'natally.robin.mba'], verifyOnly: false,
    directory: f.dir, verifyCompletedInventory, spawn: failingSpawn,
    fetchImpl: async () => {
      observedStates.push(latestReport().state);
      throw new Error('down');
    }, log: () => {},
  });
  assert.equal(result.exitCode, 1);
  assert.equal(result.staging.runDir, result.staging.runDir);
  const report = JSON.parse(readFileSync(result.staging.reportPath, 'utf8'));
  assert.equal(report.state, 'failed');
  assert.equal(report.publish.length, 2);
  assert.equal(report.publish.filter(entry => entry.status === 'failed').length, 2);
  assert.ok(report.http.every(entry => entry.ok === false));
  assert.equal(report.selectedArtifact.webZipSha256, f.inventory.artifacts.web.sha256);
  assert.equal(report.selectedArtifact.sourceFingerprint, f.inventory.sourceFingerprint);
  assert.ok(report.deployToolGitSha && report.deployToolGitSha !== '');
  assert.deepEqual([...new Set(observedStates)], ['publishing', 'failing']);
});
