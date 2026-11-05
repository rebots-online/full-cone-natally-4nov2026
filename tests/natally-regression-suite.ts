import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeHosted, HostedAuthenticationError } from '../src/services/hostedInference.ts';

// Controlled transport responses exercise the production client. No live key or
// provider is used, and these tests do not establish a purchased reading outcome.
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
const payload = { prompt: 'What are significant transits?', systemInstruction: 'Use supplied facts.' };
const completion = (content: string) => ({ model: 'test/model:free', choices: [{ message: { content }, finish_reason: 'stop' }] });

test('client sends the per-account inference credential directly and preserves the provider answer', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    assert.equal(input, endpoint);
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer inference-key');
    const body = JSON.parse(init?.body as string);
    assert.equal(body.model, 'openrouter/free');
    assert.equal(body.stream, true);
    assert.deepEqual(body.messages, [
      { role: 'system', content: payload.systemInstruction },
      { role: 'user', content: payload.prompt },
    ]);
    assert.ok(init?.signal);
    return new Response(JSON.stringify(completion('Provider transport fixture')));
  };
  try {
    assert.deepEqual(await completeHosted(payload, 'inference-key', endpoint), { text: 'Provider transport fixture', model: 'test/model:free' });
  } finally { globalThis.fetch = original; }
});

test('client fails closed on network failure and never supplies local prose', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  try {
    await assert.rejects(completeHosted(payload, 'inference-key', endpoint), /Could not reach OpenRouter.*question is kept/);
  } finally { globalThis.fetch = original; }
});

test('missing inference key and obsolete sessions fail before any network call', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('No request may leave this account');
  try {
    await assert.rejects(completeHosted(payload, '', endpoint), /credits could not be connected/);
    await assert.rejects(completeHosted(payload, 'inference-key', endpoint, undefined, () => false), error =>
      error instanceof HostedAuthenticationError && error.code === 'auth_required');
  } finally { globalThis.fetch = original; }
});

test('inference credentials cannot be sent to a former proxy or an arbitrary endpoint', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('Credential must not leave the allowed endpoint');
  try {
    await assert.rejects(completeHosted(payload, 'inference-key', 'https://example.test/chat'), /direct OpenRouter endpoint/);
  } finally { globalThis.fetch = original; }
});

for (const status of [401, 403, 402, 429, 503]) {
  test(`provider ${status} is an actionable error, never a reading`, async () => {
    const original = globalThis.fetch;
    let progress = 0;
    globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Provider unavailable' } }), { status });
    try {
      const expected = status === 401 || status === 403 ? /account could not be confirmed/
        : status === 402 ? /credits are used up/ : status === 429 ? /rate limited/ : /Provider unavailable/;
      await assert.rejects(completeHosted({ ...payload, onProgress: () => progress++ }, 'inference-key', endpoint), expected);
      assert.equal(progress, 0);
    } finally { globalThis.fetch = original; }
  });
}

test('client rejects legacy fallback, missing model, empty and reasoning-only responses', async () => {
  const original = globalThis.fetch;
  try {
    for (const [body, expected] of [
      [{ text: 'Template', model: 'local', source: 'offline_calibration' }, /no complete reading/],
      [{ choices: [{ message: { content: 'Unidentified' } }] }, /did not identify/],
      [completion(''), /no complete reading/],
      [{ model: 'test/model:free', choices: [{ message: { reasoning_content: 'private reasoning' } }] }, /no complete reading/],
    ] as const) {
      globalThis.fetch = async () => new Response(JSON.stringify(body));
      await assert.rejects(completeHosted(payload, 'inference-key', endpoint), expected);
    }
  } finally { globalThis.fetch = original; }
});
