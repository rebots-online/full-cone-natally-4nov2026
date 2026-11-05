import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// Actual adapted Figma document with explicit synthetic provider state. This
// proves selector interaction, not a real store catalog or purchase.
const root = process.env.NATIVE_BILLING_SOURCE_ROOT || process.cwd();
const source = await readFile(path.join(root, 'LIBS/UI/FIGMA/three-screen-offers-20261027/adapted/paywall-three-screen.html'), 'utf8');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.route('**/*', route => route.abort());
  await page.setContent(source, { waitUntil: 'domcontentloaded' });
  const options = ['monthly', 'one_time'].flatMap((cadence, group) => ['5', '10', '25'].map((tier, index) => ({
    offerId: `${cadence}-${tier}`, productTitle: `Provider ${cadence} tier ${tier}`,
    formattedPrice: `CA$${7 + group + index}.49`, productType: cadence === 'monthly' ? 'subscription' : 'one_time',
    billingPeriod: cadence === 'monthly' ? 'P1M' : null,
  })));
  await page.evaluate(options => {
    window.packEvents = [];
    document.addEventListener('natally:offer:select', event => {
      const chosen = options.find(option => option.offerId === event.detail.offerId);
      if (!chosen) throw Error('Unknown selection event');
      window.packEvents.push({ type: 'select', offerId: chosen.offerId });
      window.NatallyOffers.setState({ selectedOfferId: chosen.offerId,
        prices: { conversation: chosen.formattedPrice }, terms: { conversation: chosen } });
    });
    document.addEventListener('natally:offer:purchase', event => window.packEvents.push({ type: 'purchase', ...event.detail }));
    window.NatallyOffers.setState({ options, selectedOfferId: 'monthly-5', screen: 2,
      prices: { conversation: options[0].formattedPrice }, terms: { conversation: options[0] } });
  }, options);
  const active = page.locator('.screen:not([hidden])');
  const selector = active.locator('select');
  assert.equal(await selector.inputValue(), 'monthly-5');
  assert.deepEqual(await selector.locator('optgroup').evaluateAll(groups => groups.map(g => g.label)), ['Monthly', 'One-off packs']);
  assert.deepEqual(await selector.locator('option').evaluateAll(items => items.map(item => item.value).filter(Boolean)), options.map(option => option.offerId));
  assert.match(await selector.getAttribute('aria-label') || await active.locator('label').innerText(), /exploration|access|pack/i);
  await selector.selectOption('one_time-25');
  assert.equal(await active.locator('.price').innerText(), options[5].formattedPrice);
  assert.match(await active.locator('.billing').innerText(), /one.time|never renews/i);
  await active.locator('button.offer[data-kind="conversation"]').click();
  assert.deepEqual(await page.evaluate(() => window.packEvents.at(-1)), { type: 'purchase', kind: 'conversation', offerId: 'one_time-25' });
  await page.locator('button.next').click();
  assert.equal(await page.locator('.screen:not([hidden]) select').inputValue(), 'one_time-25');
  await page.locator('.screen:not([hidden]) select').selectOption('monthly-10');
  assert.match(await page.locator('.screen:not([hidden]) button.offer[data-kind="conversation"] .billing').innerText(), /monthly/);
  await page.locator('.screen:not([hidden]) button.offer[data-kind="conversation"]').click();
  assert.deepEqual(await page.evaluate(() => window.packEvents.at(-1)), { type: 'purchase', kind: 'conversation', offerId: 'monthly-10' });
  await page.evaluate(() => window.NatallyOffers.setState({ busy: true }));
  assert.equal(await page.locator('.screen:not([hidden]) select').isDisabled(), true);
  await page.evaluate(() => window.NatallyOffers.setState({ busy: false, options: [], selectedOfferId: null, prices: { conversation: null }, terms: { conversation: null } }));
  assert.equal(await page.locator('.screen:not([hidden]) select').isDisabled(), true);
  assert.equal(await page.locator('.screen:not([hidden]) button.offer[data-kind="conversation"]').isDisabled(), true);
  console.log('PASS: adapted Figma monthly-first six-pack selector, actual price/cadence, exact selected purchase on dedicated/comparison screens, shared selection, busy/empty states.');
} finally {
  await browser.close();
}
