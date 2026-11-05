# natally — The Natal Astrology Companion & 3D Astrolabe Engine

## Public entry, legal pages and infrastructure records

The production domain is `https://natally.robin.mba/`. Public page sources are
`marketing.html`, `public/terms.html`, and `public/privacy.html`; legal URLs are
`https://natally.robin.mba/terms.html` and `https://natally.robin.mba/privacy.html`.
The operator is Roche Media Services; support and privacy requests use
`support@rochemediaservices.com`. Source publication is not proof of deployment;
current release acceptance remains in `CHECKLIST.md` and `DOCS/RESUME.md`.

KStore Admin-Manual is the infrastructure authority. The Natally record is
`PROJECTS/Natally/INFRA/public-entry.md`, mirrored in
[DOCS/INFRA/natally-public-entry.md](DOCS/INFRA/natally-public-entry.md).
Global `robin.mba` Google ownership, DNS preservation and the operator's decision
are recorded separately at `INFRASTRUCTURE/domains/robin.mba-google-verification.md`
and mirrored in [DOCS/INFRA/robin-mba-google-verification.md](DOCS/INFRA/robin-mba-google-verification.md).
The latest customer-facing requirements are in
[DOCS/RELEASE-CLARIFICATIONS-2026-10-27.md](DOCS/RELEASE-CLARIFICATIONS-2026-10-27.md).

An intimate, high-fidelity natal astrology companion: a conversational AI (Natally) inhabiting a tactile, antique-inspired **3D astrolabe** built with Three.js and Swiss Ephemeris precision. Dark-only celestial-brass aesthetic. Account-scoped: your chart, conversations, and entitlements follow your Google login across every device.

## What it does

- **Precise natal charts** — Swiss Ephemeris (WASM, vendored): exact Placidus house semi-arcs, geocentric ecliptic coordinates, aspect mechanics with verbatim degrees/minutes. Unknown birth time → honestly labeled Whole Sign.
- **3D astrolabe** — rotating velvet-plum torus wheel, surface-superimposed zodiac, house spokes, harmonic aspect chords (coral tension / blue harmony), 3D raycasting tooltips with contemplative drift.
- **Natally companion** — a conversational stream (Gemini via server proxy) with voice, time-of-day mirroring, drag-anywhere chat card, and contextual astrological wisdom.
- **First Light onboarding** — a typewriter-question intake (name → date → place → time) that runs once per account, successfully, then never again.
- **Account substrate (end-state)** — Firebase Google login gates the app; chart, conversations, semantic memory (vector-searchable lore), and license entitlements persist per-user in Firestore.
- **Export** — readings, PDF/image chart exports.

## Quickstart

Use Node.js 24 LTS and npm (verified on native Windows with Node 24.19.0 and
npm 11.17.0). Install from the committed npm lockfile:

```bash
npm ci
cp .env.example .env
npm run dev
```

In PowerShell, use `Copy-Item .env.example .env` for the copy step. Open
`http://localhost:49418` (or set `PORT` before starting). Google and email login
precede First Light onboarding; returning accounts load their saved profile.

