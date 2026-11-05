import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import mime from 'mime';

const root = path.resolve('build/verify-web/site');
const evidence = path.resolve('build/verify-web/evidence');
await mkdir(evidence, { recursive: true });
const server = createServer(async (request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + requested);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    response.setHeader('Content-Type', mime.getType(file) || 'application/octet-stream');
    response.end(await readFile(file));
  } catch {
    response.writeHead(404); response.end('Not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block' });
    // Exercise local UI only: no sign-in, payments, inference or production writes.
    await context.route('**/*', route => new URL(route.request().url()).origin === origin
      ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(`${origin}/marketing.html`, { waitUntil: 'networkidle' });
      await page.locator('.marketing-frame').waitFor({ state: 'visible' });
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.atelier-scene img'))
        .some(image => image.complete && image.naturalWidth > 0));
      assert.ok(await page.locator('h1').isVisible(), `${name}: landing heading is visible`);
      assert.ok(await page.getByRole('button', { name: /Sound On/ }).isVisible(), `${name}: actual room controls mounted`);
      assert.ok(await page.locator('a[href*="app.html"]').count(), `${name}: app entry remains available`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: no horizontal overflow`);
      await page.screenshot({ path: path.join(evidence, `landing-${name}.png`), fullPage: true });
      await page.goto(`${origin}/app.html?app=1`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => (document.getElementById('root')?.textContent || '').trim().length > 0);
      assert.doesNotMatch(await page.locator('#root').innerText(), /Failed to load the app/);
      await page.screenshot({ path: path.join(evidence, `app-${name}.png`), fullPage: true });
      assert.deepEqual(errors, [], `${name}: no uncaught JavaScript errors`);
      results.push({ viewport: name, result: 'passed', errors });
    } catch (error) {
      await page.screenshot({ path: path.join(evidence, `failure-${name}.png`), fullPage: true }).catch(() => {});
      results.push({ viewport: name, result: 'failed', error: error.message, errors });
      throw error;
    } finally {
      await context.close();
    }
  }
} finally {
  await writeFile(path.join(evidence, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
console.log('PASS: actual landing artwork, controls, responsive layout and app entry on desktop and mobile.');
