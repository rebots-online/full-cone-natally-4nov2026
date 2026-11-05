# natally — The Natal Astrology Companion & 3D Astrolabe Engine

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
`http://localhost:3000` (or set `PORT` before starting). Google and email login
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

To build and serve the production bundle locally:

```bash
npm run lint
node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts
npm run build
npm start
```

`npm start` sets production mode and uses the installed `tsx` loader for the
TypeScript server and its imports. It serves the generated `dist-web/` bundle.
Install all dependencies with `npm ci`; this source-serving workflow needs `tsx`
and does not support an installation using `npm ci --omit=dev`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Express server with Vite development middleware |
| `npm run build` | Automated, version-stamped full platform matrix; durable artifacts and inventory in tracked `dist/` |
| `npm run build:all` | Same coordinated build entry point as `npm run build` |
| `npm run lint` | `tsc --noEmit` type gate |
| `npm start` | Serve the built production bundle with the TypeScript loader |
| `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts` | Full automated regression suite |

## Stack

Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · Three.js · Swiss Ephemeris (WASM) · Firebase (Google Auth, Firestore) · Express 5 + Gemini (server proxy) · `codegraph` for code intelligence.

## Tauri 2 test builds

Assessment on 18 October 2026: the existing React/Vite application is a good
candidate for Tauri 2 on Windows 11, Android and Linux AppImage. The frontend
already builds to static assets, and authenticated inference is a separate hosted
service. A native port can reuse this frontend and keep that backend boundary.
Packaging does not make the hosted reading service available offline.

The remaining product integration work is concrete:

- Replace or adapt Firebase Google `signInWithPopup` for the native app, with
  separate Google/email verification and persistent returning-user sessions.
- Configure explicitly allowed native API origins. Live OPTIONS checks on
  18 October returned 204 for `https://natally.surge.sh`, and 403 for both
  `http://tauri.localhost` and `tauri://localhost`. Keep authentication and the
  existing web origin working.
- Adapt browser downloads, PDF/image saves, clipboard and external links to
  native file/share/open behavior where required, especially on Android.
- Verify the existing Three.js/WebGL chart, Swiss Ephemeris WASM, Supertonic
  worker, WebGPU/WASM fallback, model cache, Web Audio and karaoke on each actual
  WebView. Android keyboard, back navigation, safe areas and lifecycle recovery
  remain device acceptance gates.
- Add a maintained Tauri shell, app identifiers/icons, scoped capabilities,
  platform configuration and release signing. An isolated packaging probe is
  not a released native implementation.

All builds must be automated by the repository's all-platform script. It stamps
one version per invocation and uses that version for the entire artifact matrix:
Windows 11 application EXE, NSIS and MSI; Linux AppImage and DEB; Android APK,
AAB and matching native debug symbols; and a web ZIP with an nginx/Apache installer.
Individual environment selectors are internal helpers, not a supported build procedure.

Run `npm run build` from native Windows. A fresh invocation always increments
MINOR before preflight, including failed attempts. Use
`powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/build-all-platforms.ps1 -Continue`
only to resume an incomplete invocation with identical frozen source; it verifies
the source fingerprint and keeps the same stamp. Every platform is attempted;
any incomplete artifact matrix returns failure and identifies the missing output.
The web ZIP contains the site, canonical version and `install-web.sh`. The installer
previews nginx/Apache configuration by default; installation requires explicit
`--apply`, server, domain and destination arguments.

Linux builds use the existing default **Ubuntu 24.04** WSL distribution and its
installed tooling. Do not create another distribution or use Ubuntu 22.04.
The unnecessary `Natally-Build` distribution was removed on 19 October 2026.
Windows and Android reuse installed native tools; application source stays in
this repository. Disposable build trees are separate from tracked root `dist/`,
which retains stamped artifacts, manifests and verification evidence.

The earlier isolated probes are retained under
`LOCAL-BUILD-WORK/natally-ai-studio-native-work/` for provenance. They are not
outputs of the maintained all-platform script and do not establish native product
acceptance. These Tauri 2 builds are tests; authentication, hosted API origins,
audio and physical-device acceptance remain separate checks.

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
