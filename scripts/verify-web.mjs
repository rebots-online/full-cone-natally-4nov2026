// Local verification only. The canonical coordinator remains the entry point.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';

if (process.env.NATALLY_VERIFY_COORDINATOR !== '1') {
  throw new Error('Run bash build_all.sh --verify-web for a non-publishing web verification.');
}

console.log('Compiling current web source for local verification. No release, credentials, Git writes, native setup or deployment.');
execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Keep native bundler workers bounded on shared development machines.
    RAYON_NUM_THREADS: process.env.RAYON_NUM_THREADS || '2',
  },
});
const site = 'build/verify-web/site';
copyFileSync(`${site}/index.html`, `${site}/app.html`);
copyFileSync(`${site}/marketing.html`, `${site}/landing.html`);
mkdirSync(`${site}/landing`, { recursive: true });
copyFileSync(`${site}/marketing.html`, `${site}/landing/index.html`);
writeFileSync('build/verify-web/README.txt',
  'Local web compilation only. Not a release or deployment. No release identity or service worker is generated.\n'
  + 'Serve site/ locally and inspect /marketing.html and /app.html.\n');
console.log('Web compilation passed: build/verify-web/site (not a release).');
