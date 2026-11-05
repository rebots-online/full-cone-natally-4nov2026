import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const required = ['windows-exe', 'nsis', 'msi', 'appimage', 'deb', 'rpm', 'apk', 'aab', 'android-symbols', 'web', 'web-installer', 'pwa'];
const statePath = path.join(root, 'build/release-state.json');
const readJson = file => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (file, value) => { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function nextStamp(previous, now = new Date()) {
  const { major, minor } = previous;
  if (!Number.isInteger(major) || !Number.isInteger(minor) || major < 1 || minor < 0) throw Error(`Invalid canonical version: integer MAJOR >= 1 is required, got major=${JSON.stringify(major)}. Stamping from major 0 is not allowed; choose a new MAJOR >= 1 in version.json.`);
  if (minor >= 99999) throw Error('Operator must choose a new MAJOR before MINOR reaches 100000');
  const build = Math.floor(now.getTime() / 60000) % 100000;
  return { major, minor: minor + 1, build, version: `${major}.${minor + 1}.${String(build).padStart(5, '0')}`, semverVersion: `${major}.${minor + 1}.${build}`, versionCode: major * 100000 + minor + 1, stampedAt: now.toISOString() };
}

export function validateBuildContext(s, invocationId, inputHash) {
  if (!invocationId || invocationId !== s.invocationId) throw Error('Production builds require the active complete-matrix invocation. Run npm run build:all.');
  if (s.phase !== 'frozen') throw Error('The complete release source must be frozen before compilation.');
  if (!Number.isInteger(s.major) || s.major < 1) throw Error(`Release stamp has invalid major version (${JSON.stringify(s.major)}); integer MAJOR >= 1 is required. Start a new stamp with a valid version.json.`);
  if (!s.sourceFingerprint || s.sourceFingerprint !== inputHash) throw Error('Release source inputs changed. Start a new complete invocation.');
  return s;
}

export function releaseBuildInfo() {
  if (!process.env.NATALLY_RELEASE_ID) throw Error('Production builds require the active complete-matrix invocation. Run npm run build:all.');
  const s = state(); assertFrozen(s);
  return validateBuildContext(s, process.env.NATALLY_RELEASE_ID, fingerprint());
}

export function matrixStatus(targets, artifacts) {
  const missing = targets.filter(x => artifacts[x]?.state !== 'verified');
  return { complete: missing.length === 0, missing };
}

export function msiVersionFor({ major, minor, build }) {
  if (major > 255) throw Error('MSI requires operator MAJOR at most 255');
  return `${major}.${Math.floor(minor / 65536)}.${minor % 65536}.${build % 65536}`;
}

function sourceInputs() {
  const names = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, maxBuffer: 16 * 1024 * 1024 }).toString().split('\0');
  const inputs = [...new Set(names)].filter(name => /^(src\/|server\/|netlify\/|public\/|scripts\/|src-tauri\/|package(?:-lock)?\.json$|vite\.config\.ts$|tsconfig\.json$|server\.ts$|firebase-applet-config\.json$|netlify\.toml$|\.gitignore$|index\.html$|marketing\.html$|^auth\/|version\.(?:json|txt)$)/.test(name))
    .filter(name => !/(^|\/)(target|build|\.gradle|jniLibs)(\/)/.test(name))
    .filter(name => !name.startsWith('src-tauri/gen/android/app/src/main/assets/'))
    .filter(name => !name.endsWith('/tauri.properties') && existsSync(path.join(root, name))).sort();
  for (const env of ['.env', '.env.local', '.env.production', '.env.production.local']) if (existsSync(path.join(root, env))) inputs.push(env);
  return Object.fromEntries(inputs.map(name => [name, sha(readFileSync(path.join(root, name)))]));
}
function fingerprint(inputs = sourceInputs()) { return sha(Object.entries(inputs).map(([name, hash]) => `${name}\0${hash}\n`).join('')); }

function state() { return readJson(statePath); }
export function verifyRetainedArtifacts(s, directory = root) {
  if (JSON.stringify(s.required) !== JSON.stringify(required)) throw Error('The complete artifact matrix cannot be reduced.');
  for (const [target, a] of Object.entries(s.artifacts)) {
    if (a.state !== 'verified') continue;
    if (!a.path?.startsWith('dist/') || path.resolve(directory, a.path) !== path.join(path.resolve(directory), 'dist', path.basename(a.path))) throw Error(`Invalid artifact path: ${target}`);
    if (sha(readFileSync(path.join(directory, a.path))) !== a.sha256) throw Error(`Staged bytes changed: ${target}`);
  }
}
function persist(s) {
  writeJson(statePath, s);
  writeJson(path.join(root, 'dist', `${s.prefix}-test-build-inventory.json`), s);
}
function assertFrozen(s) {
  if (s.phase !== 'frozen' || readJson(path.join(root, 'version.json')).version !== s.version) throw Error('Release inputs changed or are not frozen. Start a new full matrix invocation; do not reuse this stamp.');
  if (!Number.isInteger(s.major) || s.major < 1) throw Error(`Frozen release has invalid major version (${JSON.stringify(s.major)}); integer MAJOR >= 1 is required. Start a new full matrix invocation with a valid version.json; this stamp cannot continue.`);
  const current = sourceInputs();
  if (fingerprint(current) !== s.sourceFingerprint) {
    const changed = [...new Set([...Object.keys(current), ...Object.keys(s.sourceInputs || {})])].filter(name => current[name] !== s.sourceInputs?.[name]);
    throw Error(`Release source changed: ${changed.slice(0, 8).join(', ')}. Start a new complete invocation.`);
  }
}

