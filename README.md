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

To build the complete test matrix and serve its web bundle locally on the native Windows host:

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

Run **one command on the native Windows host**:

```powershell
npm run build:all
```

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
| Windows 11 x64 | standalone EXE, NSIS EXE, MSI |
| Existing Ubuntu 24.04 WSL, amd64 | AppImage, DEB |
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
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/build-all-platforms.ps1 -Continue
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
