import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStamp, matrixStatus, msiVersionFor } from '../scripts/release-state.mjs';
import * as releaseState from '../scripts/release-state.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

test('a direct private web build fails before invoking Vite without the matrix context', () => {
  const env = { ...process.env }; delete env.NATALLY_RELEASE_ID;
  const child = spawnSync(process.execPath, ['scripts/build-web.mjs'], { cwd: new URL('..', import.meta.url), env, encoding: 'utf8' });
  assert.notEqual(child.status, 0);
  assert.match(child.stderr, /complete-matrix invocation/);
});

test('continuation detects damaged retained bytes and refuses a reduced matrix', () => {
  const folder = mkdtempSync(path.join(tmpdir(), 'natally-retained-'));
  try {
    mkdirSync(path.join(folder, 'dist'));
    writeFileSync(path.join(folder, 'dist/test.zip'), 'original artifact');
    const s = { required: releaseState.required, artifacts: { web: { state:'verified', path:'dist/test.zip', sha256:createHash('sha256').update('original artifact').digest('hex') } } };
    releaseState.verifyRetainedArtifacts(s, folder);
    writeFileSync(path.join(folder, 'dist/test.zip'), 'altered artifact');
    assert.throws(() => releaseState.verifyRetainedArtifacts(s, folder), /bytes changed/);
    assert.throws(() => releaseState.verifyRetainedArtifacts({ ...s, required:['web'] }, folder), /cannot be reduced/);
  } finally { rmSync(folder, { recursive:true, force:true }); }
});

test('canonical BUILD always has five digits while package SemVer has no leading zero', () => {
  const stamp = nextStamp({ major: 1, minor: 3 }, new Date(100003 * 60000));
  assert.equal(stamp.version, '1.4.00003');
  assert.equal(stamp.semverVersion, '1.4.3');
});

test('private production hooks reject missing or foreign release IDs and stale inputs', () => {
  const frozen = { major: 1, phase: 'frozen', invocationId: 'one-complete-release', sourceFingerprint: 'source-A', version: '1.4.00003' };
  assert.throws(() => releaseState.validateBuildContext(frozen, '', 'source-A'), /invocation/i);
  assert.throws(() => releaseState.validateBuildContext(frozen, 'another-release', 'source-A'), /invocation/i);
  assert.throws(() => releaseState.validateBuildContext(frozen, 'one-complete-release', 'source-B'), /source|input/i);
  assert.throws(() => releaseState.validateBuildContext({ ...frozen, phase: 'preparing' }, 'one-complete-release', 'source-A'), /frozen/i);
  assert.equal(releaseState.validateBuildContext(frozen, 'one-complete-release', 'source-A').version, frozen.version);
});

test('each matrix invocation advances minor even with identical source and clock', () => {
  const clock = new Date('2026-10-19T16:00:00Z');
  const first = nextStamp({ major: 1, minor: 0 }, clock);
  const second = nextStamp(first, clock);
  assert.equal(first.minor, 1);
  assert.equal(second.minor, 2);
  assert.equal(first.build, second.build);
  assert.notEqual(first.version, second.version);
  assert.equal(first.versionCode, 100001);
});

test('major remains operator controlled and versionCode never wraps into its next lane', () => {
  assert.equal(nextStamp({ major: 2, minor: 41 }).versionCode, 200042);
  assert.throws(() => nextStamp({ major: 1, minor: 99999 }), /MAJOR/);
  assert.throws(() => nextStamp({ major: 1, minor: -1 }), /Invalid/);
});

test('an available partial matrix remains incomplete', () => {
  const required = ['web', 'windows-exe', 'apk'];
  assert.deepEqual(matrixStatus(required, { web: { state: 'verified' }, apk: { state: 'failed' } }),
    { complete: false, missing: ['windows-exe', 'apk'] });
  assert.equal(matrixStatus(required, Object.fromEntries(required.map(x => [x, { state: 'verified' }]))).complete, true);
});

test('MSI fields stay within their limits across the complete MINOR range', () => {
  let last = -1;
  for (const minor of [1, 255, 256, 65535, 65536, 99999]) {
    const [major, second, third, fourth] = msiVersionFor({major: 2, minor, build: 99999}).split('.').map(Number);
    assert.equal(major, 2);
    assert.ok(second <= 255 && third <= 65535 && fourth <= 65535);
    const ordering = second * 65536 + third;
    assert.equal(ordering, minor);
    assert.ok(ordering > last); last = ordering;
  }
});

test('major zero cannot stamp or resume a frozen release', () => {
  assert.throws(() => nextStamp({ major: 0, minor: 11 }), /MAJOR/);
  assert.throws(() => releaseState.validateBuildContext({ major: 0, phase: 'frozen', invocationId: 'id', sourceFingerprint: 'hash' }, 'id', 'hash'), /MAJOR/);
});
test('RPM omission prevents matrix completion', () => {
  assert.ok(releaseState.required.includes('rpm'));
  const artifacts = Object.fromEntries(releaseState.required.filter(x => x !== 'rpm').map(x => [x, { state: 'verified' }]));
  assert.deepEqual(matrixStatus(releaseState.required, artifacts), { complete: false, missing: ['rpm'] });
});