function stamp() {
  const s = nextStamp(readJson(path.join(root, 'version.json')));
  // Persist the counter before any preflight or compilation can fail.
  writeJson(path.join(root, 'version.json'), s);
  writeFileSync(path.join(root, 'version.txt'), s.version + '\n');
  const packagePath = path.join(root, 'package.json');
  const pkg = readJson(packagePath); pkg.version = s.semverVersion; writeJson(packagePath, pkg);
  const lockPath = path.join(root, 'package-lock.json');
  const lock = readJson(lockPath); lock.version = s.semverVersion; if (lock.packages?.['']) lock.packages[''].version = s.semverVersion; writeJson(lockPath, lock);
  const cargoPath = path.join(root, 'src-tauri/Cargo.toml');
  writeFileSync(cargoPath, readFileSync(cargoPath, 'utf8').replace(/\r\n/g, '\n').replace(/^version = "[^"]+"/m, `version = "${s.semverVersion}"`));
  const cargoLock = path.join(root, 'src-tauri/Cargo.lock');
  if (existsSync(cargoLock)) writeFileSync(cargoLock, readFileSync(cargoLock, 'utf8').replace(/\r\n/g, '\n').replace(/(name = "natally-ai-studio"\nversion = ")[^"]+/, `$1${s.semverVersion}`));
  const configPath = path.join(root, 'src-tauri/tauri.conf.json');
  const config = readJson(configPath); config.version = s.semverVersion;
  config.app.windows[0].title = `Natally v${s.version}`;
  config.bundle.android.versionCode = s.versionCode;
  // MSI has limited numeric fields; preserve the full version in display/title,
  // filenames and inventory while using this reversible MINOR mapping for MSI.
  s.msiVersion = msiVersionFor(s);
  config.bundle.windows.wix.version = s.msiVersion;
  writeJson(configPath, config);
  s.prefix = `natally-ai-studio-v${s.version}`;
  s.kind = 'tauri2-test-build'; s.productionRelease = false;
  s.gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root }).toString().trim();
  s.invocationId = randomUUID();
  s.phase = 'preparing'; s.required = required;
  s.artifacts = Object.fromEntries(required.map(x => [x, { state: 'pending' }]));
  persist(s);
  writeFileSync(path.join(root, 'dist', `${s.prefix}-NOT-A-RELEASE.md`), `# Tauri 2 test build v${s.version}\n\nNot a production release. Windows packages are unsigned; Android uses a test certificate. No store submission, production billing, provider funding or device acceptance is asserted.\n`);
  console.log(JSON.stringify(s));
}

function stage(target, input, qualifier, evidence) {
  const s = state(); assertFrozen(s);
  if (!s.required.includes(target)) throw Error(`Undeclared target ${target}`);
  if (s.artifacts[target]?.state === 'verified') { verifyRetainedArtifacts(s); console.log(`Retaining verified ${target}`); return; }
  const name = `${s.prefix}-${qualifier}`;
  if (path.basename(name) !== name) throw Error('Artifact name must be a filename');
  const output = path.join(root, 'dist', name);
  copyFileSync(input, output);
  const bytes = readFileSync(output);
  s.artifacts[target] = { state: 'verified', path: `dist/${name}`, bytes: bytes.length, sha256: sha(bytes), evidence, verifiedAt: new Date().toISOString() };
  persist(s); console.log(`Staged ${target}: ${name}`);
}

function finish() {
  const s = state();
  if (JSON.stringify(s.required) !== JSON.stringify(required)) throw Error('The complete artifact matrix cannot be reduced.');
  let inputsMatch = false;
  try { assertFrozen(s); inputsMatch = true; }
  catch (error) { s.inputError = error.message; }
  verifyRetainedArtifacts(s);
  const result = matrixStatus(s.required, s.artifacts);
  result.complete &&= inputsMatch;
  s.sourceInputsMatch = inputsMatch;
  s.artifactMatrixComplete = result.complete; s.missing = result.missing; s.completedAt = new Date().toISOString(); persist(s);
  // This is a test inventory, never the current-public-release pointer.
  const xml = `<test-build version="${s.version}" complete="${result.complete}">\n` + Object.entries(s.artifacts).map(([target,a]) => `  <artifact target="${target}" state="${a.state}" sha256="${a.sha256 || ''}"/>`).join('\n') + '\n</test-build>\n';
  writeFileSync(path.join(root, 'dist', `${s.prefix}-test-build-inventory.xml`), xml);
  console.log(JSON.stringify(result)); if (!result.complete) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'stamp') stamp();
  else if (command === 'freeze') { const s = state(); if (s.phase !== 'preparing') throw Error('Release is already frozen'); s.sourceInputs = sourceInputs(); s.sourceFingerprint = fingerprint(s.sourceInputs); s.phase = 'frozen'; persist(s); console.log('Release inputs frozen'); }
  else if (command === 'check') { assertFrozen(state()); console.log('Frozen release inputs match'); }
  else if (command === 'context') { const s = releaseBuildInfo(); console.log(JSON.stringify({version:s.version,invocationId:s.invocationId,sourceFingerprint:s.sourceFingerprint})); }
  else if (command === 'verify-retained') { const s = releaseBuildInfo(); verifyRetainedArtifacts(s); console.log('Frozen source and retained artifact hashes match'); }
  else if (command === 'assert-complete') { const s = state(); assertFrozen(s); verifyRetainedArtifacts(s); if (!s.artifactMatrixComplete || !matrixStatus(required, s.artifacts).complete) throw Error('The full matrix is incomplete.'); console.log('Complete matrix verified'); }
  else if (command === 'stage') stage(...args);
  else if (command === 'fail') { const s = state(); s.artifacts[args[0]] = { state: 'failed', error: args[1] }; persist(s); }
  else if (command === 'finish') finish();
  else throw Error('Use stamp, check, stage, fail or finish');
}
