#!/usr/bin/env node
// Annotated environment synchronization and contemporaneous credential
// resolution for the Natally AI Studio staging reconstruction.
// Dependency-free Node 24 helper.
// Contract and design record:
// DOCS/ARCHITECTURE/environment-resolution-2026-10-29.md

import { parseEnv } from 'node:util';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const WSL_DISTRO = 'Ubuntu-24.04';
const WSL_USER = 'robin';
const KSTORE_MODULE_DIR = '/home/robin/.local/share/kstore-client/current';
const TEMPLATE_NAME = '.env.example';
const ENV_NAME = '.env';
const LOCAL_NAME = '.env.local';
const CHECKPOINT_ENV = 'CREDENTIALS/Natally/env-before-annotated-sync-29oct2026.env';
const CHECKPOINT_LOCAL = 'CREDENTIALS/Natally/env-local-before-annotated-sync-29oct2026.env';
const DEFAULT_CREDENTIAL_DOC = 'CREDENTIALS/Natally/credentials.env';
const SUPPLEMENTAL_SENTINEL = '# ── Supplemental environment entries (generated; ordering preserved) ──';
const RECOVERED_NOTE = '# Recovered from Robin\'s interactive WSL environment (29 Oct 2026).';
const MIGRATED_NOTE = 'Migrated project credential (annotated sync, 29 Oct 2026).';

const COORDINATOR_OWNED = new Set([
  'NATALLY_RELEASE_ID', 'NATALLY_DEPLOY_COORDINATOR',
  'NATALLY_DEPLOY_INVENTORY', 'RELEASE_SOURCE_COMMIT',
]);

// Names the frontend is explicitly allowed to receive even though they are
// credential-bearing public SDK keys (RevenueCat only; Firebase's actual key
// is FIREBASE_API_KEY and stays private).
const PUBLIC_SDK_EXCEPTIONS = new Set([
  'VITE_REVENUECAT_PUBLIC_KEY',
  'VITE_REVENUECAT_ANDROID_PUBLIC_KEY',
]);

const CREDENTIAL_DOC_BY_NAME = {
  OPENROUTER_ADMIN_KEY: 'CREDENTIALS/OpenRouter/credentials.env',
  OPENROUTER_API_KEY: 'CREDENTIALS/OpenRouter/credentials.env',
  GEMINI_API_KEY: 'CREDENTIALS/GoogleAI/credentials.env',
  GOOGLE_API_KEY: 'CREDENTIALS/GoogleAI/credentials.env',
  VITE_REVENUECAT_PUBLIC_KEY: 'CREDENTIALS/RevenueCat/Natally/credentials.env',
  VITE_REVENUECAT_ANDROID_PUBLIC_KEY: 'CREDENTIALS/RevenueCat/Natally/credentials.env',
  REVENUECAT_SECRET_API_KEY: 'CREDENTIALS/RevenueCat/Natally/credentials.env',
};

const RECOVERABLE_WSL_KEYS = [
  'GEMINI_API_KEY', 'GOOGLE_API_KEY', 'OPENROUTER_ADMIN_KEY', 'OPENROUTER_API_KEY',
];

const CREDENTIAL_DESCRIPTIONS = {
  OPENROUTER_ADMIN_KEY: 'OpenRouter management admin key (billing provisioning only).',
  OPENROUTER_API_KEY: 'OpenRouter account user key (operator tooling).',
  GEMINI_API_KEY: 'Google Gemini API key.',
  GOOGLE_API_KEY: 'Google AI API key.',
  VITE_REVENUECAT_PUBLIC_KEY: 'RevenueCat public Web SDK key (public).',
  VITE_REVENUECAT_ANDROID_PUBLIC_KEY: 'RevenueCat public Android (Google Play) SDK key (public).',
  REVENUECAT_SECRET_API_KEY: 'RevenueCat secret server API key.',
  REVENUECAT_WEBHOOK_AUTH: 'RevenueCat webhook authorization token.',
  BILLING_KEY_ENCRYPTION_KEY: 'Billing key encryption key.',
  BILLING_DATABASE_URL: 'Credential-bearing billing database URL.',
  FIREBASE_SERVICE_ACCOUNT_JSON: 'Firebase service-account JSON (server-side only).',
  SURGE_TOKEN: 'Surge deployment token.',
  NATALLY_DEV_OPENROUTER_KEY: 'Development-account OpenRouter grant key.',
  VENICE_API_KEY: 'Venice.ai inference API key.',
  VENICE_ADMIN_KEY: 'Venice.ai admin key (reserved).',
  ANDROID_KEYSTORE_PASSWORD: 'Android keystore password.',
  ANDROID_KEY_PASSWORD: 'Android key password.',
  CUSTOM_LLM_API_KEY: 'Generic OpenAI-compatible endpoint API key.',
};

const FABRICATED_VALUE_PATTERNS = [
  { test: (v) => v === 'sk-or-v1-', kind: 'fabricated-openrouter-literal' },
  { test: (v) => v.startsWith('MY_'), kind: 'fabricated-my-placeholder' },
  { test: (v) => /^VENICE_[A-Z0-9_]*_KEY_/.test(v), kind: 'fabricated-venice-placeholder' },
  { test: (v) => v.includes('your-approved-api.example'), kind: 'fabricated-example-endpoint' },
];

