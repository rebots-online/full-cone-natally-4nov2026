import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const browser = process.argv.includes('--browser');
const files = browser ? ['tests/pwa-browser.test.mjs'] : [
  ...readdirSync(new URL('../tests/', import.meta.url))
    .filter(name => /\.test\.(?:mjs|ts|tsx)$/.test(name) && name !== 'pwa-browser.test.mjs')
    .sort().map(name => `tests/${name}`),
  'tests/natally-regression-suite.ts',
];
const result = spawnSync(process.execPath,
  ['--import', 'tsx', '--import', './tests/register-env.mjs', '--test', '--test-concurrency=1', ...files],
  { cwd: new URL('../', import.meta.url), stdio: 'inherit', env: { ...process.env, ...(browser ? { NATALLY_BROWSER_TESTS: '1' } : {}) } });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
