// Focused checks for scripts/environment.mjs.
// Run: node --test tests/environment.test.mjs
// Isolated fixtures live beneath this staging directory's .tmp/ and are
// removed via their own created paths only. These checks exercise the helper
// contract only; real provider acceptance is a separate operator procedure.

import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import {
  parseEnvironmentDocument,
  synchronizeEnvironment,
  checkEnvironment,
  parseCredentialReference,
  serializeAssignment,
  createKStoreClient,
  recoverShellCredentials,
  resolveEnvironment,
  migrateEnvironmentCredentials,
  runCli,
} from '../scripts/environment.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const STAGING = join(HERE, '..', '.tmp');
const TEMPLATE = readFileSync(join(HERE, '..', '.env.example'), 'utf8');

const ADMIN_POINTER = 'kstore://admin-manual/CREDENTIALS/OpenRouter/credentials.env#OPENROUTER_ADMIN_KEY';
const SECRET = 'sk-or-real-live-admin-value-9f2';
const TOOLING = 'sk-or-real-tooling-value-77';
const GEMINI = 'AIza-real-gemini-value-42';

let dir;
function fixture(files) {
  for (const [name, content] of Object.entries(files)) {
    const p = join(dir, name);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
}

beforeEach(() => {
  mkdirSync(STAGING, { recursive: true });
  dir = mkdtempSync(join(STAGING, 'envtest-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function liveEnv() {
  return TEMPLATE
    .replace('OPENROUTER_ADMIN_KEY=""', `OPENROUTER_ADMIN_KEY="${SECRET}"`)
    .replace('OPENROUTER_API_KEY=""', `OPENROUTER_API_KEY="${TOOLING}"`)
    .replace('GEMINI_API_KEY=""', `GEMINI_API_KEY="${GEMINI}"`);
}

// Fully pointered .env that passes checkEnvironment.
function pointerEnv() {
  return TEMPLATE
    .replace('OPENROUTER_ADMIN_KEY=""', `OPENROUTER_ADMIN_KEY="${ADMIN_POINTER}"`)
    .replace('OPENROUTER_API_KEY=""', 'OPENROUTER_API_KEY="kstore://admin-manual/CREDENTIALS/OpenRouter/credentials.env#OPENROUTER_API_KEY"')
    .replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GEMINI_API_KEY"');
}

// In-memory KStore double honoring the client-facing method contract.
function fakeClientState(initial = {}) {
  const docs = new Map(Object.entries(initial));
  const calls = [];
  const client = {
    async read_document(path) {
      calls.push(['read', path]);
      if (!docs.has(path)) {
        const err = new Error(`missing document ${path}`);
        err.code = 'KSTORE_NOT_FOUND';
        throw err;
      }
      return { content: docs.get(path), revision: 1, exact: true };
    },
    async write_document(path, content) {
      calls.push(['write', path]);
      docs.set(path, content);
      return { revision: 1 };
    },
    async write_with_exact_readback(path, content, opts) {
      await this.write_document(path, content, opts);
      return this.read_document(path);
    },
  };
  return { calls, docs, client };
}

// Python subprocess double returning replies in the REAL kstore_client shape.
function pythonDouble(respond) {
  const calls = [];
  const spawnImpl = (cmd, args) => {
    const child = {};
    child.stdout = { on: (ev, cb) => { if (ev === 'data') child.emitData = cb; } };
    child.stderr = { on: () => {} };
    child.on = (ev, cb) => { if (ev === 'close') child.emitClose = () => cb(0); };
    child.stdin = {
      end: (s) => {
        const payload = s ? JSON.parse(s) : {};
        calls.push({ cmd, args, payload });
        const reply = respond(payload, calls, args);
        setImmediate(() => {
          child.emitData(Buffer.from(JSON.stringify(reply)));
          child.emitClose();
        });
      },
    };
    return child;
  };
  return { calls, spawnImpl };
}

function actualReadReply(content, extra = {}) {
  return {
    ok: true,
    result: {
      path: 'CREDENTIALS/Natally/credentials.env',
      doc_uuid: 'doc-uuid-1',
      source_type: 'admin-manual',
      revision: 4,
      head_revision: 4,
      content,
      exact: true,
      sha256: 'deadbeef',
      ...extra,
    },
  };
}

// ── Parsing ──────────────────────────────────────────────────────────────────

test('parseEnvironmentDocument retains comments, active names and quoted multiline values', () => {
  const text = [
    '# header note',
    'PLAIN="one"',
    '# mid note',
    'MULTI="line one',
    'line two"',
    'TRAILING=value # inline note',
  ].join('\n');
  const doc = parseEnvironmentDocument(text);
  assert.deepEqual(doc.names, ['PLAIN', 'MULTI', 'TRAILING']);
  assert.equal(doc.valueMap.MULTI, 'line one\nline two');
  assert.equal(doc.comments.length, 2);
  assert.equal(doc.entries[1].raw.join('\n'), 'MULTI="line one\nline two"');
});

test('parseEnvironmentDocument supports the util.parseEnv grammar: export, indentation, spaces around =', () => {
  const text = [
    '   # indented comment',
    '  EXPORTED = "spaced value"',
    '\texport SECOND="two"',
    'MULTI=  "first',
    'second"  # trailing annotation',
    "SINGLE='it is here'",
  ].join('\n');
  const doc = parseEnvironmentDocument(text);
  assert.deepEqual(doc.names, ['EXPORTED', 'SECOND', 'MULTI', 'SINGLE']);
  assert.equal(doc.valueMap.EXPORTED, 'spaced value');
  assert.equal(doc.valueMap.SECOND, 'two');
  assert.equal(doc.valueMap.MULTI, 'first\nsecond');
  assert.equal(doc.valueMap.SINGLE, 'it is here');
  const multi = doc.entries.find((e) => e.name === 'MULTI');
  assert.equal(multi.inlineComment, '# trailing annotation');
  assert.equal(parseEnv(text).MULTI, 'first\nsecond');
});

test('parseEnvironmentDocument annotation sets', () => {
  const doc = parseEnvironmentDocument('# @credential A_KEY\n# @public VITE_THING\nA_KEY=""\nVITE_THING="x"');
  assert.ok(doc.annotations.credential.has('A_KEY'));
  assert.ok(doc.annotations.public.has('VITE_THING'));
});

test('serializeAssignment round-trips mixed quotes and multiline through parseEnv', () => {
  const tricky = 'a\nb "quoted" and \'single\' with kstore://x/y#Z tail';
  const line = serializeAssignment('NAME', tricky);
  assert.equal(parseEnv(line).NAME, tricky);
  assert.equal(parseEnv(serializeAssignment('N2', '')).N2, '');
  assert.equal(parseEnv(serializeAssignment('N3', 'kstore://admin-manual/a/b#c')).N3, 'kstore://admin-manual/a/b#c');
});

// ── Synchronization ──────────────────────────────────────────────────────────

test('synchronizeEnvironment keeps template comments, applies live values, appends annotated supplemental section', () => {
  const local = 'EXTRA_LOCAL_ONLY="lv"\n';
  const env = liveEnv() + '\n# extra live note\nLIVE_ONLY_NAME="live"\n';
  const synced = synchronizeEnvironment({ template: TEMPLATE, environment: env, local });
  const doc = parseEnvironmentDocument(synced);
  assert.equal(doc.valueMap.OPENROUTER_ADMIN_KEY, SECRET);
  assert.equal(doc.valueMap.VITE_NATALLY_VOICE, 'F4');
  assert.ok(doc.comments.some((c) => c.text === '# extra live note'), 'extra live comment preserved');
  assert.ok(/LIVE_ONLY_NAME=("live"|live)\s*$/m.test(synced), 'live-only supplemental entry serialized');
  assert.ok(synced.includes('# LIVE_ONLY_NAME: origin existing .env value.'));
  for (const line of TEMPLATE.split('\n')) {
    if (line.startsWith('#')) assert.ok(synced.includes(line), `template comment kept: ${line}`);
  }
});

test('synchronizeEnvironment writes local-only names as active annotated assignments and keeps .env.local effective', async () => {
  const local = 'EXTRA_LOCAL_ONLY="lv"\n';
  const env = liveEnv();
  const synced = synchronizeEnvironment({ template: TEMPLATE, environment: env, local });
  assert.ok(/^EXTRA_LOCAL_ONLY=""$/m.test(synced), 'active annotated assignment present');
  assert.ok(synced.includes('# EXTRA_LOCAL_ONLY: origin .env.local.'));
  const merged = parseEnv(synced + '\n' + local);
  assert.equal(merged.EXTRA_LOCAL_ONLY, 'lv', 'local override remains effective at resolve time');
});

test('synchronizeEnvironment keeps differing local override physically in .env.local and honors it during resolve', async () => {
  const env = TEMPLATE.replace('VITE_NATALLY_VOICE="F4"', 'VITE_NATALLY_VOICE="M1"');
  const local = 'VITE_NATALLY_VOICE="F2"\n';
  fixture({ '.env.example': TEMPLATE, '.env': env, '.env.local': local });
  const state = fakeClientState();
  const resolved = await resolveEnvironment({ root: dir, client: state.client });
  assert.equal(resolved.environment.VITE_NATALLY_VOICE, 'F2');
});

test('synchronizeEnvironment preserves live values for keys that also exist locally', () => {
  const env = liveEnv();
  const local = 'OPENROUTER_BASE_URL="https://mirror.example"\n';
  const synced = synchronizeEnvironment({ template: TEMPLATE, environment: env, local });
  assert.equal(parseEnv(synced).OPENROUTER_BASE_URL, 'https://openrouter.ai/api/v1');
});

test('synchronizeEnvironment is byte-idempotent including local-only and multiline supplemental entries', () => {
  const env = liveEnv() + '\n# extra live note\nLIVE_ONLY_NAME="multi\nline \\"value\\" tail"\n';
  const local = 'EXTRA_LOCAL_ONLY="lv"\nANOTHER_LOCAL="x y z"\n';
  const once = synchronizeEnvironment({ template: TEMPLATE, environment: env, local });
  const twice = synchronizeEnvironment({ template: TEMPLATE, environment: once, local });
  const thrice = synchronizeEnvironment({ template: TEMPLATE, environment: twice, local });
  assert.equal(once, twice);
  assert.equal(twice, thrice);
  assert.ok((once.match(/Supplemental environment entries/g) ?? []).length === 1, 'generated comment not repeated');
  assert.ok((once.match(/# extra live note/g) ?? []).length === 1, 'carried comment not repeated');
});

test('multiline values round-trip through synchronize and parseEnv', () => {
  const multiline = 'first\nsecond "quoted"\nthird';
  const env = liveEnv().replace(
    'VITE_REVENUECAT_CONVERSATION_PACKS_JSON=""',
    `VITE_REVENUECAT_CONVERSATION_PACKS_JSON='${multiline}'`,
  );
  const synced = synchronizeEnvironment({ template: TEMPLATE, environment: env, local: '' });
  assert.equal(parseEnv(synced).VITE_REVENUECAT_CONVERSATION_PACKS_JSON, multiline);
  const resynced = synchronizeEnvironment({ template: TEMPLATE, environment: synced, local: '' });
  assert.equal(resynced, synced);
});

test('synchronizeEnvironment retains inline annotations when replacing assignment values', () => {
  const tpl = '# note\nFOO="1" # keep me\nBAR="x"\n';
  const env = '# note\nFOO="2" # keep me\nBAR="y"\n';
  const synced = synchronizeEnvironment({ template: tpl, environment: env, local: '' });
  assert.ok(/FOO=.?2.? # keep me/.test(synced), 'inline comment retained on replacement');
});

test('synchronizeEnvironment rejects an empty or missing template', () => {
  assert.throws(() => synchronizeEnvironment({ template: '', environment: 'A=1\n', local: '' }), /template/);
  assert.throws(() => synchronizeEnvironment({ template: '# only comments\n', environment: 'A=1\n', local: '' }), /template/);
});

// ── Checking ─────────────────────────────────────────────────────────────────

test('checkEnvironment rejects bare files and an empty or missing template', () => {
  const result = checkEnvironment({ template: TEMPLATE, environment: 'APP_NAME=""\n', local: '' });
  assert.ok(result.findings.some((f) => f.startsWith('bare-file')));
  assert.ok(result.findings.some((f) => f.startsWith('missing-template-annotation')));
  const noTemplate = checkEnvironment({ template: '', environment: 'A=1\n', local: '' });
  assert.ok(noTemplate.findings.some((f) => f.startsWith('missing-template')));
});

test('checkEnvironment rejects fabricated and literal credential values by name', () => {
  const bad = TEMPLATE
    .replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="MY_GEMINI_API_KEY"')
    .replace('VENICE_API_KEY=""', 'VENICE_API_KEY="VENICE_INFERENCE_KEY_"')
    .replace('VITE_REVENUECAT_PUBLIC_KEY=""', 'VITE_REVENUECAT_PUBLIC_KEY="goog_real_pub"')
    .replace('VITE_DOWNLOAD_ACCESS_API_URL', 'VITE_X_PLACEHOLDER');
  const result = checkEnvironment({ template: TEMPLATE, environment: bad, local: '' });
  assert.ok(result.findings.some((f) => f.includes('GEMINI_API_KEY') && f.includes('fabricated')));
  assert.ok(result.findings.some((f) => f.includes('VENICE_API_KEY') && f.includes('fabricated')));
  assert.ok(result.findings.some((f) => f.startsWith('literal-credential: VITE_REVENUECAT_PUBLIC_KEY')));
});

test('fabricated OpenRouter marker is only the exact bare sk-or-v1- placeholder', () => {
  const exact = checkEnvironment({
    template: TEMPLATE,
    environment: TEMPLATE.replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="sk-or-v1-"'),
    local: '',
  });
  assert.ok(exact.findings.some((f) => f.startsWith('fabricated-openrouter-literal: GEMINI_API_KEY')));
  const prefixed = checkEnvironment({
    template: TEMPLATE,
    environment: TEMPLATE.replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="sk-or-v1-7f3arealtoken"'),
    local: '',
  });
  assert.ok(!prefixed.findings.some((f) => f.startsWith('fabricated-openrouter-literal')),
    'real keys legitimately start with the OpenRouter prefix');
});

test('ANDROID_KEY_ALIAS is public metadata, not a credential', () => {
  const env = TEMPLATE.replace('ANDROID_KEY_ALIAS=""', 'ANDROID_KEY_ALIAS="natally-release"');
  const result = checkEnvironment({ template: TEMPLATE, environment: env, local: '' });
  assert.ok(!result.findings.some((f) => f.includes('ANDROID_KEY_ALIAS')), JSON.stringify(result.findings));
});

test('credential-bearing database URLs remain credentials without any annotation', () => {
  const result = checkEnvironment({
    template: TEMPLATE,
    environment: TEMPLATE.replace('BILLING_DATABASE_URL=""', 'BILLING_DATABASE_URL="postgres://user:pw@host/db"'),
    local: '',
  });
  assert.ok(result.findings.some((f) => f.startsWith('literal-credential: BILLING_DATABASE_URL')));
});

test('checkEnvironment inspects .env and .env.local independently; a local pointer cannot hide a literal .env', () => {
  const result = checkEnvironment({
    template: TEMPLATE,
    environment: TEMPLATE.replace('GEMINI_API_KEY=""', `GEMINI_API_KEY="${GEMINI}"`),
    local: 'GEMINI_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GEMINI_API_KEY"\n',
  });
  assert.ok(result.findings.some((f) => f.startsWith('literal-credential: GEMINI_API_KEY')),
    'literal in .env flagged even though .env.local holds a pointer');
  const localLiteral = checkEnvironment({
    template: TEMPLATE,
    environment: pointerEnv(),
    local: `SURGE_TOKEN="surge-token-literal"\n`,
  });
  assert.ok(localLiteral.findings.some((f) => f.startsWith('literal-credential: SURGE_TOKEN')),
    'literal in .env.local flagged independently');
});

test('checkEnvironment rejects malformed pointers and coordinator controls in either file', () => {
  const result = checkEnvironment({
    template: TEMPLATE,
    environment: TEMPLATE
      .replace('SURGE_TOKEN=""', 'SURGE_TOKEN="kstore://admin-manual/../etc#X"')
      .replace('APP_URL=""', 'APP_URL="kstore://admin-manual/doc#FRAG?q=1"'),
    local: 'RELEASE_SOURCE_COMMIT="r1"\nBROKEN_POINTER="kstore://user@host/doc#F"\n',
  });
  assert.ok(result.findings.some((f) => f.startsWith('invalid-pointer: SURGE_TOKEN')));
  assert.ok(result.findings.some((f) => f.startsWith('invalid-pointer: APP_URL')));
  assert.ok(result.findings.some((f) => f.startsWith('invalid-pointer: BROKEN_POINTER')));
  assert.ok(result.findings.some((f) => f.includes('coordinator-owned-assignment: RELEASE_SOURCE_COMMIT')));
});

test('checkEnvironment requires @public annotation and an active template declaration for VITE names', () => {
  const annotatedEnv = TEMPLATE.replace('VITE_NATALLY_VOICE="F4"', 'VITE_NATALLY_VOICE="F4"\nVITE_EXTRA_PUBLIC="1"');
  const missing = checkEnvironment({ template: TEMPLATE, environment: annotatedEnv, local: '' });
  assert.ok(missing.findings.some((f) => f.startsWith('undeclared-vite: VITE_EXTRA_PUBLIC')));
  const stripped = TEMPLATE.replace('# @public VITE_NATALLY_VOICE\n', '');
  const unannotated = checkEnvironment({ template: stripped, environment: TEMPLATE, local: '' });
  assert.ok(unannotated.findings.some((f) => f.startsWith('vite-public-annotation-missing: VITE_NATALLY_VOICE')));
});

test('checkEnvironment rejects private credentials approved for public projection', () => {
  const bad = TEMPLATE
    .replace('# @credential SURGE_TOKEN\nSURGE_TOKEN=""', '# @credential SURGE_TOKEN\n# @public SURGE_TOKEN\nSURGE_TOKEN=""');
  const result = checkEnvironment({ template: bad, environment: bad, local: '' });
  assert.ok(result.findings.some((f) => f.startsWith('private-public-annotation: SURGE_TOKEN')));
});

test('checkEnvironment accepts the annotated template as .env with pointers, and supplemental origin annotations', () => {
  const result = checkEnvironment({ template: TEMPLATE, environment: pointerEnv(), local: '' });
  assert.deepEqual(result.findings, [], JSON.stringify(result.findings));
  const withSupplemental = checkEnvironment({
    template: TEMPLATE,
    environment: pointerEnv() + '\nLIVE_ONLY_NAME="live"\n',
    local: '',
  });
  assert.ok(withSupplemental.findings.some((f) => f.startsWith('unannotated-supplemental: LIVE_ONLY_NAME')));
  const annotated = checkEnvironment({
    template: TEMPLATE,
    environment: synchronizeEnvironment({
      template: TEMPLATE, environment: pointerEnv() + '\nLIVE_ONLY_NAME="live"\n', local: '',
    }),
    local: '',
  });
  assert.deepEqual(annotated.findings, [], JSON.stringify(annotated.findings));
});

test('parseCredentialReference accepts only exact admin-manual pointers and fails with the binding name', () => {
  const ok = parseCredentialReference(ADMIN_POINTER, 'OPENROUTER_ADMIN_KEY');
  assert.equal(ok.path, 'CREDENTIALS/OpenRouter/credentials.env');
  assert.equal(ok.fragment, 'OPENROUTER_ADMIN_KEY');
  for (const bad of [
    'kstore://user@host/admin-manual/doc#FRAG',
    'kstore://admin-manual/../doc#FRAG',
    'kstore://admin-manual/doc#FRAG?x=1',
    'kstore://admin-manual/doc#nested frag',
    'sk-or-v1-literal',
  ]) {
    assert.throws(() => parseCredentialReference(bad, 'SOME_BINDING'), /SOME_BINDING/);
  }
});

// ── KStore adapter ───────────────────────────────────────────────────────────

test('createKStoreClient uses sys.path module import and honors the real read_document result shape', async () => {
  const { spawnImpl } = pythonDouble(() => actualReadReply('NAME="v"\n'));
  const client = createKStoreClient({ spawnImpl });
  const result = await client.read_document('CREDENTIALS/Natally/credentials.env');
  assert.equal(result.content, 'NAME="v"\n');
  assert.equal(result.revision, 4);
  assert.equal(result.headRevision, 4);
  assert.equal(result.exact, true);

  const second = pythonDouble(() => actualReadReply('x'));
  await createKStoreClient({ spawnImpl: second.spawnImpl }).read_document('CREDENTIALS/Natally/credentials.env');
  const invocation = second.calls[0];
  assert.equal(invocation.cmd, 'wsl.exe');
  assert.ok(invocation.args.includes('-d') && invocation.args.includes('Ubuntu-24.04'));
  const driver = invocation.args[invocation.args.indexOf('-c') + 1];
  assert.match(driver, /sys\.path\.insert\(0, sys\.argv\[1\]\)/);
  assert.match(driver, /from kstore_client import KStoreClient/);
  assert.doesNotMatch(driver, /spec_from_file_location/);
  assert.doesNotMatch(driver, /last_revision/);
  assert.equal(invocation.args[invocation.args.length - 1], '/home/robin/.local/share/kstore-client/current');
});

test('createKStoreClient rejects inexact reads and treats only HTTP 404 as missing', async () => {
  const inexact = pythonDouble(() => actualReadReply('NAME="v"\n', { exact: false }));
  const inexactClient = createKStoreClient({ spawnImpl: inexact.spawnImpl });
  await assert.rejects(
    () => inexactClient.read_document('CREDENTIALS/Natally/credentials.env'),
    /inexact/,
  );

  const missing = pythonDouble(() => ({ ok: false, error_kind: 'HTTPError', http_code: 404, not_found: true }));
  const missingClient = createKStoreClient({ spawnImpl: missing.spawnImpl });
  await assert.rejects(
    () => missingClient.read_document('CREDENTIALS/Natally/credentials.env'),
    (e) => e.code === 'KSTORE_NOT_FOUND',
  );

  const transport = pythonDouble(() => ({ ok: false, error_kind: 'HTTPError', http_code: 503, not_found: false }));
  const transportClient = createKStoreClient({ spawnImpl: transport.spawnImpl });
  await assert.rejects(
    () => transportClient.read_document('CREDENTIALS/Natally/credentials.env'),
    (e) => e.code !== 'KSTORE_NOT_FOUND' && /HTTPError/.test(e.message),
    'transport failures must propagate, never masquerade as missing documents',
  );
});

test('write_with_exact_readback demands exact true and identical bytes', async () => {
  const content = 'NAME="v"\n';
  const good = pythonDouble((payload) => (payload.op === 'write'
    ? { ok: true, result: null }
    : actualReadReply(content)));
  const goodClient = createKStoreClient({ spawnImpl: good.spawnImpl });
  await goodClient.write_with_exact_readback('CREDENTIALS/Natally/credentials.env', content, {});
  assert.deepEqual(good.calls.map((c) => c.payload.op), ['write', 'read']);

  const bad = pythonDouble((payload) => (payload.op === 'write'
    ? { ok: true, result: null }
    : actualReadReply('DIFFERENT')));
  const badClient = createKStoreClient({ spawnImpl: bad.spawnImpl });
  await assert.rejects(
    () => badClient.write_with_exact_readback('CREDENTIALS/Natally/credentials.env', content, {}),
    /readback/,
  );

  const inexact = pythonDouble((payload) => (payload.op === 'write'
    ? { ok: true, result: null }
    : actualReadReply(content, { exact: false })));
  const inexactClient = createKStoreClient({ spawnImpl: inexact.spawnImpl });
  await assert.rejects(
    () => inexactClient.write_with_exact_readback('CREDENTIALS/Natally/credentials.env', content, {}),
    /inexact|readback/,
  );
});

test('createKStoreClient sanitizes child stderr from errors', async () => {
  const spawnImpl = () => ({
    stdout: { on: () => {} },
    stderr: { on: (ev, cb) => { if (ev === 'data') setImmediate(() => cb(Buffer.from('SECRET-VALUE-LEAK'))); } },
    stdin: { end: () => {} },
    on: (ev, cb) => { if (ev === 'close') setImmediate(() => cb(1)); },
  });
  const client = createKStoreClient({ spawnImpl });
  await assert.rejects(
    () => client.read_document('CREDENTIALS/Natally/credentials.env'),
    (e) => !e.message.includes('SECRET-VALUE-LEAK') && /exit code 1/.test(e.message),
  );
});

// ── WSL recovery ─────────────────────────────────────────────────────────────

test('recoverShellCredentials invokes a fixed whitelist Python probe, never a blanket env dump', async () => {
  const reply = JSON.stringify({
    GEMINI_API_KEY: GEMINI,
    GOOGLE_API_KEY: '',
    OPENROUTER_ADMIN_KEY: SECRET,
    OPENROUTER_API_KEY: TOOLING,
  });
  const seen = { args: null };
  const spawnImpl = (cmd, args) => {
    seen.args = args;
    return {
      stdout: { on: (ev, cb) => { if (ev === 'data') setImmediate(() => cb(Buffer.from(reply))); } },
      stderr: { on: () => {} },
      stdin: { end: () => {} },
      on: (ev, cb) => { if (ev === 'close') setImmediate(() => cb(0)); },
    };
  };
  const recovered = await recoverShellCredentials({ spawnImpl });
  assert.deepEqual(Object.keys(recovered).sort(), ['GEMINI_API_KEY', 'OPENROUTER_ADMIN_KEY', 'OPENROUTER_API_KEY']);
  assert.equal(recovered.OPENROUTER_API_KEY, TOOLING);

  const icIdx = seen.args.indexOf('-ic');
  const command = seen.args[icIdx + 1];
  assert.ok(icIdx !== -1, 'bash -ic interactive route');
  for (const name of ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'OPENROUTER_ADMIN_KEY', 'OPENROUTER_API_KEY']) {
    assert.ok(command.includes(name), `whitelisted name ${name} declared in the probe`);
  }
  assert.ok(!/\benv\b/.test(command) && !command.includes('printenv'),
    'no blanket environment harvest command');
  assert.ok(!JSON.stringify(seen.args).includes(SECRET) && !JSON.stringify(seen.args).includes(TOOLING),
    'values never appear in argv');
  assert.ok(seen.args.includes('-d') && seen.args.includes('Ubuntu-24.04'));
});

// ── Resolution ───────────────────────────────────────────────────────────────

test('resolveEnvironment checks configuration first and refuses before resolving when findings exist', async () => {
  fixture({
    '.env.example': TEMPLATE,
    '.env': TEMPLATE.replace('OPENROUTER_ADMIN_KEY=""', `OPENROUTER_ADMIN_KEY="${SECRET}"`),
  });
  let reads = 0;
  const client = {
    async read_document() { reads += 1; return { content: '', revision: 1, exact: true }; },
  };
  await assert.rejects(
    () => resolveEnvironment({ root: dir, client }),
    (e) => /literal-credential: OPENROUTER_ADMIN_KEY/.test(e.message),
  );
  assert.equal(reads, 0, 'no provider calls before a passing check');
});

test('resolveEnvironment resolves pointers freshly per invocation and returns named references without values', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': pointerEnv() });
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': '# canonical\nOPENROUTER_ADMIN_KEY="rev1-value"\nOPENROUTER_API_KEY="rev2-value"\n',
    'CREDENTIALS/GoogleAI/credentials.env': 'GEMINI_API_KEY="gem-resolved"\n',
  });
  const result = await resolveEnvironment({ root: dir, client: state.client });
  assert.equal(result.environment.OPENROUTER_ADMIN_KEY, 'rev1-value');
  assert.equal(result.environment.GEMINI_API_KEY, 'gem-resolved');
  assert.ok(result.references.some((r) => r.name === 'OPENROUTER_ADMIN_KEY' && r.fragment === 'OPENROUTER_ADMIN_KEY'));
  for (const r of result.references) assert.ok(!JSON.stringify(r).includes('rev1-value'));
  assert.equal(result.publicEnvironment.VITE_NATALLY_VOICE, 'F4');
  assert.ok(!('OPENROUTER_ADMIN_KEY' in result.publicEnvironment));
  assert.ok(!('SURGE_TOKEN' in result.publicEnvironment));
});

test('resolveEnvironment fails by binding name on missing document, empty fragment and nested references', async () => {
  const state = fakeClientState({
    'CREDENTIALS/GoogleAI/credentials.env': 'GEMINI_API_KEY=""\nGOOGLE_API_KEY="kstore://admin-manual/other#X"\n',
  });
  const empty = TEMPLATE
    .replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GEMINI_API_KEY"');
  const nested = TEMPLATE
    .replace('GOOGLE_API_KEY=""', 'GOOGLE_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GOOGLE_API_KEY"');
  const missing = TEMPLATE
    .replace('SURGE_TOKEN=""', 'SURGE_TOKEN="kstore://admin-manual/CREDENTIALS/Natally/credentials.env#SURGE_TOKEN"');
  fixture({ '.env.example': TEMPLATE, '.env': empty });
  await assert.rejects(
    () => resolveEnvironment({ root: dir, client: state.client }),
    (e) => /GEMINI_API_KEY/.test(e.message) && /missing or empty/.test(e.message),
  );
  writeFileSync(join(dir, '.env'), nested);
  await assert.rejects(
    () => resolveEnvironment({ root: dir, client: state.client }),
    (e) => /GOOGLE_API_KEY/.test(e.message) && /nested/.test(e.message),
  );
  writeFileSync(join(dir, '.env'), missing);
  await assert.rejects(
    () => resolveEnvironment({ root: dir, client: state.client }),
    (e) => /SURGE_TOKEN/.test(e.message),
  );
});

test('resolveEnvironment caches documents only within the invocation', async () => {
  fixture({
    '.env.example': TEMPLATE,
    '.env': TEMPLATE
      .replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GEMINI_API_KEY"')
      .replace('GOOGLE_API_KEY=""', 'GOOGLE_API_KEY="kstore://admin-manual/CREDENTIALS/GoogleAI/credentials.env#GOOGLE_API_KEY"'),
  });
  const state = fakeClientState({
    'CREDENTIALS/GoogleAI/credentials.env': 'GEMINI_API_KEY="g1"\nGOOGLE_API_KEY="g2"\n',
  });
  const r = await resolveEnvironment({ root: dir, client: state.client });
  assert.equal(r.environment.GEMINI_API_KEY, 'g1');
  assert.equal(r.environment.GOOGLE_API_KEY, 'g2');
  const reads = state.calls.filter((c) => c[0] === 'read');
  assert.equal(reads.length, 1, 'one document read per invocation for two fragments');
});

// ── Migration ────────────────────────────────────────────────────────────────

function writeWorkingCopy() {
  fixture({
    '.env.example': TEMPLATE,
    '.env': liveEnv(),
    '.env.local': 'VITE_NATALLY_VOICE="F2"\nNATALLY_DEV_OPENROUTER_KEY="dev-local-key-1"\n',
    'CREDENTIALS/OpenRouter/credentials.env': [
      '# OpenRouter canonical credentials (annotated).',
      '# OPENROUTER_ADMIN_KEY: validated against GET /api/v1/keys.',
      `OPENROUTER_ADMIN_KEY="${SECRET}"`,
      '',
    ].join('\n'),
  });
}

test('migrateEnvironmentCredentials checkpoints, extends annotated docs, replaces literals with pointers, is idempotent, and emits no values', async () => {
  writeWorkingCopy();
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': [
      '# OpenRouter canonical credentials (annotated).',
      '# OPENROUTER_ADMIN_KEY: validated against GET /api/v1/keys.',
      `OPENROUTER_ADMIN_KEY="${SECRET}"`,
      '',
    ].join('\n'),
  });
  const outputs = [];
  const capture = (s) => { outputs.push(s); };
  const deps = {
    write: capture,
    writeError: capture,
    createClient: () => state.client,
    createRecover: () => async () => ({ GEMINI_API_KEY: GEMINI, GOOGLE_API_KEY: '', OPENROUTER_ADMIN_KEY: SECRET, OPENROUTER_API_KEY: TOOLING }),
  };

  const first = await migrateEnvironmentCredentials({ root: dir, client: state.client, recover: deps.createRecover() });
  await runCli(['check', '--root', dir], { ...deps, isTTY: false });
  assert.ok(first.checkpoints.length >= 1);

  const openRouterDoc = state.docs.get('CREDENTIALS/OpenRouter/credentials.env');
  assert.ok(openRouterDoc.startsWith('# OpenRouter canonical credentials (annotated).'), 'existing annotations preserved');
  assert.ok(openRouterDoc.includes(SECRET), 'existing validated fragment preserved');
  assert.ok(openRouterDoc.includes('OPENROUTER_API_KEY='), 'tooling key appended');
  assert.equal(parseEnv(state.docs.get('CREDENTIALS/GoogleAI/credentials.env')).GEMINI_API_KEY, GEMINI);
  assert.ok(state.docs.get('CREDENTIALS/Natally/credentials.env').includes('NATALLY_DEV_OPENROUTER_KEY_LOCAL='));

  const envNow = readFileSync(join(dir, '.env'), 'utf8');
  assert.ok(envNow.includes(ADMIN_POINTER), 'admin binding now a pointer');
  assert.ok(!envNow.includes(SECRET), 'literal secret removed from .env');
  assert.ok(!envNow.includes(GEMINI));
  assert.equal(parseEnv(envNow).VITE_NATALLY_VOICE, 'F4', 'template value kept where live unset');
  const localNow = readFileSync(join(dir, '.env.local'), 'utf8');
  assert.ok(localNow.includes('VITE_NATALLY_VOICE="F2"'), 'differing local override kept physically');
  assert.ok(localNow.includes('kstore://admin-manual/CREDENTIALS/Natally/credentials.env#NATALLY_DEV_OPENROUTER_KEY_LOCAL'), 'distinct local credential as NAME_LOCAL pointer');
  assert.ok(!localNow.includes('dev-local-key-1'));

  assert.equal(
    state.docs.get('CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env'),
    liveEnv(),
    'exact pre-edit .env checkpointed',
  );
  assert.equal(
    state.docs.get('CREDENTIALS/Natally/env-local-before-annotated-sync-29oct2026.env'),
    'VITE_NATALLY_VOICE="F2"\nNATALLY_DEV_OPENROUTER_KEY="dev-local-key-1"\n',
    'exact pre-edit .env.local checkpointed',
  );

  const envSnapshot = readFileSync(join(dir, '.env'), 'utf8');
  const writesBefore = state.calls.filter((c) => c[0] === 'write').length;
  const second = await migrateEnvironmentCredentials({ root: dir, client: state.client, recover: deps.createRecover() });
  assert.equal(readFileSync(join(dir, '.env'), 'utf8'), envSnapshot, 'migration is byte-idempotent');
  assert.deepEqual(second.migrated, [], 'second run migrates nothing new');
  assert.equal(state.calls.filter((c) => c[0] === 'write').length, writesBefore, 'second run performs no writes');

  const allOutput = outputs.join('');
  for (const secretish of [SECRET, TOOLING, GEMINI, 'dev-local-key-1']) {
    assert.ok(!allOutput.includes(secretish), 'no credential value in output');
  }
  assert.ok(existsSync(join(dir, '.env')));
});

test('migrateEnvironmentCredentials replaces every existing EMPTY assignment instead of appending duplicates', async () => {
  const duplicated = liveEnv() + 'OPENROUTER_API_KEY=""\n';
  fixture({
    '.env.example': TEMPLATE,
    '.env': duplicated,
  });
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="${SECRET}"\n`,
  });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client,
    recover: async () => ({ OPENROUTER_API_KEY: TOOLING }),
  });
  const envNow = readFileSync(join(dir, '.env'), 'utf8');
  const occurrences = envNow.match(/^OPENROUTER_API_KEY=/gm) ?? [];
  assert.equal(occurrences.length, 1, 'duplicates collapsed into one pointer assignment');
  assert.ok(envNow.includes('kstore://admin-manual/CREDENTIALS/OpenRouter/credentials.env#OPENROUTER_API_KEY'));
  const synced = readFileSync(join(dir, '.env'), 'utf8');
  assert.equal(synchronizeEnvironment({ template: TEMPLATE, environment: synced, local: '' }), synced,
    'pointer-bearing result still syncs byte-identically');
});

test('migrateEnvironmentCredentials appends to canonical docs without rewriting the existing prefix', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': liveEnv() });
  const original = `# head\nOPENROUTER_ADMIN_KEY="${SECRET}"`;
  const state = fakeClientState({ 'CREDENTIALS/OpenRouter/credentials.env': original });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client, recover: async () => ({}),
  });
  const updated = state.docs.get('CREDENTIALS/OpenRouter/credentials.env');
  assert.ok(updated.startsWith(original), 'prior prefix byte-preserved, no trailing-trim rewrite');
  assert.equal(parseEnv(updated).OPENROUTER_API_KEY, TOOLING);
});

