import test from 'node:test';
import assert from 'node:assert/strict';
import * as chat from '../src/services/natallyChat';
import { validatePresentationCues } from '../src/services/presentation';
import { calculateNatalChart } from '../src/services/ephemeris';

const chart = await calculateNatalChart({ name: 'Chart focus fixture', birthDate: '2000-01-01', birthTime: '00:00',
  placeName: 'Greenwich', latitude: 51.48, longitude: 0, timezoneOffset: 0, houseSystem: 'W' });

test('response cues become clean text and ordered offsets, without losing provenance', () => {
  const result = chat.parseNatallyResponse('  [[chart:Sun]]Your Sun.\n\n[[chart:House 8;Moon]]Your eighth house.\n[[chart:clear]]Your choice.\n---ASTROLOGICAL PROVENANCE---\nGeometry: measured', chart);
  assert.equal(result.text, 'Your Sun.\n\nYour eighth house.\nYour choice.');
  assert.deepEqual(result.chartCues, [
    { offset: 0, targets: ['Sun'] }, { offset: 11, targets: ['House 8', 'Moon'] }, { offset: 30, targets: [] },
  ]);
  assert.equal(result.evidence?.verifiedGeometry, 'measured');
});

test('invented aspects, selectors, malformed cues and unknown-time houses cannot control the chart', () => {
  const result = chat.parseNatallyResponse('[[chart:Sun;#billing]]Safe. [[chart:House 13]]Still safe. [[chart:<script>]]Done. [[chart:Sun', chart);
  assert.equal(result.text, 'Safe. Still safe. Done.');
  assert.deepEqual(result.chartCues, []);
  const unknown = { ...chart, input: { ...chart.input, birthTimeUnknown: true } };
  assert.deepEqual(chat.parseNatallyResponse('[[chart:House 1]]Approximate.', unknown).chartCues, []);
  assert.deepEqual(chat.parseNatallyResponse('[[chart:Sun]]Hello.').chartCues, []);
  const aspect = chart.aspectChords[0];
  assert.deepEqual(chat.parseNatallyResponse(`[[chart:${aspect.name}]]An actual aspect.`, chart).chartCues,
    [{ offset: 0, targets: [aspect.name] }]);
});

test('focus advances by cleaned reply offsets and clear cues remove it', () => {
  assert.equal(typeof chat.chartFocusAt, 'function');
  const cues = [{ offset: 0, targets: ['Sun'] }, { offset: 12, targets: ['House 8'] }, { offset: 25, targets: [] }];
  assert.deepEqual(chat.chartFocusAt(cues, 11), ['Sun']);
  assert.deepEqual(chat.chartFocusAt(cues, 12), ['House 8']);
  assert.deepEqual(chat.chartFocusAt(cues, 26), []);
  assert.deepEqual(chat.parseNatallyResponse('[[chart:Sun]]Sun text.[[chart:clear]]', chart).chartCues,
    [{ offset: 0, targets: ['Sun'] }, { offset: 9, targets: [] }]);
  assert.deepEqual(chat.parseNatallyResponse('[[chart:Sun]]Sun text.  [[chart:clear]]', chart).chartCues,
    [{ offset: 0, targets: ['Sun'] }, { offset: 9, targets: [] }]);
});

test('saved cues reject another chart, invalid offsets and non-inventory targets', () => {
  assert.equal(typeof chat.validateChartCues, 'function');
  const parsed = chat.parseNatallyResponse('[[chart:House 4]]Home.', chart);
  assert.deepEqual(chat.validateChartCues(parsed.chartCues, parsed.text, parsed.chartFocusKey, chart), parsed.chartCues);
  const other = { ...chart, input: { ...chart.input, birthDate: '2001-01-01' } };
  assert.deepEqual(chat.validateChartCues(parsed.chartCues, parsed.text, parsed.chartFocusKey, other), []);
  assert.deepEqual(chat.validateChartCues([{ offset: -1, targets: ['Sun'] }], 'Home.', parsed.chartFocusKey, chart), []);
  assert.deepEqual(chat.validateChartCues([{ offset: 0, targets: ['#billing'] }], 'Home.', parsed.chartFocusKey, chart), []);
  assert.deepEqual(chat.validateChartCues([{ offset: 8, targets: ['Sun'] }], 'Home.', parsed.chartFocusKey, chart), []);
  assert.deepEqual(chat.validateChartCues([{ offset: 3, targets: ['Sun'] }, { offset: 0, targets: ['Moon'] }], 'Home.', parsed.chartFocusKey, chart), []);
});

