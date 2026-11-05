import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const base = process.env.NATALLY_VERIFY_URL || 'http://127.0.0.1:43827';
const output = 'STANDARDIZED-NATALLY-ASSETS';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(resolve(`${output}/atelier/baseline.html`)).href);
  await page.waitForLoadState('networkidle');
  const baseline = await page.evaluate(() => ({
    state: document.querySelector('#scene').dataset.state,
    width: document.querySelector('#scene').clientWidth,
    height: document.querySelector('#scene').clientHeight,
    controls: document.querySelectorAll('button,input,select,textarea').length,
  }));
  assert.deepEqual(baseline, { state: 'idle', width: 1600, height: 1000, controls: 0 });
  // Vite injects development clients; the saved asset itself has no scripts.
  assert.doesNotMatch(readFileSync(`${output}/atelier/baseline.html`, 'utf8'), /<script/i);
  await page.screenshot({ path: `${output}/atelier/baseline-1600x1000.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: `${output}/atelier/baseline-mobile.png` });

  // Exercise the actual preferences component with migrated stored settings.
  await page.goto(`${base}/${output}/atelier/baseline.html`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    document.querySelectorAll('style').forEach(element => element.remove());
    await import('/src/index.css');
    const reactModule = await import('/node_modules/.vite/deps/react.js');
    const React = reactModule.default || reactModule;
    const dom = await import('/node_modules/.vite/deps/react-dom_client.js');
    const createRoot = dom.createRoot || dom.default.createRoot;
    const { NatallyConfigModal } = await import('/src/components/NatallyConfigModal.tsx');
    const voice = await import('/src/services/voiceService.ts');
    localStorage.setItem('astrosphere_natally_voice_config_v3', JSON.stringify({
      aiVoiceName: 'M2', pitch: 0.8, rate: 1.4, tone: 'warm', readingAloud: false,
    }));
    document.body.innerHTML = '<div id="brand-test"></div>';
    createRoot(document.getElementById('brand-test')).render(React.createElement(NatallyConfigModal, {
      settings: voice.loadVoiceSettings(), onUpdateSettings: () => {}, onClose: () => {},
    }));
  });
  await page.getByText('Companion preferences', { exact: true }).waitFor();
  const preferences = await page.evaluate(() => ({
    selectors: [...document.querySelectorAll('select[aria-label]')].map(e => e.getAttribute('aria-label')),
    ranges: document.querySelectorAll('input[type=range]').length,
    personaPicker: document.body.innerText.includes('Kawaii Personality'),
  }));
  assert.deepEqual(preferences, { selectors: ['Speech resource use'], ranges: 0, personaPicker: false });
  await page.getByRole('button', { name: 'Silent (OFF)' }).click();
  await page.getByRole('button', { name: 'Active (ON)' }).waitFor();
  await page.screenshot({ path: `${output}/atelier/companion-preferences-mobile.png` });
  await page.goto(`${base}/tests/voice-browser.html`);
  await page.getByRole('button', { name: 'Speak test sentence' }).waitFor();
  assert.equal(await page.locator('#voice, #tone, #natural').count(), 0);
  assert.deepEqual(errors, []);
  const result = { baseline, mobileOverflow: false, preferences, muteToggle: 'passed', pageErrors: errors,
    measurementPageBrandControlsRemoved: true,
    scope: 'Local baseline and mounted production preferences component; no speech generation or authenticated session' };
  writeFileSync(`${output}/verification.json`, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