test('migrateEnvironmentCredentials never overwrites an existing differing first checkpoint', async () => {
  writeWorkingCopy();
  const preExisting = '# FIRST CHECKPOINT FROM AN EARLIER RUN\nOLD=1\n';
  const state = fakeClientState({
    'CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env': preExisting,
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="${SECRET}"\n`,
  });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client,
    recover: async () => ({}),
  });
  assert.equal(state.docs.get('CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env'), preExisting);
});

test('migrateEnvironmentCredentials preserves an existing EMPTY checkpoint as the first checkpoint', async () => {
  writeWorkingCopy();
  const state = fakeClientState({
    'CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env': '',
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="${SECRET}"\n`,
  });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client,
    recover: async () => ({}),
  });
  assert.equal(
    state.docs.get('CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env'),
    '',
    'the existing empty checkpoint is preserved, never overwritten',
  );
});

test('migrateEnvironmentCredentials fails with zero writes on transport or inexact canonical read errors', async () => {
  writeWorkingCopy();
  const docs = new Map([
    ['CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env', null],
  ]);
  let writes = 0;
  const failing = {
    async read_document(path) {
      const err = new Error('simulated transport failure');
      throw err;
    },
    async write_document() { writes += 1; throw new Error('must not write'); },
    async write_with_exact_readback() { writes += 1; throw new Error('must not write'); },
  };
  await assert.rejects(
    () => migrateEnvironmentCredentials({ root: dir, client: failing, recover: async () => ({}) }),
    /aborted before any write/,
  );
  assert.equal(writes, 0, 'no checkpoint or credential writes on transport failure');
  assert.equal(readFileSync(join(dir, '.env'), 'utf8'), liveEnv(), '.env unmutated');
  assert.equal(docs.size, 1);

  const inexact = {
    async read_document() {
      return { content: 'partial', revision: 1, exact: false };
    },
    async write_document() { writes += 1; throw new Error('must not write'); },
    async write_with_exact_readback() { writes += 1; throw new Error('must not write'); },
  };
  await assert.rejects(
    () => migrateEnvironmentCredentials({ root: dir, client: inexact, recover: async () => ({}) }),
    /aborted before any write/,
  );
  assert.equal(writes, 0, 'no writes on inexact canonical read');
});

