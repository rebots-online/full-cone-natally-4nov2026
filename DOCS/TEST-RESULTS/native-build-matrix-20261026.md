# Natally coordinated test build — 26 October 2026

Local full-matrix outcome: **PASS, v0.8.83688, all 10 outputs verified**.

- Invocation: `401dde24-7969-42c8-9654-94470471ff45`.
- Source snapshot SHA-256: `7fd6767d71c3d16d25787f779b27ccf573d885b90f057182394136c2060e9f5d`.
- Git base: `1fa7f50600998bc4e26b31d54bb247c2954c495f`; version mirrors stamped after that checkpoint.
- Completed: `2026-10-26T13:56:17.784Z`.
- Kind: Tauri 2 test build, productionRelease=false.
- Host route: native Windows for EXE/NSIS/MSI and Android; the existing Ubuntu 24.04 WSL for AppImage/DEB.
- Tools/caches reused on E:, compilation targets under E:/BuildCache/natally-ai-studio; Linux packaging cache/temp also on E:.
- The previous v0.7.83657 invocation also completed all 10 outputs. The final v0.8.83688 run adds the visible sign-in/opening version stamp and explicit SquashFS verification.

## Automated evidence

`npm run build:all` ran the complete matrix, with no target selector. MINOR advanced once at invocation start. Private Vite/Tauri hooks verified the invocation and frozen source before compiling; the same frozen web bundle was reused for every native package. All platform groups were attempted in one coordinator run. `assert-complete` returned success only with all ten retained hashes verified.

TypeScript passes. Eight release-state tests pass (five-digit BUILD, normalized package SemVer, advancing MINOR, internal versionCode, MSI bounds, incomplete matrix, context rejection and corrupted retained bytes). Five mascot/resource tests pass. A simultaneous-invocation probe was rejected by the exclusive lock without consuming a stamp. A completed `-Continue` run revalidated source and all artifact hashes, skipped all verified groups, and kept v0.8.83688 unchanged.

Production browser acceptance passes for the visible v0.8.83688 sign-in stamp, the shipped 32-pixel favicon's four alpha-zero corners, and the guiding reaction. The component browser acceptance passes pointer, Space, Enter, repeat activation, timer reset, image readiness and reduced motion. Actual gesture recording: [WebM](../../dist/natally-ai-studio-v0.8.83688-icon-guiding.webm). Actual production page: [PNG](../../dist/natally-ai-studio-v0.8.83688-web-icon-gesture.png).

The Windows executable reports ProductVersion `0.8.83688`; its extracted 32-pixel icon differs from the generated ICO by `0` pixels and the corner alpha is `0`. The MSI ProductVersion is the documented numeric mapping `0.0.8.18152`. Windows test packages are unsigned.

The APK passes apksigner verification and 16 KiB zipalign checks. APK and AAB carry canonical versionName v0.8.83688 (without the display-only v in the Android manifest), with internal versionCode 8. The AAB JAR signature verifies. The debug-symbol ZIP's ELF build IDs match the AAB's ARM64 native libraries. Android packages use the local Android test certificate.

Linux DEB metadata identifies amd64 and version 0.8.83688; the AppImage has an ELF runtime and a valid SquashFS structure. The web ZIP passes a complete ZIP CRC check; both nginx and Apache installer previews and Bash syntax checks pass under Ubuntu 24.04. No target-server installation was performed.

## Retained outputs

| Target | File | Bytes | SHA-256 |
|---|---|---:|---|
| windows-exe | [natally-ai-studio-v0.8.83688-win11-x64-standalone.exe](../../dist/natally-ai-studio-v0.8.83688-win11-x64-standalone.exe) | 27904512 | `f5de6ceb265dc47d4133cccd5a9099b90080441c8bef894c5b3bc261d63ec5c1` |
| nsis | [natally-ai-studio-v0.8.83688-win11-x64-nsis.exe](../../dist/natally-ai-studio-v0.8.83688-win11-x64-nsis.exe) | 21174804 | `b1c7b792440a09dfed1f159781c73e4001afd6975ce1d826b7c29115ef138fc8` |
| msi | [natally-ai-studio-v0.8.83688-win11-x64-msi.msi](../../dist/natally-ai-studio-v0.8.83688-win11-x64-msi.msi) | 22171648 | `3f3995e91eb28569efda0ff0db617056c32796dd7fa4049f770e4d8c88f641cb` |
| appimage | [natally-ai-studio-v0.8.83688-linux-amd64.AppImage](../../dist/natally-ai-studio-v0.8.83688-linux-amd64.AppImage) | 110746104 | `605c1e6ea980c3c87fbae555d54f46c91a66937e3728f46f0e0905b4956e421f` |
| deb | [natally-ai-studio-v0.8.83688-linux-amd64.deb](../../dist/natally-ai-studio-v0.8.83688-linux-amd64.deb) | 37696930 | `eb136a3ec2c1224ffbac6e7e40637b3a6345affa6285f74bdd191f038527a1e2` |
| apk | [natally-ai-studio-v0.8.83688-android-arm64-test.apk](../../dist/natally-ai-studio-v0.8.83688-android-arm64-test.apk) | 89676879 | `5adf6e393bf8f44a6af13ffc889174bfbfe12064d2230ce01655d69df8cf0a43` |
| aab | [natally-ai-studio-v0.8.83688-android-arm64-test.aab](../../dist/natally-ai-studio-v0.8.83688-android-arm64-test.aab) | 38612536 | `2b6ee84431675ada4b7c1335c50db196d49f2b809246a0ce4e04935373fbc21e` |
| android-symbols | [natally-ai-studio-v0.8.83688-android-arm64-native-debug-symbols.zip](../../dist/natally-ai-studio-v0.8.83688-android-arm64-native-debug-symbols.zip) | 12476129 | `b92b89ef4dcd32042f5b1f16a1e0f9b4b2e6a09e817c45bab007cf7b162fa6c7` |
| web | [natally-ai-studio-v0.8.83688-webapp.zip](../../dist/natally-ai-studio-v0.8.83688-webapp.zip) | 21432151 | `77e81046c811fc8d14fb30cc89c73c5fbb119198c8ae465734126baaac1a7853` |
| web-installer | [natally-ai-studio-v0.8.83688-install-web.sh](../../dist/natally-ai-studio-v0.8.83688-install-web.sh) | 2978 | `f9e6c73b94b45f4746b62b353059ed153a93e412a447e84d0fe9423a97807bce` |

The full JSON/XML inventories are in root dist. Earlier failed preparation/source-normalization attempts retain their own versioned records; no earlier artifact was overwritten or removed.

## Publication and acceptance boundary

The branch is `codex/native-build-matrix`. GitHub rejected its push with: **This repository exceeded its LFS budget**. AppImages exceed normal GitHub's per-file limit and are currently tracked through Git LFS. The complete binaries and local LFS objects are preserved. Remote publication awaits the operator's pending transport choice or restored GitHub LFS capacity.

Native Google sign-in remains unimplemented: AuthModal still uses Firebase signInWithPopup, so the Tauri auth/popup-blocked deficiency is not repaired by this build. Android's native guiding opening overlay compiles into APK/AAB; no physical-device animation/login acceptance is asserted. Linux desktop launch and native audio/device acceptance were not performed. Supertonic source is unchanged by this icon/build work. No production deployment, store submission, purchase, provider funding or main-branch update was performed.
