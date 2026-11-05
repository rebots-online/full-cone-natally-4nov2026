import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';

const SHELL_FILES = new Set(['index.html', 'marketing.html', 'manifest.webmanifest', 'pwa.js']);
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

  const cacheName = `natally-shell-${release.version}-${release.invocationId}`;
  const list = JSON.stringify(precache);
  const sw = `const CACHE_NAME=${JSON.stringify(cacheName)};
const RELEASE_ID=${JSON.stringify(release.invocationId)};
const PRECACHE_URLS=${list};
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
  })());
});
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'NATALLY_ACTIVATE') {
    self.skipWaiting();
  } else if (data.type === 'NATALLY_RELEASE_QUERY' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ releaseId: RELEASE_ID });
  }
});
const SHELL_ROUTES = new Map([['/', '/index.html'], ['/index.html', '/index.html'], ['/marketing.html', '/marketing.html']]);
async function assetsFallback(request, url) {
  const names = await caches.keys();
  for (const name of names) {
    if (!name.startsWith('natally-shell-') || name === CACHE_NAME) continue;
    const hit = await caches.open(name).then((c) => c.match(url.pathname));
    if (hit) return hit;
  }
  return fetch(request);
}
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (PRECACHE_URLS.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(url.pathname)).then((hit) => hit || fetch(request)));
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith((async () => {
      const hit = await caches.open(CACHE_NAME).then((cache) => cache.match(url.pathname));
      if (hit) return hit;
      return assetsFallback(request, url);
    })());
    return;
  }
  const shell = SHELL_ROUTES.get(url.pathname);
  if (shell && request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(shell)).then((hit) => hit || fetch(request)));
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