test('migrateEnvironmentCredentials fails by binding name on canonical conflict, before env mutation', async () => {
  writeWorkingCopy();
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="different-existing-value"\n`,
  });
  const envBeforeBytes = readFileSync(join(dir, '.env'), 'utf8');
  await assert.rejects(
    () => migrateEnvironmentCredentials({ root: dir, client: state.client, recover: async () => ({}) }),
    (e) => /OPENROUTER_ADMIN_KEY/.test(e.message) && /conflict/i.test(e.message),
  );
  assert.equal(readFileSync(join(dir, '.env'), 'utf8'), envBeforeBytes, '.env unmutated on conflict');
  assert.ok(!state.docs.get('CREDENTIALS/OpenRouter/credentials.env').includes(TOOLING), 'originals preserved');
});

// ── Regression: check covers template and all kstore: prefix shapes ─────────

test('checkEnvironment flags a malformed kstore:/ pointer and a template literal hidden by an env pointer', () => {
  const result = checkEnvironment({
    template: '# Origin\nAPP_URL=""\n',
    environment: '# Origin\nAPP_URL="kstore:/bad#APP_URL"\n',
    local: '',
  });
  assert.ok(result.findings.some((f) => f.startsWith('invalid-pointer: APP_URL')),
    JSON.stringify(result.findings));
  const templateLiteral = '# Origin\n# @credential K_KEY\nK_KEY="literal-secret-value"\n';
  const hidden = checkEnvironment({
    template: templateLiteral,
    environment: '# Origin\nK_KEY="kstore://admin-manual/CREDENTIALS/Natally/credentials.env#K_KEY"\n',
    local: '',
  });
  assert.ok(hidden.findings.some((f) => f.startsWith('literal-credential: K_KEY')),
    'template literal credential must be rejected even when .env holds a pointer');
});

test('resolveEnvironment rejects an inexact read even from an injected client', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': pointerEnv() });
  const inexact = {
    async read_document() {
      return { content: 'OPENROUTER_ADMIN_KEY="x"\n', revision: 1, exact: false };
    },
  };
  await assert.rejects(
    () => resolveEnvironment({ root: dir, client: inexact }),
    (e) => /GEMINI_API_KEY/.test(e.message) && /unavailable/.test(e.message),
    'an inexact injected-client read must fail the bind, never yield values',
  );
});

// ── Regression: migration ordering and preservation guarantees ───────────────

test('migrateEnvironmentCredentials validates ALL canonical conflicts before the first canonical write', async () => {
  const env = liveEnv() + 'GEMINI_API_KEY=""\n'.replace('GEMINI_API_KEY=""', 'GEMINI_API_KEY="AIza-new-gemini-7"');
  fixture({ '.env.example': TEMPLATE, '.env': env });
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': 'OPENROUTER_ADMIN_KEY="conflicting-existing"\n',
  });
  await assert.rejects(
    () => migrateEnvironmentCredentials({ root: dir, client: state.client, recover: async () => ({}) }),
    /conflict/i,
  );
  const writes = state.calls.filter((c) => c[0] === 'write');
  assert.equal(writes.length, 0, 'no canonical writes when a later document conflicts');
  assert.ok(!state.docs.has('CREDENTIALS/GoogleAI/credentials.env'),
    'earlier-valid document was not written before the conflict was found');
});

test('migrateEnvironmentCredentials never rewrites an existing explicit local pointer', async () => {
  const localPointer = 'kstore://admin-manual/CREDENTIALS/OpenRouter/credentials.env#OPENROUTER_ADMIN_KEY';
  fixture({
    '.env.example': TEMPLATE,
    '.env': liveEnv(),
    '.env.local': `OPENROUTER_ADMIN_KEY="${localPointer}"\n`,
  });
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="${SECRET}"\n`,
  });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client, recover: async () => ({}),
  });
  const localNow = readFileSync(join(dir, '.env.local'), 'utf8');
  assert.ok(localNow.includes(localPointer), 'explicit local pointer preserved byte-for-byte');
  assert.ok(!localNow.includes('OPENROUTER_ADMIN_KEY_LOCAL'), 'no NAME_LOCAL fragment invented');
  assert.ok(!state.docs.get('CREDENTIALS/OpenRouter/credentials.env').includes('OPENROUTER_ADMIN_KEY_LOCAL'));
});

