#!/usr/bin/env node
// One-command billing deploy to the existing Netlify site (cost gating: no
// per-request-billed hosting before revenue). Run on a computer where KStore
// resolves (Robin's Ubuntu/Windows hosts) with the Netlify CLI logged in:
//
//   node scripts/deploy-billing-netlify.mjs --site natally-hosted-chat
//
// 1. resolves the billing environment from KStore (same selection as every
//    deploy target, scripts/billing-runtime-env.mjs);
// 2. forces BILLING_CREDIT_BALANCE_STORE=revenuecat — RevenueCat is the
//    authoritative account store (Robin, 2026-11-02);
// 3. imports it into the Netlify site via a 0600 temporary file that is
//    deleted afterwards (values never appear on a command line);
// 4. deploys netlify/functions (billing.mjs + blink-checkout.mjs) to
//    production and checks https://<site>.netlify.app/billing/health.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createKStoreClient, resolveEnvironment } from './environment.mjs';
import { selectBillingRuntimeEnv } from './billing-runtime-env.mjs';

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const site = flag('--site');
if (!site || !/^[a-z0-9-]+$/.test(site)) {
  console.error('Usage: node scripts/deploy-billing-netlify.mjs --site <netlify-site-name>');
  process.exit(2);
}
const root = resolve('.');
const netlify = (...cliArgs) => execFileSync('netlify', cliArgs, { stdio: 'inherit', cwd: root });
try { execFileSync('netlify', ['--version'], { stdio: 'ignore' }); }
catch { console.error('Netlify CLI not found: npm install --global netlify-cli, then netlify login'); process.exit(2); }

// Single-quoted dotenv values are literal; reject anything that would need escaping.
export function dotenvLine(name, value) {
  const compact = /_JSON$/.test(name) ? JSON.stringify(JSON.parse(value)) : value;
  if (/['\r\n]/.test(compact)) throw new Error(`${name} contains a quote or newline and cannot be imported safely`);
  return `${name}='${compact}'`;
}

const { environment: env } = await resolveEnvironment({ root, client: createKStoreClient() });
const { secrets, plain } = selectBillingRuntimeEnv(env);
plain.BILLING_CREDIT_BALANCE_STORE = 'revenuecat';
for (const name of ['OPENROUTER_ADMIN_KEY', 'BILLING_KEY_ENCRYPTION_KEY', 'FIREBASE_SERVICE_ACCOUNT_JSON',
  'REVENUECAT_SECRET_API_KEY', 'REVENUECAT_PROJECT_ID', 'BILLING_ALLOWED_ORIGIN', 'BILLING_CREDIT_UNITS_PER_USD']) {
  if (!secrets[name] && !plain[name]) throw new Error(`Required billing setting missing from KStore resolution: ${name}`);
}

const dir = join(root, 'build', 'netlify-env'); mkdirSync(dir, { recursive: true });
const file = join(dir, `billing-${Date.now()}.env`);
try {
  writeFileSync(file, Object.entries({ ...plain, ...secrets }).map(([n, v]) => dotenvLine(n, v)).join('\n') + '\n', { mode: 0o600 });
  netlify('env:import', file, '--replace-existing', '--site', site);
} finally {
  rmSync(file, { force: true });
}
netlify('deploy', '--prod', '--site', site, '--dir', 'netlify/public', '--functions', 'netlify/functions');

const url = `https://${site}.netlify.app`;
const health = await fetch(`${url}/billing/health`, { signal: AbortSignal.timeout(20000) });
console.log(`\n/billing/health → HTTP ${health.status}`);
if (health.status !== 200) process.exit(1);
console.log(`\nNext (one time):\n  • set VITE_BILLING_API_URL=${url} in the KStore environment, then bash build_all.sh\n  • RevenueCat → Integrations → Webhooks: URL ${url}/billing/webhook (keep the REVENUECAT_WEBHOOK_AUTH header)\n  • after a real purchase → reading is verified, retire the Cloud Run service`);