export function isCredentialName(name, annotations) {
  if (annotations && annotations.credential instanceof Set && annotations.credential.has(name)) return true;
  return /(^|_)(KEY|SECRET|PASSWORD|TOKEN)$/.test(name)
    || /SERVICE_ACCOUNT|WEBHOOK_AUTH|DATABASE_URL|CREDENTIAL/.test(name);
}

function isPrivateCredentialName(name) {
  if (PUBLIC_SDK_EXCEPTIONS.has(name)) return false;
  return /API_KEY|ADMIN_KEY|SECRET|PASSWORD|SERVICE_ACCOUNT|TOKEN(?!S)|WEBHOOK_AUTH|ENCRYPTION_KEY|_KEY$/.test(name);
}

// ── Document parsing (span-aware, node:util.parseEnv grammar) ────────────────

const ASSIGN_RE = /^([ \t]*)(export[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*=(.*)$/;

// Scans the assignment whose first line is lines[start]; returns the span
// (start..end), the trailing inline comment (if any) and the value text with
// that comment removed, or null when the line does not begin an assignment.
function scanEntry(lines, start) {
  const line = lines[start].replace(/\r$/, '');
  const m = ASSIGN_RE.exec(line);
  if (!m) return null;
  const rest = m[4];
  const trimmedRest = rest.replace(/^[ \t]+/, '');
  const quote = (trimmedRest.startsWith('"') || trimmedRest.startsWith("'") || trimmedRest.startsWith('`'))
    ? trimmedRest[0] : null;
  let end = start;
  let inlineComment = null;
  let valueText = rest;
  if (!quote) {
    const idx = rest.search(/(^|[ \t])#/);
    if (idx !== -1) {
      inlineComment = rest.slice(idx).trim();
      valueText = rest.slice(0, idx).replace(/[ \t]+$/, '');
    }
  } else {
    let li = start;
    let s = rest;
    let pos = s.indexOf(quote) + 1;
    let closed = false;
    while (li < lines.length) {
      while (pos < s.length) {
        if (s[pos] === quote) { closed = true; break; }
        pos += 1;
      }
      if (closed) break;
      li += 1;
      if (li >= lines.length) break;
      s = lines[li];
      pos = 0;
    }
    end = li;
    valueText = rest;
    if (closed) {
      const after = s.slice(pos + 1);
      const t = after.trim();
      if (t.startsWith('#')) {
        inlineComment = t;
        if (li === start) valueText = s.slice(0, pos + 1);
      }
    }
  }
  return { name: m[3], indent: m[1], exportKw: m[2] ?? '', start, end, inlineComment, valueText };
}

function entryRawWithoutInlineComment(lines, entry) {
  const raw = lines.slice(entry.start, entry.end + 1).map((l) => l);
  if (entry.inlineComment && entry.end === entry.start) {
    raw[0] = entry.indent + (entry.exportKw || '') + entry.name + '=' + entry.valueText;
  } else if (entry.inlineComment) {
    const last = raw[raw.length - 1];
    const idx = last.lastIndexOf(entry.inlineComment);
    if (idx !== -1) raw[raw.length - 1] = last.slice(0, idx).replace(/[ \t]+$/, '');
  }
  return raw;
}

function entryValue(lines, entry) {
  const parsed = parseEnv(entryRawWithoutInlineComment(lines, entry).join('\n'));
  return parsed[entry.name];
}

export function parseEnvironmentDocument(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  const entries = [];
  const comments = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      if (line.trimStart().startsWith('#')) comments.push({ type: 'comment', text: line, line: i });
      i += 1;
      continue;
    }
    const entry = scanEntry(lines, i);
    if (!entry) { i += 1; continue; }
    entries.push({
      type: 'assignment',
      name: entry.name,
      value: entryValue(lines, entry),
      raw: lines.slice(entry.start, entry.end + 1),
      line: entry.start,
      end: entry.end,
      inlineComment: entry.inlineComment,
    });
    i = entry.end + 1;
  }
  const credential = new Set();
  const publik = new Set();
  for (const c of comments) {
    let a = /^#[ \t]*@credential[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]*$/.exec(c.text);
    if (a) credential.add(a[1]);
    a = /^#[ \t]*@public[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]*$/.exec(c.text);
    if (a) publik.add(a[1]);
  }
  return {
    entries,
    comments,
    names: entries.map((e) => e.name),
    valueMap: Object.fromEntries(entries.map((e) => [e.name, e.value])),
    annotations: { credential, public: publik },
  };
}

// Serializes an assignment choosing a safe unquoted form, double, single or
// backtick quoting, each validated by a node:util.parseEnv round trip. Fails
// with a named error (never the value) when the value is unrepresentable.
export function serializeAssignment(name, value) {
  const v = String(value);
  const candidates = [];
  if (v !== '' && /^[A-Za-z0-9_@/:.,+=-]+$/.test(v)) candidates.push(`${name}=${v}`);
  candidates.push(`${name}="${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
  if (!v.includes("'")) candidates.push(`${name}='${v}'`);
  candidates.push(`${name}=\`${v.replace(/`/g, '\\`')}\``);
  for (const candidate of candidates) {
    try {
      const parsed = parseEnv(candidate);
      if (parsed[name] === v) return candidate;
    } catch { /* try next candidate */ }
  }
  throw new Error(`environment serialization failed for ${name}: value is not representable`);
}

