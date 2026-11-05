# v1.42.95682 deployment and platform build

Operator-directed run, 3 November 2026. The web deployment must use a NEW version, distinct from the previously live v1.32.90532, and precede native builds.

- Initial source: master at cc59892af717f8e2dc6ce73721680f03541b70d8, matched origin/master after fetch.
- Canonical entry: build_all.sh --deploy-web --domains natally.robin.mba,natally.surge.sh, on the native Windows host.
- Automatic version: 1.42.95682; invocation 7802dda3-4f00-4f77-85c6-d62e4b7aeb94.
- Version stamp committed and pushed as 360869a9ad02559c852fbe10c6c9b8dce0c342fc; remote SHA verified.
- Local annotated environment synchronized using scripts/environment.mjs sync after exact pre-edit backups outside the repository. Existing values retained; environment check passed. Resolved credentials remained process-only.
- Earlier attempts to republish v1.32 were rejected before publishing. No v1.32 deployment occurred during this run.
- TypeScript check and new web build passed. Both hosts published v1.42.95682 before native compilation began.
- Initial served-byte check passed on natally.robin.mba; the secondary Surge host had one transient voice/waiting/closer.wav mismatch. A fresh complete check passed on BOTH hosts at 2026-11-03T21:29:04.827Z. See served-verification.json. Both live pwa-build.json responses reported 1.42.95682 and the matching invocation ID.
- Android APK/AAB signing certificate, embedded version, APK alignment and debug-symbol build IDs verified by the coordinator.
- Windows standalone EXE, NSIS installer and MSI staged by the coordinator.
- Linux AppImage, DEB and RPM completed and were staged. The final inventory reports artifactMatrixComplete=true, sourceInputsMatch=true and missing=[].

Scope: build/package and served-byte evidence only. This run does not establish purchase fulfillment, native-device acceptance, Play submission, or the outstanding continuous customer-journey recording. Existing product checklist items remain open.

## Final verification and publication

- Full matrix completed. The original coordinator process exited 1 solely because it retained the initial transient secondary-host deployment check failure; native builds all completed.
- Canonical build_all.sh --no-deploy-web --deploy-existing dist/natally-ai-studio-v1.42.95682-test-build-inventory.json --verify-only --domains natally.robin.mba,natally.surge.sh exited 0 and verified the completed local inventory. This mode explicitly does not perform remote validation.
- A separate fresh remote check using the repository's verifyServedFiles passed all 97 paths on each host after matrix completion; see final-served-verification.json. No second publication was needed.
- All v1.42.95682 dist files under 95 MiB are included in the artifact publication commit. The 112,134,648-byte AppImage remains in dist locally and its SHA-256 is in the committed inventory; it exceeds the GitHub blob limit and is not pushed as a Git blob. No Git LFS was introduced.
- The pre-existing icon.icns modification and unrelated untracked files were excluded from publication.