test('migrateEnvironmentCredentials aborts with zero writes when the synchronized result fails check', async () => {
  fixture({
    '.env.example': TEMPLATE,
    '.env': liveEnv(),
    '.env.local': 'VITE_UNDECLARED_BINDING="x"\n',
  });
  const state = fakeClientState();
  const envBefore = readFileSync(join(dir, '.env'), 'utf8');
  await assert.rejects(
    () => migrateEnvironmentCredentials({ root: dir, client: state.client, recover: async () => ({}) }),
    /failed check/,
  );
  assert.equal(state.calls.filter((c) => c[0] === 'write').length, 0, 'no writes of any kind');
  assert.equal(readFileSync(join(dir, '.env'), 'utf8'), envBefore, '.env unmutated');
});

test('migrateEnvironmentCredentials replaces an existing EMPTY canonical fragment in place', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': liveEnv() });
  const original = `# head note\nOPENROUTER_ADMIN_KEY="${SECRET}"\nOPENROUTER_API_KEY=""\n`;
  const state = fakeClientState({ 'CREDENTIALS/OpenRouter/credentials.env': original });
  await migrateEnvironmentCredentials({
    root: dir, client: state.client, recover: async () => ({}),
  });
  const updated = state.docs.get('CREDENTIALS/OpenRouter/credentials.env');
  assert.ok(updated.startsWith('# head note\n'), 'prior comments retained');
  assert.ok(updated.includes(`OPENROUTER_ADMIN_KEY="${SECRET}"`), 'unaffected bytes preserved');
  const occurrences = updated.match(/^OPENROUTER_API_KEY=/gm) ?? [];
  assert.equal(occurrences.length, 1, 'empty fragment replaced, not appended as duplicate');
  assert.equal(parseEnv(updated).OPENROUTER_API_KEY, TOOLING);
});

