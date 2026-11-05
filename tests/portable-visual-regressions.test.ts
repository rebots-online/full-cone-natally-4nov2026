import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as visuals from '../src/services/chartFocusVisuals';

test('credits and adjacent Profile share actual typography metrics and touch targets', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  const profile = readFileSync(new URL('../src/components/AboutDialog.css', import.meta.url), 'utf8');
  for (const selector of ['account-credits-entry__amount','account-credits-entry__label']) {
    const rule = css.split('.'+selector+' {')[1]?.split('}')[0] || '';
    assert.ok(rule.includes('var(--natally-account-font-size, .8rem)/var(--natally-account-line-height, 1.35)'), selector);
  }
  assert.ok(profile.split('.natally-profile__button {')[1]?.split('}')[0].includes('var(--natally-account-font-size, .8rem)/var(--natally-account-line-height, 1.35)'));
  assert.match(css, /\.account-credits-entry \{[^}]*min-height: 44px/);
  assert.match(profile, /\.natally-profile__button \{[^}]*min-height: 2.75rem/);
});

test('tooltip chooses space outside inset and remains inside viewport', () => {
  assert.equal(typeof visuals.chartTooltipPosition, 'function');
  const place = visuals.chartTooltipPosition;
  for (const viewport of [{width:393,height:740},{width:1280,height:900}]) {
    const inset = {left:viewport.width-140,top:40,right:viewport.width-8,bottom:180};
    const result = place(inset, {width:280,height:110}, viewport);
    assert.ok(result.left >= 8 && result.top >= 8);
    assert.ok(result.left + 280 <= viewport.width - 8);
    assert.ok(result.top + 110 <= viewport.height - 8);
    assert.ok(result.left + 280 <= inset.left || result.top >= inset.bottom || result.top + 110 <= inset.top);
  }
});

test('only transient narration dims material, restoring opacity and transparency', async () => {
  const { MeshStandardMaterial } = await import('three');
  assert.equal(typeof visuals.applyChartFocusMaterial, 'function');
  const material = new MeshStandardMaterial({ opacity:0.85, transparent:false });
  visuals.applyChartFocusMaterial(material, true, false);
  assert.equal(material.opacity, 0.85 * visuals.CHART_FOCUS.dim);
  visuals.applyChartFocusMaterial(material, false, true);
  assert.equal(material.opacity, 0.85);
  assert.equal(material.transparent, false);
  material.dispose();
});

test('all narration exit paths invoke owner-checked focus cleanup', () => {
  const source = readFileSync(new URL('../src/components/NatallyChatbot.tsx', import.meta.url), 'utf8');
  assert.match(source, /const clearPlaybackFocus = \(generation: number\)/);
  assert.match(source, /generation !== presentationGeneration\.current/);
  assert.match(source, /finally \{ if \(voiceSettings\.readingAloud\) clearPlaybackFocus\(generation\); \}/);
  assert.match(source, /finally\(\(\) => clearPlaybackFocus\(generation\)\)/);
});

test('explicit Stop voice clears current focus before invalidating its owner', () => {
  const source = readFileSync(new URL('../src/components/NatallyChatbot.tsx', import.meta.url), 'utf8');
  const stop = source.slice(source.indexOf('const stopCurrentVoice ='),source.indexOf('const handleReplayTurn ='));
  const clear = stop.indexOf('clearPlaybackFocus(presentationGeneration.current)');
  assert.ok(clear >= 0 && clear < stop.indexOf('presentationGeneration.current++'), 'stop must clear before generation changes');
});