function firstLineWithInlineComment(entry, name, value) {
  const first = serializeAssignment(name, value);
  return entry.inlineComment ? `${first} ${entry.inlineComment}` : first;
}

function renderTemplate(tplText, valueFor) {
  const lines = tplText.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trimStart().startsWith('#')) { out.push(line); i += 1; continue; }
    const entry = scanEntry(lines, i);
    if (!entry) { out.push(line); i += 1; continue; }
    const override = valueFor(entry.name);
    if (override === null || override === undefined) out.push(...lines.slice(entry.start, entry.end + 1));
    else out.push(firstLineWithInlineComment(entry, entry.name, override));
    i = entry.end + 1;
  }
  return out.join('\n');
}

// ── Synchronization ──────────────────────────────────────────────────────────

export function synchronizeEnvironment({ template, environment, local }) {
  const tplText = String(template ?? '');
  const tpl = parseEnvironmentDocument(tplText);
  if (!tplText.trim() || tpl.entries.length === 0) {
    throw new Error('synchronize: template is empty, missing or has no active assignments');
  }
  const env = parseEnvironmentDocument(String(environment ?? ''));
  const loc = parseEnvironmentDocument(String(local ?? ''));

  const tplNames = new Set(tpl.names);
  const locNames = new Set(loc.names);
  const effValue = (name) => {
    const live = env.valueMap[name];
    return live !== undefined ? live : tpl.valueMap[name] ?? '';
  };

  let text = renderTemplate(tplText, effValue);
  if (!text.endsWith('\n')) text += '\n';

  const sentinelLine = String(environment ?? '').split('\n').findIndex((l) => l === SUPPLEMENTAL_SENTINEL);
  const tplCommentTexts = new Set(tpl.comments.map((c) => c.text));
  const extraComments = env.comments
    .filter((c) => (sentinelLine === -1 || c.line < sentinelLine) && !tplCommentTexts.has(c.text))
    .map((c) => c.text);

  const liveOnly = env.names.filter((n) => !tplNames.has(n) && !(locNames.has(n) && (env.valueMap[n] ?? '') === ''));
  const localOnly = loc.names.filter(
    (n) => !tplNames.has(n) && !liveOnly.includes(n) && (env.valueMap[n] ?? '') === '',
  );

  if (tplText.includes(SUPPLEMENTAL_SENTINEL) && !extraComments.length && !liveOnly.length && !localOnly.length) return text;

  const section = [];
  if (extraComments.length) section.push(...extraComments, '');
  section.push(SUPPLEMENTAL_SENTINEL);
  if (liveOnly.length || localOnly.length) {
    if (liveOnly.length) {
      section.push('# Retained from the pre-sync .env; ordering preserved.');
      for (const name of liveOnly) {
        section.push(`# ${name}: origin existing .env value.`);
        if (locNames.has(name) && loc.valueMap[name] !== env.valueMap[name]) {
          section.push(`# ${name}: a differing .env.local override is honored at resolve time.`);
        }
        section.push(serializeAssignment(name, env.valueMap[name] ?? ''));
      }
    }
    if (localOnly.length) {
      section.push('# Effective values maintained in .env.local; left empty here so the override applies.');
      for (const name of localOnly) {
        section.push(`# ${name}: origin .env.local.`);
        section.push(`${name}=""`);
      }
    }
  } else {
    section.push('# No supplemental names.');
  }
  text = text.replace(/\n*$/, '\n') + '\n' + section.join('\n') + '\n';
  return text;
}

// ── Credential references ────────────────────────────────────────────────────

