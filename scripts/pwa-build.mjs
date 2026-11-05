import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENTRY_KEY_DEFAULTS = Object.freeze({
  VITE_LANDING_PATH: '/landing',
  VITE_LANDING_PATH_ALIAS: '/landing.html',
  VITE_APP_PATH: '/app.html',
  VITE_LEGACY_PATH_REDIRECTS: '/marketing.html:/landing',
  VITE_APP_NAME: 'Natally',
  VITE_APP_NAMESPACE: 'natally',
});

/** Frozen entry/identity keys: build environment first, .env fallback, then the frozen defaults. */
export function resolveEntryKeys(root = repositoryRoot) {
  let fromEnvFile = {};
  const envFile = join(root, '.env');
  if (existsSync(envFile)) {
    try {
      fromEnvFile = parseEnv(readFileSync(envFile, 'utf8'));
    } catch (error) {
      throw new Error(`Unable to parse .env while resolving the entry keys: ${error?.message ?? error}`);
    }
  }
  const keys = {};
  for (const [key, fallback] of Object.entries(ENTRY_KEY_DEFAULTS)) {
    const raw = process.env[key] ?? fromEnvFile[key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    keys[key] = value || fallback;
  }
  return Object.freeze(keys);
}

const SHELL_FILES = new Set(['index.html', 'app.html', 'landing.html', 'marketing.html', 'manifest.webmanifest', 'pwa.js']);
const BRANDING_ICONS = new Set(['/branding/192x192.png', '/branding/512x512.png']);
const ASSET_EXTS = new Set(['.js', '.css', '.wasm']);

function walk(dir, base, out) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = posix.join(base, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, rel, out);
    else out.push('/' + rel.split('\\').join('/'));
  }
}

