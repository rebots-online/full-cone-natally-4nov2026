// Private Tauri/web hook. Public npm build commands always run the full matrix.
import { existsSync, readFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { releaseBuildInfo } from './release-state.mjs';
import { generatePwa } from './pwa-build.mjs';
const release = releaseBuildInfo();
const currentDocument = (path, mount) => existsSync(path) && readFileSync(path, 'utf8').includes(`content="${release.invocationId}"`) && readFileSync(path, 'utf8').includes(`id="${mount}"`);
if (currentDocument('dist-web/app.html', 'root') && currentDocument('dist-web/marketing.html', 'marketing-experience-root') && currentDocument('dist-web/index.html', 'marketing-experience-root')) {
  console.log(`Reusing the frozen web bundle for v${release.version}`);
} else {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { stdio: 'inherit', env: process.env });
  if (!currentDocument('dist-web/index.html', 'root') || !currentDocument('dist-web/marketing.html', 'marketing-experience-root')) throw new Error('The compiled app and landing must match the frozen release before entry routing is prepared.');
  copyFileSync('dist-web/index.html', 'dist-web/app.html');
  copyFileSync('dist-web/marketing.html', 'dist-web/index.html');
}
generatePwa('dist-web', release);
