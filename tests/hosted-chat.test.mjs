import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeHosted, HostedAuthenticationError } from '../src/services/hostedInference.ts';

// The former Netlify chat proxy was retired. Test the real direct-client stream
// boundary instead; transport fixtures never call or simulate a customer service.
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
const payload = { prompt: 'Explain the supplied chart facts.', systemInstruction: 'Use supplied facts.' };
const frame = (delta, finish_reason = null) => `data: ${JSON.stringify({ model: 'test/model:free', choices: [{ delta, finish_reason }] })}\n\n`;
const streamResponse = (text) => new Response(text, { headers: { 'content-type': 'text/event-stream' } });

test('direct stream reports only answer content and preserves the responding model', async () => {
  const original = globalThis.fetch;
  const progress = [];
  globalThis.fetch = async () => streamResponse(
    frame({ reasoning_details: [{ index: 0, text: 'private reasoning' }] }) +
    frame({ content: 'First ' }) + frame({ content: 'second.' }, 'stop') + 'data: [DONE]\n\n');
  try {
    const result = await completeHosted({ ...payload, onProgress: (text, model) => progress.push({ text, model }) }, 'inference-key', endpoint);
    assert.deepEqual(result, { text: 'First second.', model: 'test/model:free' });
    assert.deepEqual(progress[0], { text: 'First ', model: 'test/model:free' });
    assert.equal(progress.some(entry => entry.text.includes('private reasoning')), false);
  } finally { globalThis.fetch = original; }
});

test('account switch while a stream read is pending never publishes the old account answer', async () => {
  const original = globalThis.fetch;
  let active = true;
  let controller;
  let reading;
  const readStarted = new Promise(resolve => { reading = resolve; });
  let cancelled = false;
  const progress = [];
  globalThis.fetch = async () => new Response(new ReadableStream({
    start(value) { controller = value; },
    pull() { reading(); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 }), { headers: { 'content-type': 'text/event-stream' } });
  try {
    const pending = completeHosted({ ...payload, onProgress: text => progress.push(text) }, 'inference-key', endpoint, undefined, () => active);
    const rejected = assert.rejects(pending, HostedAuthenticationError);
    await readStarted;
    active = false;
    controller.enqueue(new TextEncoder().encode(frame({ content: 'Old account private answer' }, 'stop') + 'data: [DONE]\n\n'));
    await rejected;
    assert.deepEqual(progress, []);
    assert.equal(cancelled, true);
  } finally { globalThis.fetch = original; }
});

for (const [name, body, expected] of [
  ['truncated stream', frame({ content: 'Unfinished' }), /stopped before it finished/],
  ['reasoning-only stream', frame({ reasoning_details: [{ text: 'private reasoning' }] }, 'stop'), /no complete reading/],
  ['malformed event', 'data: {invalid}\n\n', /unreadable response/],
  ['corrupt answer', frame({ content: '\uFFFD\uFFFD\uFFFD' }, 'stop'), /corrupted text/],
  ['provider interruption', 'data: {"error":{"message":"transport interrupted"}}\n\n', /stream was interrupted/],
]) {
  test(`${name} fails without manufacturing a completed reading`, async () => {
    const original = globalThis.fetch;
    globalThis.fetch = async () => streamResponse(body);
    try { await assert.rejects(completeHosted(payload, 'inference-key', endpoint), expected); }
    finally { globalThis.fetch = original; }
  });
}
