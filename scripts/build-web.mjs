// Private Tauri/web hook. Public npm build commands always run the full matrix.
import { existsSync, readFileSync, copyFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { releaseBuildInfo } from './release-state.mjs';
import { generatePwa, resolveEntryKeys } from './pwa-build.mjs';
const release = releaseBuildInfo();
const entryKeys = resolveEntryKeys();
const legacyRedirect = (() => {
  const value = entryKeys.VITE_LEGACY_PATH_REDIRECTS;
  const separator = value.indexOf(':');
  const source = separator === -1 ? '' : value.slice(0, separator);
  const destination = separator === -1 ? '' : value.slice(separator + 1);
  if (!source.startsWith('/') || !destination.startsWith('/')) {
    throw new Error(`VITE_LEGACY_PATH_REDIRECTS must be one "source:destination" pair of absolute paths (got "${value}").`);
  }
  return { source, destination };
})();
const escapeHtmlText = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const legacyRedirectDocument = () => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="natally-version" content="v${release.version}">
<meta name="natally-release-id" content="${release.invocationId}">
<meta name="robots" content="noindex">
<title>${escapeHtmlText(entryKeys.VITE_APP_NAME)}</title>
<link rel="canonical" href="${legacyRedirect.destination}">
<script>
(function () {
  var destination = new URL(${JSON.stringify(legacyRedirect.destination)}, location.origin);
  destination.search = location.search;
  destination.hash = location.hash;
  location.replace(destination.href);
})();
</script>
</head>
<body>
<noscript><p>This page has moved. <a href="${legacyRedirect.destination}">Continue to ${escapeHtmlText(entryKeys.VITE_APP_NAME)}</a>.</p></noscript>
</body>
</html>
`;
const currentDocument = (path, mount) => {
  if (!existsSync(path)) return false;
  const html = readFileSync(path, 'utf8');
  return html.includes(`content="${release.invocationId}"`) && (mount === null || html.includes(`id="${mount}"`));
};
const legacyPath = `dist-web${legacyRedirect.source}`;
if (
  currentDocument('dist-web/index.html', 'root')
  && currentDocument('dist-web/app.html', 'root')
  && readFileSync('dist-web/index.html').equals(readFileSync('dist-web/app.html'))
  && currentDocument('dist-web/landing.html', 'marketing-experience-root')
  && currentDocument(legacyPath, null)
) {
  console.log(`Reusing the frozen web bundle for v${release.version}`);
} else {
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], { stdio: 'inherit', env: process.env });
  if (!currentDocument('dist-web/index.html', 'root') || !currentDocument('dist-web/marketing.html', 'marketing-experience-root')) throw new Error('The compiled app and landing must match the frozen release before entry routing is prepared.');
  copyFileSync('dist-web/index.html', 'dist-web/app.html');
  copyFileSync('dist-web/marketing.html', 'dist-web/landing.html');
  writeFileSync(legacyPath, legacyRedirectDocument());
}
generatePwa('dist-web', release);
