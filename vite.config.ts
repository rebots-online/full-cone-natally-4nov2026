import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { onnxProgressPlugin } from './scripts/onnx-progress-plugin.ts';
import { releaseBuildInfo } from './scripts/release-state.mjs';
import { loadAppIdentity, projectAppHtml, projectAppManifest } from './scripts/app-identity.mjs';

export default defineConfig(({ command }) => {
  const appIdentity = loadAppIdentity();
  const appManifest = () => JSON.stringify(projectAppManifest(
    JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')), appIdentity,
  ), null, 2) + '\n';
  const publicIdentityPages = ['terms.html', 'privacy.html'];
  const release = command === 'build' ? releaseBuildInfo() : null;
  const git = (...args: string[]) => {
    try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
    catch { return ''; }
  };
  const stamp = release ?? (existsSync('version.json') ? JSON.parse(readFileSync('version.json', 'utf8')) : null);
  const revision = release?.gitCommit || git('rev-parse', 'HEAD') || null;
  const identity = stamp ? {
    version: stamp.version, stampedAt: stamp.stampedAt,
    invocationId: release?.invocationId ?? null,
    sourceRevision: revision, sourceFingerprint: release?.sourceFingerprint ?? null,
    dirty: !!git('status', '--porcelain', '--untracked-files=normal'),
    revision, builtAt: stamp.stampedAt,
  } : null;
  return {
    define: {
      __NATALLY_BUILD__: JSON.stringify(identity),
      __APP_IDENTITY__: JSON.stringify(appIdentity),
    },
    plugins: [onnxProgressPlugin(), react(), tailwindcss(), {
      name: 'natally-release-identity',
      transformIndexHtml(html) {
        html = projectAppHtml(html, appIdentity);
        html = html.replace(/<span\b[^>]*\bdata-natally-version-badge\b[^>]*>[\s\S]*?<\/span>/g, '');
        html = html.replace(/<meta\b[^>]*name="natally-(?:version|release-id)"[^>]*>/g, '');
        if (release) html = html.replace('</head>', `<meta name="natally-version" content="v${release.version}"><meta name="natally-release-id" content="${release.invocationId}"></head>`);
        return html;
      },
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const requested = request.url?.split('?')[0].slice(1);
          if (requested === 'manifest.webmanifest') {
            response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
            response.end(appManifest());
          } else if (requested && publicIdentityPages.includes(requested)) {
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(projectAppHtml(readFileSync(path.join('public', requested), 'utf8'), appIdentity));
          } else next();
        });
      },
      writeBundle(options) {
        writeFileSync(path.resolve(options.dir ?? 'dist-web', 'manifest.webmanifest'), appManifest());
        for (const page of publicIdentityPages) writeFileSync(path.resolve(options.dir ?? 'dist-web', page),
          projectAppHtml(readFileSync(path.join('public', page), 'utf8'), appIdentity));
      },
    }],
    worker: { plugins: () => [onnxProgressPlugin()] },
    optimizeDeps: { exclude: ['@huggingface/transformers'] },
    build: {
      outDir: 'dist-web',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          app: path.resolve('index.html'),
          nativeAuth: path.resolve('auth/native.html'),
          marketing: path.resolve('marketing.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 49418,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
