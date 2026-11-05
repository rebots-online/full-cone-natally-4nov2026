# v1.10.86133 build checkpoint

Coordinator: `npm run build:all -- -Major 1`.
Invocation: `58a22c36-c710-43c9-9651-bb7156ee3e5d`.
Stamped UTC: 2026-10-28T06:13:54.290Z.
Input source revision: `1c0a009b17ceb3b486f01c3de91c8be03a70d350`.
Generated version metadata published through `d0f4324188d1252d04dfc23387db8bbbbe6be24d`.
The Git index was updated line by line without rewriting working files during compilation.

Held relay alternatives were copied and SHA256 verified before removal from
release inputs: `.tmp/held-relay-drafts-20261028-021352/manifest.json`.
The committed reading-access handler was restored; no new Netlify relay was included.
The earlier Git checkpoint remains documented in DOCS/CHECKPOINTS.md.

Preparation passed TypeScript and 15 release-state checks. Web, PWA inventory
and web installer were staged by the complete coordinator. Windows compilation
was live at this checkpoint; Android and Linux groups remain queued. The matrix
must be resumed by its existing process handle while live, not restarted.

Local HTTP preview at http://127.0.0.1:49419 served index.html, marketing.html,
auth/native.html, manifest.webmanifest and sw.js with HTTP 200. HTML release
metadata and service worker contain v1.10.86133. Browser creation was rejected
because local browser use is disabled in Work settings: no rendered inspection,
screencast, sign-in, purchase or fulfillment acceptance is claimed.

No new deployment has occurred. See the mutable coordinator inventory in
build/release-state.json and its staged dist inventory for current target status.

## Completed matrix

The original coordinator process exited successfully. All twelve required targets
are verified in its inventory: Windows EXE/NSIS/MSI, Linux AppImage/DEB/RPM,
Android APK/AAB/native symbols, web, web installer and PWA inventory.
`node scripts/release-state.mjs assert-complete` subsequently passed, checking
frozen source inputs and retained artifact hashes. No partial matrix was substituted.

Android APK verifies with its existing Android Debug certificate; this is not a
Google Play production-signing claim. Windows packages remain unsigned. Native
installation, login, audio/interaction and purchase acceptance are not established
by compilation or package inspection.

The 106 MiB AppImage is preserved in three standard 7-Zip volumes for GitHub's
single-file limit. All parts are committed without LFS; extraction reproduces
SHA256 95596667f8dcffd3286fa2b9948faf7fb3aa248af2ac87050de9afcc0686cc9c.
See dist/natally-ai-studio-v1.10.86133-AppImage-reconstruction.md.

The operator separately requested the web candidate be mounted for evaluation;
both public domains now serve its exact bytes, as recorded in
DOCS/TEST-RESULTS/deployment-1.10.86133.json. This does not close the release goal.
