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
  const origin = 'https://natally.example';
  try {
    for (const file of ['index.html', 'app.html', 'landing.html', 'marketing.html', 'pwa.js', 'branding/192x192.png', 'branding/512x512.png', 'assets/app.js', 'assets/style.css', 'models/voice.onnx', 'auth/native.html']) {
      mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      writeFileSync(path.join(dir, file), file.endsWith('.html')
        ? `<meta name="natally-release-id" content="${release.invocationId}"><h1>${file}</h1>` : file);
    }
    writeFileSync(path.join(dir, 'manifest.webmanifest'), readFileSync(new URL('../public/manifest.webmanifest', import.meta.url)));
    const first = generatePwa(dir, release);
    assert.deepEqual(generatePwa(dir, release), first);
    assert.ok(first.precache.includes('/assets/app.js'));
    for (const excluded of ['/sw.js', '/models/voice.onnx', '/auth/native.html', '/pwa-build.json']) assert.ok(!first.precache.includes(excluded));
    const events = {};
    const worker = readFileSync(path.join(dir, 'sw.js'), 'utf8');
    const stored = new Map();
    const deleted = [];
    const matched = [];
    let offline = false;
    let installed = false;
    const context = {
      URL, Map, Set, Promise, Response,
      Request: class extends Request {
        constructor(input, init) { super(new URL(typeof input === 'string' ? input : input.url, origin), init); }
      },
      self: { location: { origin }, clients: { claim: async () => {}, matchAll: async () => [] },
        skipWaiting: async () => { installed = true; }, addEventListener: (name, fn) => { events[name] = fn; } },
      caches: {
        has: async () => false,
        open: async name => {
          assert.equal(name, first.cacheName);
          return { match: async key => { matched.push(key); return stored.get(key)?.clone(); }, put: async (key, response) => { stored.set(key, response.clone()); } };
        },
        keys: async () => ['other-app-data', 'natally-shell-1.1.99999-old', 'natally-shell-1.2.00003-installing', first.cacheName],
        delete: async name => { deleted.push(name); },
      },
      fetch: async request => {
        if (offline) throw new Error('Network unavailable');
        const pathname = new URL(request.url).pathname;
        return new Response(readFileSync(path.join(dir, pathname)), { headers: { 'Content-Type': pathname.endsWith('.html') ? 'text/html' : 'application/octet-stream' } });
      },
    };
    vm.runInNewContext(worker, context);
    let wait;
    events.install({ waitUntil: promise => { wait = promise; } }); await wait;
    assert.equal(installed, true);
    assert.deepEqual([...stored.keys()].sort(), first.precache);
    events.activate({ waitUntil: promise => { wait = promise; } }); await wait;
    assert.deepEqual(deleted, ['natally-shell-1.1.99999-old']);
    for (const url of ['https://api.revenuecat.com/customer', origin + '/auth/native.html', origin + '/api/payment']) {
      let intercepted = false;
      events.fetch({ request: { url, method: 'GET', mode: 'navigate' }, respondWith: () => { intercepted = true; } });
      assert.equal(intercepted, false, url);
    }
    offline = true;
    for (const [url, expected] of [['/?app=1&souvenir=personal', '/index.html'], ['/app.html?app=1', '/app.html'], ['/landing', '/landing.html'], ['/landing.html', '/landing.html'], ['/marketing.html', '/marketing.html']]) {
      let response;
      events.fetch({ request: { url: origin + url, method: 'GET', mode: 'navigate' },
        respondWith: promise => { response = promise; }, waitUntil: promise => { wait = promise; } });
      assert.match(await (await response).text(), new RegExp(`<h1>${expected.slice(1)}</h1>`));
      assert.equal(matched.at(-1), expected);
      await wait;
    }
    rmSync(path.join(dir, 'app.html'));
    assert.throws(() => generatePwa(dir, release), /Missing PWA shell resource: \/app.html/);
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
