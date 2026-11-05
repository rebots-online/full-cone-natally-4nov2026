#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# build_all.sh — THE ONLY build entry for Natally (npm run build / build:all /
# build:web all call this). Admin-Manual doctrine it implements:
#
#   CC2   NOBODY sets a version. `release-state.mjs stamp` autoincrements MINOR
#         on every invocation, success or failure, and the stamp is committed
#         and pushed immediately so both build computers share one counter.
#   CC9   Commits are prefixed `v<MAJOR.MINOR.BUILD>:`.
#   CC11  ONE invocation builds EVERY platform together — never per-target.
#         Windows artifacts are cross-compiled from Linux; only the Microsoft
#         Store artifact (MSI, WiX) needs native Windows.
#   CC12  Every artifact is stamped (product + version) and staged in dist/.
#   CC13  GitHub blob limit: only dist files < 95 MB are committed.
#
#   Platform        Artifacts                         Ubuntu host      Windows host
#   ─────────────── ───────────────────────────────── ──────────────── ──────────────
#   Android         .aab, native-debug-symbols .zip,  cross (NDK)      cross (NDK)
#                   .apk
#   Windows 11      standalone .exe, NSIS .exe        cargo-xwin       native
#                   .msi (Microsoft Store)            pending*         native (WiX)
#   Linux           AppImage, .deb, .rpm              native           WSL Ubuntu-24.04
#   Web             webapp .zip + install-web.sh,     yes              yes
#                   installable PWA
#   * MSI is left PENDING (never failed) on Linux; the matrix completes when
#     build_all.sh next runs while booted into Windows.
#
# Web targets: https://natally.robin.mba and https://natally.surge.sh
#   --deploy-web --domains "natally.robin.mba,natally.surge.sh"  (or SURGE_DOMAINS)
#   publishes the verified web/PWA during the run; --deploy-existing <inventory>
#   [--verify-only] republishes or verifies an already-completed build.
#
# Host sensing (no flags needed):
#   • Linux (Ubuntu 24.04)                → the matrix below.
#   • Git Bash / MSYS on Windows          → scripts/build-all-platforms.ps1
#   • WSL, checkout on a Windows drive    → scripts/build-all-platforms.ps1 via
#     (/mnt/<x>/…; what `npm run build`     powershell.exe interop — so MSI is
#      from cmd.exe launches)               still built on the Windows machine.
#   The ps1 is the Windows-side half of this script (native EXE/NSIS/MSI,
#   Android, web, Linux through WSL); flags are translated for it below.
#
# Restored 2026-11-02 from natally-ubuntu build_all.sh (f6fbddf..22232c5) after
# a Windows-hosted session replaced the npm build entries with powershell.exe-
# only calls. Fixes made while restoring: pushes the current branch (not a
# hard-coded master); fast-forwards before stamping; SemVer-matched NSIS lookup;
# PE ProductVersion read from the string resource; scratch under build/.
# ═══════════════════════════════════════════════════════════════════════════
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

usage() {
  sed -n '2,/^# ═══*$/p' "$0" | sed -n '2,$p' | sed 's/^# \{0,1\}//' | head -n -1
  echo 'Flags: --major N | --deploy-web | --domains LIST | --deploy-existing INVENTORY [--verify-only] | --continue (Windows only)'
}

# ── Arguments (one spelling for both hosts; translated for the ps1) ─────────
# Web deploys first on every run (Robin 2026-11-03).
MAJOR=''; DEPLOY_WEB=1; DOMAINS=''; DEPLOY_EXISTING=''; VERIFY_ONLY=0; CONTINUE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --major|-Major)                [ $# -ge 2 ] || { echo "$1 needs a number" >&2; exit 2; }; MAJOR="$2"; shift 2 ;;
    --deploy-web|-DeployWebDuringBuild) DEPLOY_WEB=1; shift ;;
    --no-deploy-web)               DEPLOY_WEB=0; shift ;;
    --domains|-DeployDomains)      [ $# -ge 2 ] || { echo "$1 needs a list" >&2; exit 2; }; DOMAINS="$2"; shift 2 ;;
    --deploy-existing|-DeployExisting) [ $# -ge 2 ] || { echo "$1 needs an inventory path" >&2; exit 2; }; DEPLOY_EXISTING="$2"; shift 2 ;;
    --verify-only|-VerifyOnly)     VERIFY_ONLY=1; shift ;;
    --continue|-Continue)          CONTINUE=1; shift ;;
    -h|--help)                     usage; exit 0 ;;
    *) echo "Unknown argument: $1 (see --help)" >&2; exit 2 ;;
  esac
