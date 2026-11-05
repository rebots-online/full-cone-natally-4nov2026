import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { onnxProgressPlugin } from './scripts/onnx-progress-plugin.ts';

export default defineConfig(({ command }) => {
  const stamp = JSON.parse(readFileSync('version.json', 'utf8'));
  if (command === 'build' && process.env.NATALLY_BUILD_VERSION !== stamp.version) {
    throw new Error('Run npm run build:all: the coordinated build must stamp the complete matrix first.');
  }
  return {
    plugins: [onnxProgressPlugin(), react(), tailwindcss(), {
      name: 'natally-build-version',
      transformIndexHtml(html) {
        return { html, tags: [
          { tag: 'meta', attrs: { name: 'application-version', content: `v${stamp.version}` }, injectTo: 'head' },
          { tag: 'span', attrs: { id: 'build-version', style: 'position:fixed;left:8px;bottom:4px;z-index:9999;font:11px monospace;color:#c9aa60;background:#18161be6;padding:2px 6px;pointer-events:none' }, children: `v${stamp.version}`, injectTo: 'body' },
        ] };
      },
    }],
    worker: { plugins: () => [onnxProgressPlugin()] },
    optimizeDeps: { exclude: ['@huggingface/transformers'] },
    build: {
      outDir: 'dist-web',
      rollupOptions: {
        input: {
          app: path.resolve('index.html'),
          voiceVerification: path.resolve('tests/voice-browser.html'),
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
