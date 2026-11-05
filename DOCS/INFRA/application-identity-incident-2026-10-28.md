# Application identity incident and correction â€” 28 October 2026

The operator selected `mba.robin.natally` as the production application ID and
required both application ID and application name to originate in `.env`, so an
open-source fork cannot accidentally ship another publisher's application identity.
This installation deliberately configures `APP_NAME=Natally` and
`APP_IDENTIFIER=mba.robin.natally`. The public example leaves both fields empty.
The local `.env` is ignored and is never part of the public commit.

## Incident and lesson

The embedded identifier `online.rebots.natally.aistudio.test` survived the earlier
customer-facing filename repair and was proposed when the operator needed a Play
listing. Inspecting APK filenames alone missed the package identity. Application
identity must be an explicit input projected into every relevant metadata consumer;
a placeholder/test identifier is not a production configuration or an acceptable
fallback. A package rename does not create a Play listing, migrate an installed
application, repair sign-in, or establish purchase/restore behavior.

## Structural correction

`scripts/app-identity.mjs` reads only `.env` through Node `parseEnv`, requires both
values, and returns only public name/identifier. It rejects absent, malformed,
example, test and placeholder package identities. `syncNativeIdentity` projects
Tauri product name/ID/versioned window label/description, Cargo description,
Android namespace/applicationId and labels, existing Kotlin source paths and
package declarations, buildSrc paths/references, and every app-level/generated
ProGuard reference. It changes neither version nor signing. Existing coordinator
Android preparation calls the projection; `stamp` validates identity before
consuming a version and uses the configured name.

Vite exposes only `__APP_IDENTITY__`; the public module has no fallback. Application
headers, About/version labels, account/recovery/return labels, entry titles, legal
application names, native callback titles, PWA name/short_name/id and install label
consume the configured identity. Vite projects static public legal pages and the
manifest in development and after output writing. Character dialogue, Natally's
fictional identity, artwork, provider offerings, existing hosting destinations,
licence attribution, Rust/npm package handles, CSS/storage identifiers and Android
resource names retain their existing meanings; they are not application-name
fallbacks. No provider, account, billing product or hosting service was added.

## Non-build evidence and build hold

`DOCS/TEST-RESULTS/app-identity-20261028.json` records identity-only checks: repeated
actual projection changes no bytes; an isolated Aurora Reader/org.aurora.reader
fixture projects native paths, ProGuard, five HTML titles and PWA identity without
altering the installation; its second projection is byte-identical. Thirteen
Kotlin/ProGuard files retain all nonidentity bytes. Missing/example/test identity
inputs reject; source inspection places validation before any stamp write.
Version 1.11.86659 and its SHA256 are unchanged. No compiler, stamp, build, native
initialization, deployment or completed sign-in was invoked for these checks.

The previous coordinator failed during preparation at the unfinished billing test.
Its consumed version and original evidence are published as checkpoint a1b7b665;
it is not a release. The operator initially prohibited further builds until all sign-ins and
agreed repairs worked, then explicitly lifted that hold and ordered a parallel
full build. The later authorization is current; coordinator v1.12.86707 completed
all twelve test targets with matching source inputs and exit 0. Its exact version
mirrors and inventory are published at 7f54efa762fcaaf04e903b669250c2d251aeade2.
That matrix predates the later payment recovery/native Play implementation.
Android, Windows and deployed web still need actual functional
sign-in and return-path evidence. Native package/certificate provider bindings,
installed-app continuity and billing restoration remain separate acceptance work.

Identity source publication: 248 individual source-line checkpoints plus three
unchanged package-path relocations, pushed and remotely read back through
8356c2163665a0dc1479f97deda5a8a9aa6572e8. The exact chain is recorded in
DOCS/TEST-RESULTS/app-identity-line-publication-20261028.jsonl.