// ── Regression: scanEntry matches util.parseEnv quote semantics ──────────────

test('parseEnvironmentDocument valueMap equals parseEnv for backslash quotes and multiline plus next binding', () => {
  const backslash = 'A="a\\"b"\nB=2\n';
  assert.deepEqual(parseEnvironmentDocument(backslash).valueMap, parseEnv(backslash));
  const multiline = 'MULTI="first\nsecond" # kept note\nNEXT="after"\n';
  const doc = parseEnvironmentDocument(multiline);
  assert.deepEqual(doc.valueMap, parseEnv(multiline));
  assert.equal(doc.valueMap.NEXT, 'after', 'binding after multiline is not swallowed');
  assert.equal(doc.entries.find((e) => e.name === 'MULTI').inlineComment, '# kept note');
});


// ── CLI ──────────────────────────────────────────────────────────────────────

test('CLI: sync reconstructs .env without reducing it to a bare file; check reports names only', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': liveEnv() });
  let out = '';
  const deps = { write: (s) => { out += s; }, writeError: (s) => { out += s; }, isTTY: false };
  const codeSync = await runCli(['sync', '--root', dir], deps);
  assert.equal(codeSync, 0);
  const synced = readFileSync(join(dir, '.env'), 'utf8');
  assert.ok(synced.includes('# Direct browser inference uses the account user key'));
  assert.ok(synced.includes('OPENROUTER_ADMIN_KEY'));
  out = '';
  const codeCheck = await runCli(['check', '--root', dir], deps);
  assert.equal(codeCheck, 1, 'literal credentials make check fail');
  assert.ok(out.includes('literal-credential: OPENROUTER_ADMIN_KEY'));
  assert.ok(!out.includes(SECRET), 'check output carries no values');
});