export function parseCredentialReference(value, binding) {
  const label = binding || 'unknown binding';
  if (typeof value !== 'string' || !value.startsWith('kstore://')) {
    throw new Error(`Invalid credential reference for ${label}: expected a kstore:// pointer`);
  }
  const m = /^kstore:\/\/admin-manual\/([^#\s?]+)#([A-Za-z_][A-Za-z0-9_]*)$/.exec(value);
  if (!m) {
    throw new Error(`Invalid credential reference for ${label}: expected kstore://admin-manual/<document-path>#<ENV_FRAGMENT>`);
  }
  const [, docPath, fragment] = m;
  if (docPath.includes('..') || docPath.includes('@') || docPath.startsWith('/')) {
    throw new Error(`Invalid credential reference for ${label}: document path traversal is not allowed`);
  }
  return { path: docPath, fragment };
}

// ── Checking ─────────────────────────────────────────────────────────────────

function checkDocumentIndependently(label, doc, tplAnnotations, findings) {
  for (const entry of doc.entries) {
    const { name, value } = entry;
    if (COORDINATOR_OWNED.has(name)) findings.push(`coordinator-owned-assignment: ${name} (${label})`);
    if (typeof value !== 'string' || value === '') continue;
    for (const p of FABRICATED_VALUE_PATTERNS) {
      if (p.test(value)) findings.push(`${p.kind}: ${name}`);
    }
    if (value.startsWith('kstore:')) {
      try { parseCredentialReference(value, name); }
      catch { findings.push(`invalid-pointer: ${name}`); }
      continue;
    }
    if (isCredentialName(name, tplAnnotations)) {
      findings.push(`literal-credential: ${name}`);
    }
  }
}

export function checkEnvironment({ template, environment, local }) {
  const findings = [];
  const tplText = String(template ?? '');
  if (!tplText.trim()) {
    return { ok: false, findings: ['missing-template: template is empty or absent'] };
  }
  const tpl = parseEnvironmentDocument(tplText);
  if (tpl.entries.length === 0) {
    return { ok: false, findings: ['missing-template: template has no active assignments'] };
  }
  const env = parseEnvironmentDocument(String(environment ?? ''));
  const loc = parseEnvironmentDocument(String(local ?? ''));

  if (env.comments.length === 0) findings.push('bare-file: .env has no annotations');
  const annotationText = (comment) => comment.replace(/^(#\s*[A-Za-z_][A-Za-z0-9_]*\s*=).*/, '$1');
  const tplCommentTexts = tpl.comments.map((c) => annotationText(c.text));
  const envCommentTexts = env.comments.map((c) => annotationText(c.text));
  let cursor = 0;
  for (let i = 0; i < tplCommentTexts.length; i++) {
    const idx = envCommentTexts.indexOf(tplCommentTexts[i], cursor);
    if (idx === -1) findings.push(`missing-template-annotation: template comment #${i + 1} absent from .env`);
    else cursor = idx + 1;
  }

  const envNames = new Set(env.names);
  for (const name of tpl.names) {
    if (!envNames.has(name)) findings.push(`missing-key: ${name}`);
  }

  checkDocumentIndependently('template', tpl, tpl.annotations, findings);
  checkDocumentIndependently('.env', env, tpl.annotations, findings);
  checkDocumentIndependently('.env.local', loc, tpl.annotations, findings);

  const tplNames = new Set(tpl.names);
  const unionNames = new Set([...tpl.names, ...env.names, ...loc.names]);
  for (const name of unionNames) {
    if (!tplNames.has(name) && !envNames.has(name)) {
      findings.push(`missing-union-name: ${name} absent from .env`);
    }
    if (!tplNames.has(name) && envNames.has(name)
      && !env.comments.some((c) => c.text.includes(`# ${name}`))) {
      findings.push(`unannotated-supplemental: ${name}`);
    }
  }

  for (const name of unionNames) {
    if (!name.startsWith('VITE_')) continue;
    if (!tplNames.has(name)) findings.push(`undeclared-vite: ${name}`);
    else if (!tpl.annotations.public.has(name)) findings.push(`vite-public-annotation-missing: ${name}`);
  }

  const privatePublic = [...tpl.annotations.public].filter((n) => isPrivateCredentialName(n));
  for (const name of privatePublic) findings.push(`private-public-annotation: ${name}`);

  return { ok: findings.length === 0, findings };
}

// ── KStore client (real WSL subprocess adapter) ──────────────────────────────

// The Python module exposes KStoreClient importable after extending sys.path.
// read_document returns a dict: path, doc_uuid, source_type, revision,
// head_revision, content (string), exact (bool), sha256. Only an actual
// urllib HTTPError with code 404 is reported as not_found; every other
// failure propagates as a sanitized kind so it is never treated as absent.
const PY_DRIVER = `\
import json, sys
sys.path.insert(0, sys.argv[1])
from kstore_client import KStoreClient
from urllib.error import HTTPError
client = KStoreClient()
req = json.load(sys.stdin)
out = {'ok': False, 'error_kind': 'UnknownOp'}
try:
    if req['op'] == 'read':
        out = {'ok': True, 'result': client.read_document(req['path'], source_type=req.get('source_type', 'admin-manual'))}
    elif req['op'] == 'write':
        client.write_document(req['path'], req['content'], source=req.get('source', 'admin-manual'), title=req.get('title'), mode=req.get('mode', 'replace'))
        out = {'ok': True, 'result': None}
except HTTPError as e:
    out = {'ok': False, 'error_kind': 'HTTPError', 'http_code': e.code, 'not_found': (e.code == 404)}
except Exception as e:
    out = {'ok': False, 'error_kind': type(e).__name__}
sys.stdout.write(json.dumps(out))
`;

function runCaptured({ spawnImpl, command, args, input, op, what }) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill(), 120000);
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(new Error(`kstore ${op} failed for ${what}: ${err.code || 'spawn error'}`));
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        // Sanitized: child stderr and content never enter the message.
        reject(new Error(`kstore ${op} failed for ${what}: exit code ${code}${stderr.trim() ? ' (diagnostics suppressed)' : ''}`));
        return;
      }
      resolve(stdout);
    });
    if (input !== undefined) child.stdin.end(input, 'utf8');
    else child.stdin.end();
  });
}

function notFoundError(path) {
  const err = new Error(`kstore read failed for ${path}: document not found`);
  err.code = 'KSTORE_NOT_FOUND';
  return err;
}

