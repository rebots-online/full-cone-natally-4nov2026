import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { generatePwa } from '../scripts/pwa-build.mjs';

// Integration fixture, never a production bundle or a deployment substitute.
test('Chrome activates the generated worker and reloads its shell offline', { timeout: 45000 }, async () => {
  const folder = mkdtempSync(path.join(tmpdir(), 'natally-pwa-browser-'));
  let browser;
  const server = createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const file = pathname === '/' ? '/index.html' : pathname;
    try {
      const bytes = readFileSync(path.join(folder, file));
      const mime = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.webmanifest') ? 'application/manifest+json' : 'image/png';
      response.writeHead(200, { 'Content-Type': mime }); response.end(bytes);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  try {
    mkdirSync(path.join(folder, 'branding'));
    mkdirSync(path.join(folder, 'assets'));
    const head = '<meta name="natally-release-id" content="browser-fixture"><script defer src="/pwa.js"></script>';
    writeFileSync(path.join(folder, 'index.html'), head + '<h1>Offline shell fixture</h1><script src="/assets/check.js"></script>');
    writeFileSync(path.join(folder, 'marketing.html'), head + '<header class="site-head"><nav class="head-nav"></nav></header><h1>Marketing fixture</h1>');
    writeFileSync(path.join(folder, 'assets/check.js'), 'window.shellScriptLoaded = true;');
    for (const name of ['pwa.js', 'manifest.webmanifest', 'branding/192x192.png', 'branding/512x512.png']) copyFileSync(new URL('../public/' + name, import.meta.url), path.join(folder, name));
    generatePwa(folder, { version: '1.2.00003', invocationId: 'browser-fixture' });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(origin + '/marketing.html');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    const caches = await page.evaluate(async () => {
      const names = await window.caches.keys();
      const cache = await window.caches.open(names.find(n => n.startsWith('natally-shell-')));
      return (await cache.keys()).map(r => new URL(r.url).pathname);
    });
    assert.ok(caches.includes('/assets/check.js'));
    assert.ok(!caches.includes('/auth/native.html'));
    await context.setOffline(true);
    await page.goto(origin + '/?app=1&souvenir=retained');
    assert.equal(await page.locator('h1').textContent(), 'Offline shell fixture');
    assert.equal(await page.evaluate(() => window.shellScriptLoaded), true);
    assert.ok(page.url().includes('souvenir=retained'));
    await page.reload();
    assert.equal(await page.evaluate(() => window.shellScriptLoaded), true);
    await page.goto(origin + '/marketing.html');
    assert.equal(await page.locator('h1').textContent(), 'Marketing fixture');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
    rmSync(folder, { recursive: true, force: true });
  }
});