The example contains the public hosted chat URL and voice defaults used by
[the reference implementation](https://natally.surge.sh). Copy it **before
building**: without `VITE_CHAT_API_URL`, the bundle builds but hosted readings
report that their endpoint is not configured. Firebase's public application
configuration is committed in `firebase-applet-config.json`. Provider secrets
belong on the backend, never in `VITE_*` browser variables.

Local end-to-end authentication/readings additionally depend on the existing
Firebase project's authorized domains and the hosted backend's allowed frontend
origin. On 13 October 2026, preflight from the Surge origin returned 204, while
`http://localhost:43128` returned 403; a localhost build needs an approved backend
configured for its origin. Starting the legacy Express
proxy does not replace the authenticated hosted calculation API. Speech models
are fetched on first use and cached in the browser; downloaded models and private
credentials are deliberately excluded from Git.

To build the complete test matrix and serve its web bundle locally (Windows 11 or Ubuntu 24.04):

```bash
npm run lint
node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts
npm run build
npm start
```

`npm start` sets production mode and uses the installed `tsx` loader for the
TypeScript server and its imports. It serves the generated `dist-web/` staging bundle.
Install all dependencies with `npm ci`; this source-serving workflow needs `tsx`
and does not support an installation using `npm ci --omit=dev`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Express server with Vite development middleware |
| `npm run build` / `npm run build:all` | One stamped full platform matrix; retained artifacts in tracked `dist/` |
| `npm run lint` | `tsc --noEmit` type gate |
| `npm start` | Serve the built production bundle with the TypeScript loader |
| `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts` | Full automated regression suite |

## Stack

Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · Three.js · Swiss Ephemeris (WASM) · Firebase (Google Auth, Firestore) · Express 5 + Gemini (server proxy) · `codegraph` for code intelligence.

## Coordinated Tauri 2 test build

For a local web compile and browser inspection without release side effects, run
`bash build_all.sh --verify-web`. This compiles the real app and landing into
`build/verify-web/site`, without changing versions, resolving stored credentials,
installing native tools, pushing Git, or deploying. It is not a release and does
not generate a release service worker. Production builds still use the complete
coordinator below. The no-deploy GitHub workflow retains desktop/mobile screenshots
and the compiled site as verification artifacts.

Run **one command on either build computer** (Windows 11 or Ubuntu 24.04):

```bash
npm run build:all
```

`build_all.sh` at the repository root is the **only** build entry (`npm run build`,
`build:all` and `build:web` call it). Every invocation auto-stamps the version
and attempts every platform together; it senses the host itself:

| Output | Ubuntu 24.04 (`build_all.sh`) | Booted into Windows 11 (`build_all.sh` → `scripts/build-all-platforms.ps1`) |
|---|---|---|
| Android AAB, native-debug-symbols ZIP, APK | cross (Linux NDK) | cross (Windows NDK) |
| Windows standalone EXE + NSIS | cross-compiled (`cargo-xwin`) | native |
| Windows MSI (Microsoft Store) | left *pending*, never *failed* | native (WiX) |
| Linux AppImage / DEB / RPM | native | WSL `Ubuntu-24.04` |
| Web ZIP + nginx/Apache installer, installable PWA | yes | yes |

Web targets are https://natally.robin.mba and https://natally.surge.sh:

```bash
bash build_all.sh --deploy-web --domains "natally.robin.mba,natally.surge.sh"   # build + publish web/PWA
bash build_all.sh --deploy-existing dist/<prefix>-test-build-inventory.json      # republish a completed build
bash build_all.sh --help
```

Each run fast-forwards from `origin` before stamping and pushes the stamp at
once, so both computers share one monotonic counter through `version.json`.
Ubuntu prerequisites: `sudo bash scripts/setup-linux-build-env.sh`,
`rustup target add x86_64-pc-windows-msvc`, `cargo install --locked cargo-xwin tauri-cli`,
and the Android SDK/NDK under `$ANDROID_HOME`. Linux caches default to
`~/.cache/natally-ai-studio` (`NATALLY_BUILD_CACHE`); from Windows they stay on
`E:\BuildCache`. On Windows, `npm run build` may start WSL's bash; `build_all.sh`
detects a WSL session on a `/mnt/<drive>` checkout and still hands off to the ps1,
so the MSI is built. `--continue` exists only on the Windows half.

`npm run build` and the compatibility alias `npm run build:web` invoke the same
complete coordinator. There is no public web-only/native-only release command.
The coordinator stamps `version.json` once, advances MINOR even if a build fails,
and derives version.txt, npm/Cargo/Tauri versions, Android versionName/versionCode,
MSI metadata, visible labels and artifact filenames from that stamp. The visible
format is `vMAJOR.MINOR.BUILD`, with five BUILD digits. Package formats that reject
leading zeros use a normalized numeric SemVer recorded in the inventory. MAJOR
remains operator-controlled.

Each invocation attempts all of these outputs under the same frozen source and
release identity, continuing to other groups if one platform fails:

| Group | Required outputs |
|---|---|
| Windows 11 x64 | standalone EXE, NSIS EXE, MSI (MSI on the Windows host only) |
| Ubuntu 24.04 amd64 (native, or WSL from Windows) | AppImage, DEB, RPM |
| Android ARM64 | test-signed APK, AAB, matching native debug-symbol ZIP |
| Web | site ZIP, nginx/Apache installation script |

Windows and Android reuse the shared installed toolchains selected by
`scripts/native-build-env.ps1`. Compilation and npm caches use
`E:\BuildCache\natally-ai-studio`; Linux reuses the installed tools and the
existing `Ubuntu-24.04` WSL distribution. The script installs missing Ubuntu
packaging prerequisites there. It does not create another distribution.

Every available artifact is immediately retained in tracked, durable root
`dist/` with a versioned filename, SHA-256 and verification evidence. This folder
also preserves earlier builds. Original AppImages are retained byte-for-byte in
`../outbox/natally-ai-studio/`, outside the repository, as directed on 27 October.
The interrupted v0.9.84736 build is retained in that outbox's
`interrupted-v0.9.84736/` directory and is not a completed release.
Disposable frontend staging is `dist-web/`; Tauri and the local production server consume that staging directory. Completion
fails unless all ten outputs and their retained hashes pass. No production
release pointer or deployment is changed by a test build.

An interrupted invocation may be resumed with:

```powershell
bash build_all.sh --continue   # Windows only
```

Continuation validates the existing invocation, frozen source/version and hashes;
it never restamps or substitutes different source. Source changes require a new
complete invocation. Private Vite/Tauri hooks reject missing or foreign invocation
context. A simultaneous invocation is rejected by an exclusive matrix lock.

The web ZIP contains `site/`, `version.json` and `install-web.sh`. On the target
server, extract it and preview either supported server configuration:

```bash
bash install-web.sh --server nginx --domain example.org --destination /var/www/natally-ai-studio
bash install-web.sh --server apache --domain example.org --destination /var/www/natally-ai-studio
```

Installation requires an explicit `--apply` on that server. The matrix checks
syntax and both previews; it does not install a web server or deploy production.

The favicon, PWA icons, Windows resources, Linux icon and Android launcher assets
are derived from `public/branding/natally-icon-master.png`: Natally with a natal
chart beside her head on the viewer's right and alpha-transparent outer corners.
Tapping the in-app mark plays a brief independent pointing-character/chart
sequence, with a matching dismissible native Android opening animation. Reduced
motion settings retain a still presentation.

These are Tauri 2 **test packages**. Windows packages are unsigned; Android uses
the local test certificate. Google `signInWithPopup` is still a native integration
gap: packaging and build-stamping do not repair `auth/popup-blocked`. Native
login, allowed backend origins, file/share integration and actual device/runtime
acceptance remain separate work. Supertonic is unchanged.

## Documentation map

| Document | Role |
|---|---|
| `DOCS/PRD.md` | Product requirements (Admin-Manual minimum shape) — governance + product baseline |
| `DOCS/ARCHITECTURE.md` | Baseline architecture of the current build |
| `DOCS/ARCHITECTURE-MERGED-10oct2026-15h00.md` | **End-state architecture**: login-first → First Light → account-scoped Firestore, conversations, embeddings, license keys; entity tables; Stitch wire-up |
| `DOCS/MIGRATION-PLAN-10oct2026-15h00.md` | The three migration tasks (login gate, onboarding port, cloud persistence) as a checkable plan |
| `CHECKLIST.md` | Coder contract — implementation tracking |
| `LIBS/UI/STITCH/` | Frozen screen-design artifacts (the complement the architecture reads) |

## Licensing / commerce direction

Entitlement will be natally's own **Ed25519-signed license system** (offline-verifiable "heirloom codes", per-reading metering) issued by a self-hosted WooCommerce license bridge (org-wide plugin, planned). No third-party purchase SDKs. See the PRD §5 and the merged architecture doc.

---

© Robin L. M. Cheung, MBA — Celestial Brass & Starlight.


### Landing-page contract and architecture review

- [Landing-page specification](DOCS/LANDING-PAGE/SPEC.md): requirement IDs and acceptance.
- [Landing-page architecture](DOCS/LANDING-PAGE/ARCHITECTURE.md): entities, data ownership, flows and DOM hooks.
- [Snapshot divergence table](DOCS/AUDITS/divergences-20261028.md): separates contract divergence from unfinished checklist work.
- [Recoverable decision checkpoints](DOCS/CHECKPOINTS.md).

The complete build coordinator accepts `npm run build:all -- -Major 1` for the
explicit correction from the legacy major-zero stamp. It retains and increments
the minor counter, updates every platform from one stamp, and rejects a major
change with `-Continue`. See [release evidence](DOCS/TEST-RESULTS/release-continuation-20261028.md).

### Current architecture realization review

The controlling specification for this correction is R9, R10 and the operator's
balance/tax clarification in [DOCS/ARCHITECTURE.md](DOCS/ARCHITECTURE.md), with the
independent recipe and actual delivery states in [CHECKLIST.md](CHECKLIST.md).
The earlier source review is retained in Git history; this statement supersedes
its payment interpretation.

I compared the assigned code with those contracts and returned deviations to the
same coders for correction. The completed source implements compact Cr display,
consistent header controls, direct preset purchase actions, exact custom amounts,
plain account wording, and real RevenueCat SDK checkout. Quotes retain billing
facts, base amount, manually calculated tax and the real product at the total.
Authenticated transaction evidence controls one-time fulfillment and official
receipts. RevenueCat ROCHE is the balance authority, with exact integer USD-micro
accounting, actual usage debits, and provider allowance derived from that balance.
The environment-defined permanent redemption sets the configured available
allowance once per request, without an account-wide redemption restriction.

The supervising comparison covered the new commerce/catalog/tax/wallet modules,
their runtime and custody integration, the three submitted checkout client files,
the administrative adapter, runtime packaging, and matching annotated bindings.
Corrections include the provider's location-field meaning, the two-decimal Cr
display contract, and forwarding the actual runtime catalog bindings. Existing
speech admission and unique-story lore corrections remain in the prior source.

I attest that this completed source correction realizes its assigned R9/R10
contracts, including the later explicit balance and tax clarification. This is a
source-level attestation made before building; the published iteration and actual
purchase outcome are recorded separately. It does not assert that unrelated open
product assignments are complete. The configured tax policy currently covers
Canadian provinces and territories; unsupported jurisdictions are rejected before
payment. In-vivo delivery proceeds as instructed, and native builds remain held
until the web purchase flow works.

The approved callback and its information disclosure are documented in the
[domain and hosting report](DOCS/INFRA/run-app-due-diligence-20261031.md).

### Restored explanations — R11 source attestation

I compared both assigned coders' changes with frozen architecture R11 and its
independent recipes. The shared customer explanation contains the specified
benefit heading and copy before balance/payment controls in both account entry
points. Chart mouseovers use the actual target's explanation while inset;
per-renderer viewport overlays measure the whole pane, clear it by12px and keep
an8px viewport margin, adapting to available sides and dismissing stale content.
The same-coder correction rebuilds/restores foreground endpoint labels after an
inset transition, including the souvenir view. Existing focus, drag, zoom and
selection paths remain intact.

I attest that these submitted source changes realize their frozen R11 assignments
one to one. This completes the assigned semantic comparison before building;
publication and the preauthored actual-observation rubric remain separate delivery
outcomes in CHECKLIST.md. Further operator corrections to restore behavior,
compact actions and complete service offers remain open and are not certified by
this source attestation.