export function createKStoreClient(options = {}) {
  const distro = options.distro ?? WSL_DISTRO;
  const user = options.user ?? WSL_USER;
  const moduleDir = options.moduleDir ?? KSTORE_MODULE_DIR;
  const spawnImpl = options.spawnImpl ?? spawn;
  // Windows reaches KStore inside the Ubuntu-24.04 WSL distribution; a native
  // Linux host runs the same driver with its local Python.
  const isWindows = (options.platform ?? process.platform) === 'win32';
  const venvPython = join(moduleDir, '..', 'venv', 'bin', 'python');
  const localPython = options.python ?? (existsSync(venvPython) ? venvPython : 'python3');

  async function request(payload, what) {
    const stdout = await runCaptured({
      spawnImpl,
      command: isWindows ? 'wsl.exe' : localPython,
      args: isWindows
        ? ['-d', distro, '-u', user, '--exec', 'python3', '-c', PY_DRIVER, moduleDir]
        : ['-c', PY_DRIVER, moduleDir],
      input: JSON.stringify(payload),
      op: payload.op,
      what,
    });
    let reply;
    try { reply = JSON.parse(stdout); }
    catch {
      throw new Error(`kstore ${payload.op} failed for ${what}: unreadable reply`);
    }
    if (reply && reply.not_found === true) throw notFoundError(what);
    if (!reply || reply.ok !== true) {
      const kind = reply && typeof reply.error_kind === 'string' ? reply.error_kind : 'unknown failure';
      throw new Error(`kstore ${payload.op} failed for ${what}: ${kind}`);
    }
    return reply;
  }

  return {
    async read_document(path, sourceType = 'admin-manual') {
      const reply = await request({ op: 'read', path, source_type: sourceType }, path);
      const r = reply.result;
      if (!r || typeof r !== 'object' || r.exact !== true || typeof r.content !== 'string') {
        throw new Error(`kstore read failed for ${path}: inexact or malformed read rejected`);
      }
      return {
        content: r.content,
        revision: r.revision ?? null,
        headRevision: r.head_revision ?? null,
        sha256: r.sha256 ?? null,
        exact: true,
      };
    },
    async write_document(path, content, { source = 'admin-manual', title, mode = 'replace' } = {}) {
      const reply = await request(
        { op: 'write', path, content, source, title, mode }, path,
      );
      return { revision: null };
    },
    async write_with_exact_readback(path, content, writeOpts) {
      await this.write_document(path, content, writeOpts);
      const reread = await this.read_document(path);
      if (reread.exact !== true || reread.content !== content) {
        throw new Error(`kstore verification failed for ${path}: readback differs or is inexact`);
      }
      return reread;
    },
  };
}

// ── WSL credential recovery ──────────────────────────────────────────────────

// A fixed Python snippet prints JSON for exactly the four declared names via
// os.environ.get; no blanket environment dump, no values in argv or logs.
const RECOVERY_PY = 'import json, os\n'
  + 'names = ["GEMINI_API_KEY", "GOOGLE_API_KEY", "OPENROUTER_ADMIN_KEY", "OPENROUTER_API_KEY"]\n'
  + 'print(json.dumps({name: os.environ.get(name) for name in names}))';

export async function recoverShellCredentials(options = {}) {
  const distro = options.distro ?? WSL_DISTRO;
  const user = options.user ?? WSL_USER;
  const spawnImpl = options.spawnImpl ?? spawn;
  const stdout = await runCaptured({
    spawnImpl,
    args: ['-d', distro, '-u', user, '--exec', 'bash', '-ic', `python3 -c '${RECOVERY_PY}'`],
    input: undefined,
    op: 'recover',
    what: 'interactive WSL environment',
  });
  let parsed;
  try { parsed = JSON.parse(stdout); }
  catch {
    throw new Error('credential recovery failed: unreadable reply');
  }
  const recovered = {};
  for (const name of RECOVERABLE_WSL_KEYS) {
    const v = parsed ? parsed[name] : undefined;
    if (typeof v === 'string' && v !== '') recovered[name] = v;
  }
  return recovered;
}

// ── Resolution ───────────────────────────────────────────────────────────────

