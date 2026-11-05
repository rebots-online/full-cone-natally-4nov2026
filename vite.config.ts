import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { onnxProgressPlugin } from './scripts/onnx-progress-plugin.ts';
import { releaseBuildInfo } from './scripts/release-state.mjs';

export default defineConfig(({ command }) => {
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
    },
    plugins: [onnxProgressPlugin(), react(), tailwindcss(), {
      name: 'natally-release-identity',
      transformIndexHtml(html) {
        html = html.replace(/<span\b[^>]*\bdata-natally-version-badge\b[^>]*>[\s\S]*?<\/span>/g, '');
        html = html.replace(/<meta\b[^>]*name="natally-(?:version|release-id)"[^>]*>/g, '');
        if (release) html = html.replace('</head>', `<meta name="natally-version" content="v${release.version}"><meta name="natally-release-id" content="${release.invocationId}"></head>`);
        return html;
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