export function generatePwa(outputDir, release) {
  if (!release || !release.version || !release.invocationId) {
    throw new Error('generatePwa requires release.version and release.invocationId');
  }
  if (!existsSync(outputDir)) {
    throw new Error(`output dir not found: ${outputDir}`);
  }

  const entryKeys = resolveEntryKeys();
  const appName = entryKeys.VITE_APP_NAME;
  const appNamespace = entryKeys.VITE_APP_NAMESPACE;

  const manifestFile = join(outputDir, 'manifest.webmanifest');
  if (!existsSync(manifestFile)) {
    throw new Error(`generatePwa requires the built manifest.webmanifest in ${outputDir}`);
  }
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  manifest.name = appName;
  manifest.short_name = appName;
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');

  const all = [];
  walk(outputDir, '', all);

  const precache = all.filter((url) => {
    const path = url.slice(1);
    const ext = posix.extname(path).toLowerCase();
    if (SHELL_FILES.has(path)) return true;
    if (BRANDING_ICONS.has(url)) return true;
    if (path.startsWith('branding/')) return false;
    return path.startsWith('assets/') && ASSET_EXTS.has(ext);
  }).sort();

  for (const url of [...SHELL_FILES].map(x => '/' + x).concat([...BRANDING_ICONS])) {
    if (!precache.includes(url)) throw new Error('Missing PWA shell resource: ' + url);
  }

  const cacheName = `${appNamespace}-shell-${release.version}-${release.invocationId}`;
  const namespacePattern = appNamespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const shellRoutes = [
    ['/', '/index.html'],
    ['/index.html', '/index.html'],
    ['/app.html', '/app.html'],
    [entryKeys.VITE_LANDING_PATH, '/landing.html'],
    [entryKeys.VITE_LANDING_PATH_ALIAS, '/landing.html'],
    ['/marketing.html', '/marketing.html'],
  ];
  const list = JSON.stringify(precache);
  const sw = String.raw`const RELEASE_ID=${JSON.stringify(release.invocationId)};
const CACHE_NAME=${JSON.stringify(cacheName)};
const PRECACHE_URLS=${list};
const SHELL_ROUTES = new Map(${JSON.stringify(shellRoutes)});
const clientReleases = new Map();
const requestedClients = new Set();
let pruning = Promise.resolve();

async function matchesReleaseHtml(response, releaseId) {
  if (!response.ok || !/^(?:text\/html|application\/xhtml\+xml)(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) return false;
  const html = await response.clone().text();
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (!/\sname\s*=\s*(["'])natally-release-id\1/i.test(tag)) continue;
    const content = tag.match(/\scontent\s*=\s*(["'])(.*?)\1/i);
    if (content && content[2].trim()) return !releaseId || content[2].trim() === releaseId;
  }
  return false;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const existed = await caches.has(CACHE_NAME);
    try {
      const cache = await caches.open(CACHE_NAME);
      const results = await Promise.allSettled(PRECACHE_URLS.map(async (path) => {
        const response = await fetch(new Request(path, { cache: 'reload' }));
        if (!response.ok) throw new Error('Precache request failed: ' + path);
        if (Array.from(SHELL_ROUTES.values()).includes(path) && !await matchesReleaseHtml(response, RELEASE_ID)) throw new Error('Precache invocation mismatch: ' + path);
        await cache.put(path, response);
      }));
      const failed = results.find(result => result.status === 'rejected');
      if (failed) throw failed.reason;
      await self.skipWaiting();
    } catch (error) {
      if (!existed) await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});

function olderShell(name) {
  const own = CACHE_NAME.match(/^${namespacePattern}-shell-(\d+)\.(\d+)\.(\d+)-/);
  const candidate = name.match(/^${namespacePattern}-shell-(\d+)\.(\d+)\.(\d+)-/);
  if (!own || !candidate) return false;
  for (let index = 1; index <= 3; index++) {
    if (Number(candidate[index]) !== Number(own[index])) return Number(candidate[index]) < Number(own[index]);
  }
  // A same/newer-version cache may belong to a worker still installing.
  return false;
}

function pruneUnusedShells() {
  const task = pruning.catch(() => {}).then(async () => {
    const unknownWindows = async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const liveIds = new Set(windows.map(client => client.id));
      for (const id of clientReleases.keys()) if (!liveIds.has(id)) clientReleases.delete(id);
      for (const id of requestedClients) if (!liveIds.has(id)) requestedClients.delete(id);
      let unknown = false;
      for (const client of windows) {
        if (clientReleases.has(client.id)) continue;
        unknown = true;
        if (!requestedClients.has(client.id)) {
          requestedClients.add(client.id);
          client.postMessage({ type: 'natally:request-release' });
        }
      }
      return unknown;
    };
    if (await unknownWindows()) return;
    const names = await caches.keys();
    for (const name of names.filter(olderShell)) {
      if (await unknownWindows()) return;
      // Read the live reports immediately before deletion. Serialized passes
      // cannot use an earlier snapshot after a newly reported document release.
      if (Array.from(clientReleases.values()).some(id => name.endsWith('-' + id))) continue;
      await caches.delete(name);
    }
  });
  pruning = task;
  return task;
}

self.addEventListener('message', (event) => {
  const source = event.source, data = event.data;
  if (!source || source.type !== 'window' || !source.id || new URL(source.url).origin !== self.location.origin || data?.type !== 'natally:document-release' || typeof data.releaseId !== 'string' || !data.releaseId.trim()) return;
  clientReleases.set(source.id, data.releaseId.trim());
  event.waitUntil(pruneUnusedShells());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    await pruneUnusedShells();
  })());
});

async function respondToNavigation(request, shell) {
  try {
    const response = await fetch(new Request(request, { cache: 'reload' }));
    if (!await matchesReleaseHtml(response)) throw new Error('Navigation did not return a release-marked HTML document.');
    if (await matchesReleaseHtml(response, RELEASE_ID)) {
      try { await (await caches.open(CACHE_NAME)).put(shell, response.clone()); } catch (_) { /* The valid online document is still usable if storage is unavailable. */ }
    }
    return response;
  } catch (error) {
    const cached = await (await caches.open(CACHE_NAME)).match(shell);
    if (cached) return cached;
    throw error;
  }
}

async function retainedAsset(request) {
  const path = new URL(request.url).pathname;
  const current = await (await caches.open(CACHE_NAME)).match(path);
  if (current) return current;
  for (const name of (await caches.keys()).filter(name => name.startsWith(${JSON.stringify(`${appNamespace}-shell-`)}) && name !== CACHE_NAME)) {
    const retained = await (await caches.open(name)).match(path);
    if (retained) return retained;
  }
  return fetch(request);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const shell = SHELL_ROUTES.get(url.pathname);
  if (shell && request.mode === 'navigate') {
    if (event.clientId) { clientReleases.delete(event.clientId); requestedClients.delete(event.clientId); }
    if (event.resultingClientId) { clientReleases.delete(event.resultingClientId); requestedClients.delete(event.resultingClientId); }
    const response = respondToNavigation(request, shell);
    event.respondWith(response);
    event.waitUntil(response.then(() => pruneUnusedShells(), () => pruneUnusedShells()));
    return;
  }
  if (url.pathname.startsWith('/assets/') && /\.(?:js|css|wasm)$/i.test(url.pathname)) {
    event.respondWith(retainedAsset(request));
    return;
  }
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(url.pathname)).then((hit) => hit || fetch(request)));
    return;
  }
});
`;

  writeFileSync(join(outputDir, 'sw.js'), sw);
  writeFileSync(join(outputDir, 'pwa-build.json'), JSON.stringify({
    version: release.version,
    invocationId: release.invocationId,
    cacheName,
    precache,
  }, null, 2) + '\n');

  return { cacheName, precache };
}