function readOptional(root, name) {
  const p = join(root, name);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

export async function resolveEnvironment({ root, client }) {
  const templateText = readOptional(root, TEMPLATE_NAME);
  // Cloud sessions (Robin, 2026-11-03): Admin-Manual is attached to pull in the
  // credential pointers. When KStore is unreachable, kstore://admin-manual/<path>
  // documents are read from that checkout, and with no local .env the pointer
  // file CREDENTIALS/Natally/natally-pointers.env (pointers only, no secrets) is used.
  const adminRoot = process.env.NATALLY_ADMIN_MANUAL || join(root, '..', 'Admin-Manual');
  const adminRead = rel => { try { return readFileSync(join(adminRoot, rel), 'utf8'); } catch { return null; } };
  const envText = readOptional(root, ENV_NAME) ?? adminRead('CREDENTIALS/Natally/natally-pointers.env') ?? '';
  const localText = readOptional(root, LOCAL_NAME) ?? '';

  const check = checkEnvironment({ template: templateText ?? '', environment: envText, local: localText });
  if (!check.ok) {
    throw new Error(`resolve: configuration check failed: ${check.findings.join('; ')}`);
  }

  const tpl = parseEnvironmentDocument(templateText ?? '');
  const environment = {};
  const references = [];
  const docCache = new Map();

  async function documentFor(path) {
    if (docCache.has(path)) return docCache.get(path);
    const p = Promise.resolve().then(() => client.read_document(path))
    .catch((error) => {
      const content = adminRead(path);
      if (content === null) throw error;
      return { exact: true, content, revision: 'admin-manual-checkout' };
    })
    .then((r) => {
    if (!r || r.exact !== true || typeof r.content !== 'string') {
    throw new Error(`Unresolved reference: document ${path} read was inexact or malformed`);
    }
    let values;
    try { values = parseEnv(r.content); }
    catch { throw new Error(`Unresolved reference: document ${path} is not parseable`); }
    return { values, revision: r.revision };
    });
    docCache.set(path, p);
    return p;
  }

  async function bind(name, value) {
    const ref = parseCredentialReference(value, name);
    let doc;
    try {
      doc = await documentFor(ref.path);
    } catch {
      throw new Error(`Unresolved reference for ${name}: document ${ref.path} unavailable`);
    }
    const resolved = doc.values[ref.fragment];
    if (typeof resolved !== 'string' || resolved === '') {
      throw new Error(`Unresolved reference for ${name}: fragment ${ref.fragment} missing or empty in ${ref.path}`);
    }
    if (resolved.startsWith('kstore:')) {
      throw new Error(`Unresolved reference for ${name}: nested reference in ${ref.fragment}`);
    }
    environment[name] = resolved;
    references.push({ name, path: ref.path, fragment: ref.fragment, revision: doc.revision });
  }

  // Merge .env then .env.local; only effective bindings are resolved.
  const merged = new Map();
  for (const [name, value] of Object.entries(parseEnv(envText))) merged.set(name, value);
  for (const [name, value] of Object.entries(localText ? parseEnv(localText) : {})) merged.set(name, value);

  for (const [name, value] of merged) {
    if (typeof value === 'string' && value.startsWith('kstore://')) await bind(name, value);
    else environment[name] = value;
  }

  const publicEnvironment = {};
  for (const name of tpl.annotations.public) {
    if (!name.startsWith('VITE_')) continue;
    if (isPrivateCredentialName(name)) {
      throw new Error(`Public projection rejected for ${name}: private credentials cannot be public`);
    }
    if (environment[name] !== undefined) publicEnvironment[name] = environment[name];
  }

  return { environment, publicEnvironment, references };
}

// ── Migration ────────────────────────────────────────────────────────────────

function replaceAssignments(text, name, newValue, targets) {
  const lines = text.split('\n');
  const ordered = [...targets].sort((a, b) => b.line - a.line);
  for (const entry of ordered) {
    lines.splice(entry.line, entry.end - entry.line + 1, firstLineWithInlineComment(entry, name, newValue));
  }
  return lines.join('\n');
}

// Replaces every existing EMPTY assignment of name (all duplicates) with the
// value; appends an annotated assignment only when the name is absent.
function fillAssignment(text, name, value, note) {
  const doc = parseEnvironmentDocument(text);
  const empties = doc.entries.filter((e) => e.name === name && (e.value ?? '') === '');
  if (empties.length) return replaceAssignments(text, name, value, empties);
  const block = `${note}\n${serializeAssignment(name, value)}`;
  const base = text.endsWith('\n') ? text.slice(0, -1) : text;
  return (base ? base + '\n\n' : '') + block + '\n';
}

async function checkpointDocument(client, content, docPath, label) {
  let existing = null;
  try {
    existing = await client.read_document(docPath);
  } catch (e) {
    if (e.code !== 'KSTORE_NOT_FOUND') throw e;
    existing = null;
  }
  if (existing) {
    if (existing.exact !== true) {
      throw new Error(`checkpoint read for ${docPath} was not exact; aborting before any write`);
    }
    // Any existing exact checkpoint, including an empty one, is the first
    // checkpoint and is preserved; only a truly absent document is written.
    return `preserved-existing-first-checkpoint (${label})`;
  }
  await client.write_with_exact_readback(docPath, content, {
    title: `Pre-edit ${label} checkpoint, 29 Oct 2026`,
  });
  return `written-and-verified (${label})`;
}

function planCredentialMigrations(envDoc, locDoc, annotations) {
  const plans = [];
  for (const [doc, sourceFile] of [[envDoc, '.env'], [locDoc, '.env.local']]) {
    if (!doc) continue;
    for (const entry of doc.entries) {
      const { name, value } = entry;
      if (typeof value !== 'string' || value === '' || value.startsWith('kstore://')) continue;
      if (!isCredentialName(name, annotations)) continue;
      plans.push({ name, value, sourceFile });
    }
  }
  return plans;
}

export async function migrateEnvironmentCredentials({ root, client, recover }) {
  const envPath = join(root, ENV_NAME);
  const localPath = join(root, LOCAL_NAME);
  const envText = readFileSync(envPath, 'utf8');
  const localText = existsSync(localPath) ? readFileSync(localPath, 'utf8') : null;

  let workingEnv = envText;
  let workingLocal = localText;

  const recovered = recover ? await recover() : {};
  const recoveredNames = [];
  for (const name of RECOVERABLE_WSL_KEYS) {
    const value = recovered[name];
    if (typeof value !== 'string' || value === '') continue;
    const envDoc = parseEnvironmentDocument(workingEnv);
    const current = envDoc.valueMap[name];
    if (typeof current === 'string' && current !== '') continue;
    const localDoc = workingLocal ? parseEnvironmentDocument(workingLocal) : null;
    if (localDoc && typeof localDoc.valueMap[name] === 'string' && localDoc.valueMap[name] !== '') continue;
    workingEnv = fillAssignment(workingEnv, name, value, RECOVERED_NOTE);
    recoveredNames.push(name);
  }

  const envDoc = parseEnvironmentDocument(workingEnv);
  const locDoc = workingLocal ? parseEnvironmentDocument(workingLocal) : null;
  const tplPath = join(root, TEMPLATE_NAME);
  const tplText = readFileSync(tplPath, 'utf8');
  const tpl = parseEnvironmentDocument(tplText);
  const plans = planCredentialMigrations(envDoc, locDoc, tpl.annotations);

  // Resolve distinct local overrides into NAME_LOCAL fragments up front.
  const resolved = [];
  for (const plan of plans) {
    if (plan.sourceFile === '.env.local') {
      const envValue = envDoc.valueMap[plan.name];
      const distinct = envValue !== undefined && envValue !== plan.value;
      resolved.push({ ...plan, fragment: distinct ? `${plan.name}_LOCAL` : plan.name });
    } else {
      resolved.push({ ...plan, fragment: plan.name });
    }
  }

  const byDoc = new Map();
  for (const plan of resolved) {
    const docPath = CREDENTIAL_DOC_BY_NAME[plan.name] ?? DEFAULT_CREDENTIAL_DOC;
    if (!byDoc.has(docPath)) byDoc.set(docPath, new Map());
    const frags = byDoc.get(docPath);
    if (frags.has(plan.fragment) && frags.get(plan.fragment) !== plan.value) {
      throw new Error(`Credential conflict for ${plan.name}: existing canonical fragment ${plan.fragment} in ${docPath} differs and is preserved`);
    }
    frags.set(plan.fragment, plan.value);
  }

  // Preflight: read ALL canonical documents before any write. Only an actual
  // 404 means the document may be created; transport or inexact failures
  // abort here with zero writes.
  const docContents = new Map();
  for (const docPath of byDoc.keys()) {
    try {
      const read = await client.read_document(docPath);
      if (read.exact !== true) {
        throw new Error(`migration aborted before any write: canonical document ${docPath} could not be read exactly`);
      }
      docContents.set(docPath, read.content);
    } catch (e) {
      if (e.code !== 'KSTORE_NOT_FOUND') {
        if (/aborted before any write/.test(e.message)) throw e;
        throw new Error(`migration aborted before any write: canonical document ${docPath} could not be read exactly`);
      }
      docContents.set(docPath, '');
    }
  }

  // Replace only each plan's own sourceFile binding; a local literal is its
  // own plan (with its own fragment), and an existing explicit local pointer
  // is never rewritten here.
  for (const plan of resolved) {
    const docPath = CREDENTIAL_DOC_BY_NAME[plan.name] ?? DEFAULT_CREDENTIAL_DOC;
    const pointer = `kstore://admin-manual/${docPath}#${plan.fragment}`;
    if (plan.sourceFile === '.env.local') {
      workingLocal = replaceAssignments(
        workingLocal, plan.name, pointer,
        parseEnvironmentDocument(workingLocal).entries.filter((e) => e.name === plan.name),
      );
    } else {
      workingEnv = replaceAssignments(
        workingEnv, plan.name, pointer,
        parseEnvironmentDocument(workingEnv).entries.filter((e) => e.name === plan.name),
      );
    }
  }

  // Compute the synchronized candidate BEFORE the gate, check those exact
  // bytes, and reuse the same bytes for the final .env write.
  const synced = synchronizeEnvironment({
    template: tplText,
    environment: workingEnv,
    local: workingLocal ?? '',
  });
  const gate = checkEnvironment({
    template: tplText,
    environment: synced,
    local: workingLocal ?? '',
  });
  if (!gate.ok) {
    throw new Error(`migration aborted before any write: synchronized result failed check: ${gate.findings.join('; ')}`);
  }

  // Compute every canonical document's next content and validate ALL fragment
  // conflicts before performing the first canonical write. An existing EMPTY
  // fragment assignment is replaced in place (retaining its comments and
  // unaffected bytes); a new canonical name is appended without trimming.
  const migrated = [];
  const nextContents = new Map();
  for (const [docPath, frags] of byDoc) {
    let updated = docContents.get(docPath);
    const additions = [];
    for (const [fragment, value] of frags) {
      const current = parseEnvironmentDocument(updated).valueMap[fragment];
      if (typeof current === 'string' && current !== '') {
        if (current !== value) {
          throw new Error(`Credential conflict for ${fragment}: existing canonical fragment in ${docPath} differs and is preserved`);
        }
        continue;
      }
      if (typeof current === 'string') {
        const empties = parseEnvironmentDocument(updated)
          .entries.filter((e) => e.name === fragment && (e.value ?? '') === '');
        updated = replaceAssignments(updated, fragment, value, empties);
        migrated.push(`${docPath}#${fragment}`);
        continue;
      }
      const baseName = fragment.endsWith('_LOCAL') ? fragment.slice(0, -6) : fragment;
      const note = CREDENTIAL_DESCRIPTIONS[baseName] ?? MIGRATED_NOTE;
      additions.push(`# ${fragment}: ${note}\n${serializeAssignment(fragment, value)}`);
      migrated.push(`${docPath}#${fragment}`);
    }
    if (additions.length) {
      // Append without rewriting or trimming the existing prefix.
      const separator = updated === '' ? '' : (updated.endsWith('\n') ? '\n' : '\n\n');
      updated = updated + separator + additions.join('\n') + '\n';
    }
    nextContents.set(docPath, updated);
  }

  // First checkpoint writes happen only AFTER all canonical conflicts have
  // been preflighted above, but still before any canonical or env write.
  const checkpoints = [];
  checkpoints.push(await checkpointDocument(client, envText, CHECKPOINT_ENV, '.env'));
  if (localText !== null) {
    checkpoints.push(await checkpointDocument(client, localText, CHECKPOINT_LOCAL, '.env.local'));
  }

  for (const [docPath, updated] of nextContents) {
    if (updated !== docContents.get(docPath)) {
      await client.write_with_exact_readback(docPath, updated, {
        title: 'Natally credentials (extended by annotated sync, 29 Oct 2026)',
      });
    }
  }

  writeFileSync(envPath, synced, 'utf8');
  if (workingLocal !== null && workingLocal !== localText) {
    writeFileSync(localPath, workingLocal, 'utf8');
  }

  return {
    checkpoints: checkpoints.filter(Boolean),
    recovered: recoveredNames,
    migrated,
  };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function readRootTexts(root) {
  return {
    template: readFileSync(join(root, TEMPLATE_NAME), 'utf8'),
    environment: readFileSync(join(root, ENV_NAME), 'utf8'),
    local: existsSync(join(root, LOCAL_NAME)) ? readFileSync(join(root, LOCAL_NAME), 'utf8') : '',
  };
}

export async function runCli(argv, deps = {}) {
  const out = deps.write ?? ((s) => process.stdout.write(s));
  const err = deps.writeError ?? ((s) => process.stderr.write(s));
  const isTTY = deps.isTTY ?? process.stdout.isTTY;
  const makeClient = deps.createClient ?? (() => createKStoreClient());
  const makeRecover = deps.createRecover ?? (() => () => recoverShellCredentials());

  const args = [...argv];
  let root = process.cwd();
  const rootIdx = args.indexOf('--root');
  if (rootIdx !== -1) {
    root = args.splice(rootIdx, 2)[1];
  }
  const command = args[0];
  try {
    if (command === 'sync') {
      const texts = readRootTexts(root);
      const synced = synchronizeEnvironment(texts);
      writeFileSync(join(root, ENV_NAME), synced, 'utf8');
      out('sync: .env reconstructed from the annotated template; .env.local overrides retained.\n');
      return 0;
    }
    if (command === 'check') {
      const texts = readRootTexts(root);
      const result = checkEnvironment(texts);
      if (result.ok) out('check: ok\n');
      else for (const f of result.findings) out(`check finding: ${f}\n`);
      return result.ok ? 0 : 1;
    }
    if (command === 'resolve') {
      const json = args.includes('--json');
      // Refuse a TTY before any provider or document call.
      if (json && isTTY) {
        err('error: resolve --json refuses a TTY; use a captured process transport\n');
        return 1;
      }
      const client = makeClient();
      const result = await resolveEnvironment({ root, client });
      if (json) {
        out(JSON.stringify(result.environment) + '\n');
      } else {
        out(`resolve: ${Object.keys(result.environment).length} bindings, `
          + `${Object.keys(result.publicEnvironment).length} public bindings, `
          + `${result.references.length} references\n`);
        for (const r of result.references) {
          out(`reference: ${r.name} -> ${r.path}#${r.fragment} (revision ${r.revision ?? 'current'})\n`);
        }
      }
      return 0;
    }
    if (command === 'migrate') {
      const client = makeClient();
      const recover = makeRecover();
      const summary = await migrateEnvironmentCredentials({ root, client, recover });
      for (const c of summary.checkpoints) out(`checkpoint: ${c}\n`);
      for (const n of summary.recovered) out(`recovered: ${n}\n`);
      for (const m of summary.migrated) out(`migrated: ${m}\n`);
      out('migrate: annotated synchronization complete.\n');
      return 0;
    }
    err('usage: node scripts/environment.mjs <sync|check|resolve|migrate> [--root <directory>] [--json]\n');
    return 2;
  } catch (e) {
    err(`error: ${e.message}\n`);
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
