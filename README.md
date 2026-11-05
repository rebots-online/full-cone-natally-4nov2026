# natally — The Natal Astrology Companion & 3D Astrolabe Engine

An intimate, high-fidelity natal astrology companion: a conversational AI (Natally) inhabiting a tactile, antique-inspired **3D astrolabe** built with Three.js and Swiss Ephemeris precision. Dark-only celestial-brass aesthetic. Account-scoped: your chart, conversations, and entitlements follow your Google login across every device.

## Terms, privacy and support

Natally is operated by **Robin L. M. Cheung, trading as Roche Media Services**
(sole proprietorship), within **Robin’s AI World**.

| Paywall button | Public URL | Source |
| --- | --- | --- |
| Terms of Service | https://natally.surge.sh/terms.html | `public/terms.html` |
| Privacy Policy | https://natally.surge.sh/privacy.html | `public/privacy.html` |

Use these absolute HTTPS URLs in the RevenueCat paywall’s respective Navigate to
buttons, with the in-app browser open method. Both documents are static,
unauthenticated HTML, styled by `public/legal.css`; Vite copies them to `dist/`.
The purchase dialog and About panel also link to them. Policy date: 26 October 2026.
Support, refunds, privacy and account-deletion requests:
**support@rochemediaservices.com**.

The policies distinguish the current tester bundle from an expressly offered
one-year saved-atelier package, and local history erasure from cloud account
deletion. A one-year entitlement is not a data-deletion schedule. Keep the offer,
actual data processing and these documents aligned when releasing changes.

Roche Media Services’ intended future software/commerce home is
`rochemediaservices.com`, including the eventual WooCommerce custom solution and
shared $ROCHE ecosystem; `rochemedia.ca` is also used. This is the operator’s
direction, not a claim that those future services are deployed. Global operator,
domain and legal-location records are maintained in Admin-Manual/KStore.

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
TypeScript server and its imports. It serves the generated `dist/` bundle.
Install all dependencies with `npm ci`; this source-serving workflow needs `tsx`
and does not support an installation using `npm ci --omit=dev`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Express server with Vite development middleware |
| `npm run build` | Production web bundle → `dist/` (generated locally, ignored by Git) |
| `npm run lint` | `tsc --noEmit` type gate |
| `npm start` | Serve the built production bundle with the TypeScript loader |
| `node --import tsx --test tests/*.test.* tests/natally-regression-suite.ts` | Full automated regression suite |

## Stack

Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · Three.js · Swiss Ephemeris (WASM) · Firebase (Google Auth, Firestore) · Express 5 + Gemini (server proxy) · `codegraph` for code intelligence.

## Tauri 2 feasibility and build environments

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

Large tools, caches and compilation output use E:. At setup, E: had about
762 GiB free; F: was larger at about 3.35 TiB free. Windows and Android reuse
the existing shared toolchain in `E:\DevTools`:

```powershell
# Run from this repository. These settings apply to the current process.
. .\scripts\native-build-env.ps1 -Platform windows
. .\scripts\native-build-env.ps1 -Platform android
```

The selector adds the `NDK_HOME` alias expected by Tauri and directs Cargo output
to `E:\DevTools\natally\targets\windows` or `targets\android`. Rust/Cargo,
JDK 21, SDK/NDK, Gradle/npm caches and temporary build trees reuse the shared E:
installation. It does not change global user environment settings.
An identical standalone selector is installed at
`E:\DevTools\natally\native-build-env.ps1`.

Linux uses a separate Ubuntu 22.04 WSL 2 distribution named `Natally-Build`,
whose disk is `E:\DevTools\wsl\Natally-Build\ext4.vhdx`. Linux binaries, caches
and output stay on its ext4 filesystem under `/opt/natally`, physically on E:.
Windows/Android builds remain native Windows builds. To recreate the Linux
environment on a workstation with WSL already available, retain LF line endings
in the Bash scripts when copying them from Windows:

```powershell
wsl --install Ubuntu-22.04 --name Natally-Build --location E:\DevTools\wsl\Natally-Build --no-launch --web-download
wsl -d Natally-Build -u root -- bash /mnt/f/DevProjects-2026/forgejo/natally-ai-studio/scripts/setup-linux-build-env.sh
```

Inside that distribution, source `/opt/natally/env.sh` before building (the
installed copy of `scripts/linux-build-env.sh`).
The setup pins Rust 1.94.1, Node 22.23.3 and Tauri CLI 2.11.4, verifies the Node
archive against its published SHA-256, and installs WebKitGTK 4.1 plus the native
build/bundling prerequisites. Ubuntu 22.04 is chosen to keep the Linux baseline
broader than a build made on a newer distribution; AppImage still needs testing
on supported Linux systems. This is a local manual build environment.

The unchanged frontend passed `npm run lint` and a fresh build to
`E:\DevTools\natally\web-probe`. The temporary Tauri project and package logs
are under `E:\DevTools\natally\packaging-probe` and `E:\DevTools\natally`.
No Tauri shell has been added to the production source tree by this assessment.

All three local packaging probes completed with exit status 0. The generated
probe uses Tauri 2.12.4 with CLI 2.11.4; its Cargo lockfile is retained beside
the probe source. These are experiments, not native releases:

| Target | Local result | Verification boundary |
|---|---|---|
| Windows 11 x64 | NSIS installer, 11.01 MiB; executable, 17.50 MiB | Executable stayed running for an 8-second process check and exposed the expected window title. Both files are Authenticode unsigned. UI/login/reading acceptance was not performed. |
| Android ARM64 | Debug APK, 131.04 MiB | `apksigner` verifies the debug certificate; `zipalign -c -P 16 4` passes. Packaged min SDK 24 / target SDK 36, ABI `arm64-v8a`. No connected device, installation or runtime acceptance. |
| Linux amd64 | AppImage, 86.52 MiB, built on Ubuntu 22.04 | ELF architecture and SquashFS structure verified. Desktop launch and supported-distribution runtime acceptance remain open. |

The three clearly named files are under `E:\DevTools\natally\artifacts`, with
SHA-256 values and evidence boundaries in `artifact-manifest.json`. Build logs
are in `E:\DevTools\natally`. No binary artifacts were published externally.
The Linux setup script was rerun successfully against the installed environment;
PowerShell and Bash script syntax checks also pass.

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
