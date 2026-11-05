import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStamp, matrixStatus, msiVersionFor } from '../scripts/release-state.mjs';

test('each matrix invocation advances minor even with identical source and clock', () => {
  const clock = new Date('2026-10-19T16:00:00Z');
  const first = nextStamp({ major: 0, minor: 0 }, clock);
  const second = nextStamp(first, clock);
  assert.equal(first.minor, 1);
  assert.equal(second.minor, 2);
  assert.equal(first.build, second.build);
  assert.notEqual(first.version, second.version);
  assert.equal(first.versionCode, 1);
});

test('major remains operator controlled and versionCode never wraps into its next lane', () => {
  assert.equal(nextStamp({ major: 2, minor: 41 }).versionCode, 200042);
  assert.throws(() => nextStamp({ major: 0, minor: 99999 }), /MAJOR/);
  assert.throws(() => nextStamp({ major: 0, minor: -1 }), /Invalid/);
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