test('CLI: resolve --json refuses a TTY before any call, then returns a plain environment map', async () => {
  fixture({ '.env.example': TEMPLATE, '.env': pointerEnv() });
  const state = fakeClientState({
    'CREDENTIALS/OpenRouter/credentials.env': `OPENROUTER_ADMIN_KEY="a"\nOPENROUTER_API_KEY="b"\n`,
    'CREDENTIALS/GoogleAI/credentials.env': 'GEMINI_API_KEY="c"\n',
  });
  let errOut = '';
  let out = '';
  const code = await runCli(['resolve', '--json', '--root', dir], {
    write: (s) => { out += s; },
    writeError: (s) => { errOut += s; },
    isTTY: true,
    createClient: () => { throw new Error('client must not be constructed for a TTY'); },
  });
  assert.equal(code, 1);
  assert.ok(/refuses a TTY/.test(errOut));
  assert.equal(state.calls.length, 0, 'no provider calls on TTY refusal');

  const code2 = await runCli(['resolve', '--json', '--root', dir], {
    write: (s) => { out += s; },
    writeError: (s) => { errOut += s; },
    isTTY: false,
    createClient: () => state.client,
  });
  assert.equal(code2, 0);
  const parsed = JSON.parse(out);
  assert.equal(typeof parsed, 'object');
  assert.ok(!('environment' in parsed) && !('publicEnvironment' in parsed), 'plain map, not nested');
  assert.equal(parsed.OPENROUTER_ADMIN_KEY, 'a');
  const files = readFileSync(join(dir, '.env'), 'utf8');
  assert.ok(!files.includes('"OPENROUTER_ADMIN_KEY"'), 'resolved map never persisted');
});

test('CLI: unknown command exits 2 with usage', async () => {
  let errOut = '';
  const code = await runCli(['bogus'], { write: () => {}, writeError: (s) => { errOut += s; } });
  assert.equal(code, 2);
  assert.ok(/usage/.test(errOut));
});