test('presentation parsing bounds oversized cues and never treats provenance commands as body cues', () => {
  const result = chat.parseNatallyResponse('[[chart:Sun;Moon;Mercury;Venus;Mars;Jupiter;Saturn]]Too many targets.', chart);
  assert.deepEqual(result.chartCues, []);
  // Current messages store versioned presentation actions, not the legacy 48-cue array.
  const many = chat.parseNatallyResponse('[[chart:Sun]]Sun. '.repeat(120), chart, false);
  assert.equal(many.presentationVersion, 1);
  assert.equal(many.presentationCues?.length, 96);
  assert.deepEqual(validatePresentationCues(many.presentationCues, many.text, many.chartFocusKey, chart), many.presentationCues);
  assert.deepEqual(chat.validateChartCues(many.chartCues, many.text, many.chartFocusKey, chart), []);
  assert.doesNotMatch(many.text, /\[\[chart:/);
  const provenance = chat.parseNatallyResponse('[[chart:Sun]]Sun.\n---ASTROLOGICAL PROVENANCE---\nGeometry: [[chart:Moon]]Moon.', chart);
  assert.deepEqual(provenance.chartCues, [{ offset: 0, targets: ['Sun'] }]);
});

test('long recovered narration retains a bounded presentation that survives saved-message validation', async () => {
  const { validatePresentationCues } = await import('../src/services/presentation');
  // No provider or authored cue: the production recovery path alone generates
  // a focus for each sentence, plus camera movements.
  const result = chat.parseNatallyResponse('Your natal Sun is the subject. '.repeat(520).trim(), chart);
  assert.ok(result.presentationCues?.length);
  const replay = validatePresentationCues(result.presentationCues, result.text, result.chartFocusKey, chart);
  assert.deepEqual(replay, result.presentationCues, 'A saved reading must not lose all presentation cues on replay');
  assert.ok(result.presentationCues.length <= 512, 'Generated cues must fit the saved-message safety limit');
});

test('recovered camera offsets use trimmed displayed text when a reply ends in whitespace', async () => {
  const { validatePresentationCues } = await import('../src/services/presentation');
  const result = chat.parseNatallyResponse('Your natal Sun.  ', chart);
  assert.equal(result.text, 'Your natal Sun.');
  assert.deepEqual(validatePresentationCues(result.presentationCues, result.text, result.chartFocusKey, chart), result.presentationCues);
});

test('camera augmentation bounds both replay modes and clears the omitted narration safely', async () => {
  const { validatePresentationCues, withReadingCamera } = await import('../src/services/presentation');
  const text = 'Your natal Sun is the subject. '.repeat(520).trim();
  const parsed = chat.parseNatallyResponse(text, chart);
  const explicit = Array.from({ length: 520 }, (_, offset) => ({ offset, action: { type: 'focus' as const, targets: ['Sun'] } }));
  for (const reading of [false, true]) {
    const cues = withReadingCamera(text, explicit, [], reading);
    assert.equal(cues.length, 512);
    assert.deepEqual(cues.at(-2)?.action, { type: 'clear' });
    assert.deepEqual(cues.at(-1)?.action, { type: 'view', view: 'atelier' });
    assert.equal(cues.at(-1)?.offset, cues.at(-2)?.offset);
    // Non-reading inserts atelier+chart before the focus sequence. Reading
    // inserts only chart. Both stop at the first omitted chronological cue.
    assert.equal(cues.at(-1)?.offset, reading ? 509 : 508);
    assert.deepEqual(validatePresentationCues(cues, text, parsed.chartFocusKey, chart), cues);
    const replay = withReadingCamera(text, parsed.presentationCues!, [], reading);
    assert.ok(replay.length <= 512);
    assert.deepEqual(validatePresentationCues(replay, text, parsed.chartFocusKey, chart), replay);
  }
  assert.equal(parsed.text, text, 'Bounding metadata must never truncate the reading');
  assert.equal(parsed.presentationCues?.length, 512);
  assert.deepEqual(parsed.presentationCues?.at(-2)?.action, { type: 'clear' });
  assert.deepEqual(parsed.presentationCues?.at(-1)?.action, { type: 'view', view: 'atelier' });
});

test('overflow termination survives saved-plan camera reapplication in either reading mode', async () => {
  const { withReadingCamera, presentationViewAt, presentationFocusAt } = await import('../src/services/presentation');
  const text = 'Your natal Sun is the subject. '.repeat(520).trim();
  const parsed = chat.parseNatallyResponse(text, chart);
  const plans = [parsed.presentationCues!, withReadingCamera(text,
    Array.from({ length: 520 }, (_, offset) => ({ offset, action: { type: 'focus' as const, targets: ['Sun'] } })), [], false)];
  for (const plan of plans) {
    const saved = validatePresentationCues(JSON.parse(JSON.stringify(plan)), text, parsed.chartFocusKey, chart);
    const cutoff = saved.at(-1)!.offset;
    for (const reading of [false, true]) {
      const replay = withReadingCamera(text, saved, [{ start: cutoff + 1, end: text.length }], reading);
      assert.deepEqual(replay, saved, 'An overflow stop must remain stable even with later recovered references');
      assert.equal(presentationViewAt(replay, cutoff), 'atelier');
      assert.deepEqual(presentationFocusAt(replay, cutoff), { type: 'clear' });
      assert.equal(presentationViewAt(replay, text.length), 'atelier');
      assert.deepEqual(withReadingCamera(text, replay, [], !reading), saved);
    }
  }
});