done

# ── Host sensing: Windows hands the whole matrix to the ps1 half ────────────
HOST=linux
if [ "${OS:-}" = "Windows_NT" ] || [[ "${OSTYPE:-}" =~ ^(msys|cygwin) ]]; then
  HOST=windows
elif grep -qi microsoft /proc/version 2>/dev/null && [[ "$ROOT" == /mnt/[a-z]/* ]] && command -v powershell.exe >/dev/null 2>&1; then
  HOST=windows-via-wsl
fi
if [ "$HOST" != linux ]; then
  PS1="scripts/build-all-platforms.ps1"
  [ "$HOST" = windows-via-wsl ] && PS1="$(wslpath -w "$ROOT/$PS1")"
  PS_ARGS=()
  [ -n "$MAJOR" ]           && PS_ARGS+=(-Major "$MAJOR")
  [ "$DEPLOY_WEB" = 1 ]     && PS_ARGS+=(-DeployWebDuringBuild)
  [ "$DEPLOY_WEB" = 1 ] && [ -z "$DOMAINS" ] && DOMAINS="${SURGE_DOMAINS:-natally.robin.mba,natally.surge.sh}"
  [ -n "$DOMAINS" ]         && PS_ARGS+=(-DeployDomains "$DOMAINS")
  [ -n "$DEPLOY_EXISTING" ] && PS_ARGS+=(-DeployExisting "$DEPLOY_EXISTING")
  [ "$VERIFY_ONLY" = 1 ]    && PS_ARGS+=(-VerifyOnly)
  [ "$CONTINUE" = 1 ]       && PS_ARGS+=(-Continue)
  echo "build_all.sh: Windows host ($HOST) → $PS1 ${PS_ARGS[*]}"
  exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$PS1" "${PS_ARGS[@]}"
fi
if [ "$CONTINUE" = 1 ]; then
  echo '--continue resumes a frozen Windows matrix and exists only in the ps1 half; on Linux start a new invocation.' >&2; exit 2
fi

# ── Linux (Ubuntu 24.04) matrix ──────────────────────────────────────────────
say() { printf '\n=== %s ===\n' "$*"; }
mark_failed() { for t in "$@"; do node scripts/release-state.mjs fail "$t" "$FAILMSG" || true; done; }
run_step() { # run_step <name> <target list> <command...>
  local name="$1"; shift; local targets="$1"; shift
  say "$name"
  if "$@"; then return 0; fi
  FAILMSG="$name failed with exit $? (recorded; matrix continues)"
  echo "$FAILMSG" >&2
  mark_failed $targets
  return 0
}
push_current() { git push -q origin HEAD || git push -q origin HEAD; }

mkdir -p build dist
exec 9>"build/matrix.lock"
flock -n 9 || { echo 'Another matrix invocation holds build/matrix.lock.' >&2; exit 1; }
SCRATCH="build/scratch"; mkdir -p "$SCRATCH"

say 'Environment contract'
node scripts/environment.mjs check || true
while IFS='=' read -r k v; do
  [ -n "$k" ] && [[ "$k" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] && export "$k=${v//$'\n'/ }"
done < <(node scripts/environment.mjs resolve --json | node -e '
  let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
    for (const [k, v] of Object.entries(JSON.parse(s)))
      if (typeof v === "string") process.stdout.write(k + "=" + v.replace(/\n/g, " ") + "\n");
  });')

DOMAINS="${DOMAINS:-${SURGE_DOMAINS:-natally.robin.mba,natally.surge.sh}}"
deploy_inventory() { # deploy_inventory <inventory> [extra deploy-existing flags...]
  local inventory="$1"; shift
  [ -n "$DOMAINS" ] || { echo 'Deployment domains required: --domains "natally.robin.mba,natally.surge.sh" or SURGE_DOMAINS.' >&2; return 2; }
  NATALLY_DEPLOY_COORDINATOR=1 NATALLY_DEPLOY_INVENTORY="$inventory" \
    node scripts/deploy-existing.mjs --inventory "$inventory" --domains "$DOMAINS" "$@"
}
if [ -n "$DEPLOY_EXISTING" ]; then
  # Completed-artifact deployment: no stamp, no build. deploy-existing.mjs
  # re-verifies every hash in the selected inventory before publishing.
  [ -f "$DEPLOY_EXISTING" ] || { echo "Selected inventory does not exist: $DEPLOY_EXISTING" >&2; exit 2; }
  if [ "$VERIFY_ONLY" = 1 ]; then deploy_inventory "$DEPLOY_EXISTING" --verify-only; else deploy_inventory "$DEPLOY_EXISTING"; fi
  exit $?
fi
[ "$VERIFY_ONLY" = 1 ] && { echo '--verify-only requires --deploy-existing <inventory>.' >&2; exit 2; }
if [ "$DEPLOY_WEB" = 1 ] && [ -z "$DOMAINS" ]; then
  echo '--deploy-web needs --domains "natally.robin.mba,natally.surge.sh" or SURGE_DOMAINS.' >&2; exit 2
fi

say 'Stamp (automatic — nobody sets the version)'
# Two build computers share version.json through Git: take the other host's
# latest stamp first so this one never reuses its number.
git pull -q --ff-only origin "$(git rev-parse --abbrev-ref HEAD)" \
  || echo 'WARNING: could not fast-forward before stamping; version may collide with the other build host' >&2
[ -d node_modules ] || npm ci
node scripts/release-state.mjs stamp ${MAJOR:+"$MAJOR"}
state() { node -p "JSON.parse(require('fs').readFileSync('build/release-state.json','utf8')).$1"; }
VERSION=$(state version); SEMVER=$(state semverVersion); INVOCATION=$(state invocationId); PREFIX=$(state prefix)
export NATALLY_RELEASE_ID="$INVOCATION" NATALLY_BUILD_VERSION="$VERSION"
# Assembled credential backup for this version → Admin-Manual (values never logged).
node scripts/assemble-env-backup.mjs "$SEMVER" || echo "assembled credential backup skipped" >&2
exec > >(tee -a "dist/$PREFIX-build.log") 2>&1
say "v$VERSION — invocation $INVOCATION — host $(hostname)"
git add version.json version.txt package.json package-lock.json \
  src-tauri/tauri.conf.json src-tauri/Cargo.toml src-tauri/Cargo.lock 2>/dev/null || true
git commit -q -m "v${VERSION}: stamp (build_all.sh on $(hostname))" || true
push_current || echo 'stamp push deferred (will retry at finish)'

say 'Preparation'
export CARGO_TARGET_DIR="${CARGO_TARGET_DIR:-$ROOT/build/target}"
bash scripts/setup-linux-build-env.sh \
  || echo 'Missing apt prerequisites (run: sudo bash scripts/setup-linux-build-env.sh); affected steps will record failures' >&2
if command -v cargo >/dev/null 2>&1; then
  [ -f src-tauri/gen/android/app/build.gradle.kts ] || cargo tauri android init || true
  command -v cargo-xwin >/dev/null || echo 'cargo-xwin missing (cargo install --locked cargo-xwin); Windows cross step will record failure' >&2
  rustup target list --installed 2>/dev/null | grep -qx x86_64-pc-windows-msvc \
    || echo 'Rust target x86_64-pc-windows-msvc missing (rustup target add x86_64-pc-windows-msvc)' >&2
else
  echo 'cargo not found on PATH; native/android/cross steps will record failures' >&2
fi
PREP=0
node scripts/configure-android.mjs || PREP=1
node scripts/prepare-icons.mjs || PREP=1
npm run lint || PREP=1
if [ "$PREP" -ne 0 ]; then
  say 'Preparation failed — recording full matrix failure and finishing honestly'
  for t in windows-exe nsis msi appimage deb rpm apk aab android-symbols web web-installer pwa; do
    node scripts/release-state.mjs fail "$t" 'Preparation failed before freeze' || true
  done
  node scripts/release-state.mjs finish || exit 1
  exit 1
fi
node scripts/release-state.mjs freeze

build_web() {
  node scripts/build-web.mjs || return 1
  local web="build/$PREFIX-web-package"
  [ -e "$web" ] && { echo "Unverified web staging directory already exists: $web" >&2; return 1; }
  mkdir -p "$web"
  cp -r dist-web "$web/site"
  cp scripts/install-web.sh version.json "$web/"
  grep -q "v$VERSION" "$web/site/index.html" || { echo 'Web version label missing' >&2; return 1; }
  local zip="build/$PREFIX-webapp.zip"
  (cd "$web" && python3 -m zipfile -c "$ROOT/$zip" .) || return 1
  python3 -m zipfile -t "$zip" || return 1
  node scripts/release-state.mjs stage web "$zip" webapp.zip \
    "Web production bundle and visible v$VERSION; archive includes site, version and installer"
  node -e "const p=require('./dist-web/pwa-build.json'),s=require('./build/release-state.json');\
if(p.version!==s.version||p.invocationId!==s.invocationId){console.error('PWA release identity mismatch');process.exit(1)}" || return 1
  [ -f dist-web/sw.js ] || { echo 'PWA service worker missing' >&2; return 1; }
  node scripts/release-state.mjs stage pwa dist-web/pwa-build.json pwa-build.json \
    'Generated PWA shell inventory matches canonical release; device installation acceptance is separate'
  bash -n scripts/install-web.sh || return 1
  for server in nginx apache; do
    bash scripts/install-web.sh --dry-run --server "$server" --domain example.test \
      --destination /var/www/natally-ai-studio --package "$web" || return 1
  done
  node scripts/release-state.mjs stage web-installer scripts/install-web.sh install-web.sh \
    "nginx/Apache installer; syntax and both previews pass under native Ubuntu Bash; target-server installation not exercised"
}

build_android() {
  export GRADLE_OPTS='-Dorg.gradle.daemon=false'
  export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}" ANDROID_SDK_ROOT="${ANDROID_HOME:-$HOME/Android/Sdk}"
  node scripts/release-state.mjs check || return 1
  local result=0
  cargo tauri android build --target aarch64 --apk --aab || result=$?
  local outputs=src-tauri/gen/android/app/build/outputs
  local apk aab
  apk=$(find "$outputs/apk" -name '*.apk' 2>/dev/null | grep -v unsigned | grep -F "$VERSION" | head -1 || true)
  aab=$(find "$outputs/bundle" -name '*.aab' 2>/dev/null | grep -F "$VERSION" | head -1 || true)
  local tools="$ANDROID_HOME/build-tools/36.0.0"
  local expected="${ANDROID_SIGNING_CERT_SHA256:-}"; expected="${expected//[^0-9A-Fa-f]/}"
  if [ -n "$apk" ]; then
    "$tools/apksigner" verify --verbose --print-certs "$apk" >"$SCRATCH/apk-sig.txt" 2>&1 || { echo 'APK signature verification failed' >&2; return 1; }
    local digest
    digest=$(grep -io 'certificate SHA-256 digest:[[:space:]]*[0-9a-fA-F:]*' "$SCRATCH/apk-sig.txt" | head -1 | grep -o '[0-9a-fA-F:]*$' | tr -d :)
    if [ "${#expected}" -ne 64 ] || [ "${digest^^}" != "${expected^^}" ]; then
      echo 'APK signer does not match configured production certificate' >&2; return 1
    fi
    "$tools/zipalign" -c -P 16 4 "$apk" || return 1
    "$tools/aapt" dump badging "$apk" 2>/dev/null | grep -q "versionName='$VERSION'" || { echo 'APK embedded versionName mismatch' >&2; return 1; }
    node scripts/release-state.mjs stage apk "$apk" android-arm64.apk \
      "Release profile; verified production Android upload certificate; apksigner and 16 KiB zipalign pass; v$VERSION"
  fi
  if [ -n "$aab" ]; then
    jarsigner -verify "$aab" 2>&1 | grep -q 'jar verified' || { echo 'AAB JAR signature was not verified' >&2; return 1; }
    keytool -printcert -jarfile "$aab" >"$SCRATCH/aab-cert.txt" 2>&1 || { echo 'AAB signer could not be read' >&2; return 1; }
    local digest2
    digest2=$(grep -io 'SHA256:[[:space:]]*[0-9a-fA-F:]*' "$SCRATCH/aab-cert.txt" | head -1 | grep -o '[0-9a-fA-F:]*$' | tr -d :)
    if [ "${#expected}" -ne 64 ] || [ "${digest2^^}" != "${expected^^}" ]; then
      echo 'AAB signer does not match configured production certificate' >&2; return 1
    fi
    python3 scripts/verify-android-symbols.py --manifest-only "$aab" "$VERSION" || return 1
    node scripts/release-state.mjs stage aab "$aab" android-arm64.aab \
      "Release profile, verified production Android upload certificate; jarsigner verifies; v$VERSION"
    local symbols ndkbin
    symbols=$(find "$outputs/native-debug-symbols" -name '*.zip' 2>/dev/null | head -1 || true)
    ndkbin="$ANDROID_HOME/ndk/27.0.12077973/toolchains/llvm/prebuilt/linux-x86_64/bin"
    if [ -z "$symbols" ]; then
      python3 scripts/package-android-symbols.py "$aab" "$CARGO_TARGET_DIR/aarch64-linux-android/release" \
        "$ndkbin/llvm-objcopy" "build/$PREFIX-native-debug-symbols.zip" || return 1
      symbols="build/$PREFIX-native-debug-symbols.zip"
    fi
    python3 scripts/verify-android-symbols.py "$aab" "$symbols" "$ndkbin/llvm-readelf" "$VERSION" || return 1
    node scripts/release-state.mjs stage android-symbols "$symbols" android-arm64-native-debug-symbols.zip \
      "Native ELF build IDs match the AAB libraries and canonical AAB versionName"
  fi
  [ "$result" -eq 0 ] || { echo "Android build failed: $result; available artifacts were staged" >&2; return 1; }
}

build_windows_cross() {
  node scripts/release-state.mjs check || return 1
  local result=0
  cargo tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc --bundles nsis -- || result=$?
  if [ "$result" -ne 0 ]; then
    # Upstream tauri-bundler defect: an apostrophe in bundle metadata breaks the
    # single-quoted COM parameter strings in the generated utils.nsh.
    # Requote with backticks and run makensis directly (proven in natally-ubuntu).
    local nsis_dir="$CARGO_TARGET_DIR/x86_64-pc-windows-msvc/release/nsis/x64"
    if [ -f "$nsis_dir/utils.nsh" ] && command -v makensis >/dev/null; then
      sed -i '/${I[A-Za-z]*::/ s/'"'"'/`/g' "$nsis_dir/utils.nsh" || true
      (cd "$nsis_dir" && makensis -INPUTCHARSET UTF8 installer.nsi) || return 1
      result=0
    else
      return 1
    fi
  fi
  local exe="$CARGO_TARGET_DIR/x86_64-pc-windows-msvc/release/natally-ai-studio.exe"
  [ -f "$exe" ] || { echo 'windows-exe not produced' >&2; return 1; }
  local pe_evidence="cross-compiled from Ubuntu via cargo-xwin; unsigned Tauri test, WebView2 required; v$VERSION"
  if python3 -c 'import pefile' 2>/dev/null; then
    # Same check as the Windows coordinator: the ProductVersion string resource.
    python3 - "$exe" "$SEMVER" <<'PY' && pe_evidence="PE ProductVersion=$SEMVER; $pe_evidence" || echo 'PE ProductVersion not verified (kept honest in evidence)' >&2
import pefile, sys
pe = pefile.PE(sys.argv[1])
found = {}
for group in getattr(pe, 'FileInfo', None) or []:
    for entry in group:
        for table in getattr(entry, 'StringTable', []):
            found.update({k.decode(errors='replace'): v.decode(errors='replace') for k, v in table.entries.items()})
sys.exit(0 if found.get('ProductVersion') == sys.argv[2] else 1)
PY
  fi
  node scripts/release-state.mjs stage windows-exe "$exe" win11-x64-standalone.exe "$pe_evidence"
  local nsis
  nsis=$(find "$CARGO_TARGET_DIR/x86_64-pc-windows-msvc/release/bundle/nsis" -name '*.exe' 2>/dev/null | grep -F "$SEMVER" | head -1 || true)
  [ -n "$nsis" ] || { echo 'nsis installer not produced' >&2; return 1; }
  node scripts/release-state.mjs stage nsis "$nsis" win11-x64-nsis.exe \
    "Tauri NSIS package v$VERSION; unsigned test installer; cross-compiled from Ubuntu"
}

build_linux_native() {
  node scripts/release-state.mjs check || return 1
  export NATALLY_LINUX_TARGET="${NATALLY_LINUX_TARGET:-$ROOT/build/target}"
  bash scripts/build-linux.sh
}

say 'Matrix'
run_step 'Web (web, web-installer, pwa)' 'web web-installer pwa' build_web
WEB_DEPLOY_FAILED=0
if [ "$DEPLOY_WEB" = 1 ]; then
  say "Deploy web/PWA → $DOMAINS"
  if node -e "const a=require('./build/release-state.json').artifacts;process.exit(['web','web-installer','pwa'].every(t=>a[t]&&a[t].state==='verified')?0:1)"; then
    node scripts/release-state.mjs finish-web \
      && deploy_inventory "dist/$PREFIX-test-build-inventory.json" --web-first \
      || { WEB_DEPLOY_FAILED=1; echo 'Web deployment failed; artifacts unaffected. Retry: bash build_all.sh --deploy-existing <inventory>' >&2; }
  else
    WEB_DEPLOY_FAILED=1; echo 'Web artifacts not verified; nothing deployed.' >&2
  fi
fi
run_step 'Android (apk, aab, android-symbols)' 'apk aab android-symbols' build_android
run_step 'Windows cross (windows-exe, nsis)' 'windows-exe nsis' build_windows_cross
run_step 'Linux native (appimage, deb, rpm)' 'appimage deb rpm' build_linux_native
say 'MSI (Windows-only target)'
echo 'MSI (Microsoft Store): not attempted on Linux — run build_all.sh while booted into Windows 11 (WiX is Windows-only). Target stays pending, not failed.'

say 'Finish'
node scripts/release-state.mjs finish
FINISH=$?

# GitHub hard-limits blobs at 100 MB: stage dist artifacts under 95 MB; larger
# ones stay on disk (never deleted) with their sha256 in the release inventory.
find dist -type f -size -95M -print0 | xargs -0 -r git add -f --
git commit -q -m "v${VERSION}: full-matrix build_all.sh run on $(hostname) (finish exit $FINISH)" || true
push_current || echo "PUBLICATION GAP: v$VERSION artifacts could not be pushed" >&2
say "Done — v$VERSION (finish exit $FINISH; see dist/$PREFIX-test-build-inventory.json)"
[ "$WEB_DEPLOY_FAILED" = 0 ] || { echo "Matrix finished but web deployment failed." >&2; [ "$FINISH" -ne 0 ] || FINISH=1; }
exit "$FINISH"
