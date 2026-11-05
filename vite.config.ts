import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { onnxProgressPlugin } from './scripts/onnx-progress-plugin.ts';

export default defineConfig(() => {
  const git = (...args: string[]) => {
    try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
    catch { return ''; }
  };
  const revision = git('rev-parse', 'HEAD');
  const canonicalVersion = existsSync('version.txt') ? readFileSync('version.txt', 'utf8').trim().replace(/^v/, '') : '';
  const version = /^\d+\.\d+\.\d+$/.test(canonicalVersion) ? canonicalVersion : git('log', '-30', '--format=%s').match(/\bv(\d+\.\d+\.\d+)/)?.[1] ?? null;
  return {
    define: {
      __NATALLY_BUILD__: JSON.stringify({ version, revision: revision || null,
        dirty: !!git('status', '--porcelain', '--untracked-files=normal'), builtAt: new Date().toISOString() }),
    },
    plugins: [onnxProgressPlugin(), react(), tailwindcss()],
    worker: { plugins: () => [onnxProgressPlugin()] },
    optimizeDeps: { exclude: ['@huggingface/transformers'] },
    build: {
      // Keep hashed assets from previous releases for tabs opened before deployment.
      emptyOutDir: false,
      rollupOptions: {
        input: {
          app: path.resolve('index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
