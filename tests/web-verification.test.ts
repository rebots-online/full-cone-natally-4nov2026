import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import configure from '../vite.config';

test('local web verification is isolated from production release identity and staging', () => {
  const previous = process.env.NATALLY_VERIFY_COORDINATOR;
  process.env.NATALLY_VERIFY_COORDINATOR = '1';
  try {
    const config = configure({ command: 'build', mode: 'production' });
    assert.equal(config.build?.outDir, 'build/verify-web/site');
    assert.equal(config.define?.__NATALLY_BUILD__, 'null');
  } finally {
    if (previous === undefined) delete process.env.NATALLY_VERIFY_COORDINATOR;
    else process.env.NATALLY_VERIFY_COORDINATOR = previous;
  }
});

test('verification rejects release and deployment flags before running any build work', () => {
  for (const args of [['--deploy-web'], ['--major', '2'], ['--domains', 'example.test'], ['--continue'], ['--verify-only'], ['--deploy-existing', 'missing.json']]) {
    const result = spawnSync('bash', ['build_all.sh', '--verify-web', ...args], { encoding: 'utf8' });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /cannot be combined/);
  }
});
