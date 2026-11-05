import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { generatePwa } from '../scripts/pwa-build.mjs';

test('PWA generation is repeatable, requires its shell, and isolates network operations', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'natally-pwa-'));
  const release = { version: '1.2.00003', invocationId: 'regression-fixture' };
  try {
    for (const file of ['index.html', 'marketing.html', 'manifest.webmanifest', 'pwa.js', 'branding/192x192.png', 'branding/512x512.png', 'assets/app.js', 'assets/style.css', 'models/voice.onnx', 'auth/native.html']) {
      mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      writeFileSync(path.join(dir, file), file);
    }
    const first = generatePwa(dir, release);
    assert.deepEqual(generatePwa(dir, release), first);
    assert.ok(first.precache.includes('/assets/app.js'));
    for (const excluded of ['/sw.js', '/models/voice.onnx', '/auth/native.html', '/pwa-build.json']) assert.ok(!first.precache.includes(excluded));
    const events = {};
    const worker = readFileSync(path.join(dir, 'sw.js'), 'utf8');
    const matches = [];
    const deleted = [];
    const context = {
      URL, Map, Promise,
      self: { location: { origin: 'https://natally.example' }, clients: { claim: async () => {} }, addEventListener: (name, fn) => { events[name] = fn; } },
      caches: {
        open: async name => { assert.equal(name, first.cacheName); return { match: async key => { matches.push(key); return 'cached-shell'; }, addAll: async urls => assert.deepEqual(Array.from(urls), first.precache) }; },
        keys: async () => ['other-app-data', 'natally-shell-old', first.cacheName],
        delete: async name => { deleted.push(name); },
      },
      fetch: async () => { throw new Error('Unexpected network request'); },
    };
    vm.runInNewContext(worker, context);
    let wait;
    events.install({ waitUntil: promise => { wait = promise; } }); await wait;
    events.activate({ waitUntil: promise => { wait = promise; } }); await wait;
    assert.deepEqual(deleted, ['natally-shell-old']);
    for (const url of ['https://api.revenuecat.com/customer', 'https://natally.example/auth/native.html', 'https://natally.example/api/payment']) {
      let intercepted = false;
      events.fetch({ request: { url, method: 'GET', mode: 'navigate' }, respondWith: () => { intercepted = true; } });
      assert.equal(intercepted, false, url);
    }
    for (const [url, expected] of [['/?app=1&souvenir=personal', '/index.html'], ['/marketing.html', '/marketing.html']]) {
      events.fetch({ request: { url: 'https://natally.example' + url, method: 'GET', mode: 'navigate' }, respondWith: promise => { wait = promise; } });
      assert.equal(await wait, 'cached-shell');
      assert.equal(matches.at(-1), expected);
    }
    rmSync(path.join(dir, 'index.html'));
    assert.throws(() => generatePwa(dir, release), /Missing PWA shell/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('installation uses branded app entry and is required by the matrix', async () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.start_url, '/?app=1');
  assert.equal(manifest.display, 'standalone');
  for (const size of ['192x192', '512x512']) assert.ok(manifest.icons.some(icon => icon.sizes === size));
  const { required } = await import('../scripts/release-state.mjs');
  assert.ok(required.includes('pwa'));
});
