// Private Tauri/web hook. Public npm build commands always run the full matrix.
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { releaseBuildInfo } from './release-state.mjs';
import { generatePwa } from './pwa-build.mjs';
const release = releaseBuildInfo();
const entry = 'dist-web/index.html';
if (existsSync(entry) && readFileSync(entry, 'utf8').includes(`content="${release.invocationId}"`)) {
  console.log(`Reusing the frozen web bundle for v${release.version}`);
} else {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { stdio: 'inherit', env: process.env });
}
generatePwa('dist-web', release);
