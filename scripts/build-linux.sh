#!/usr/bin/env bash
# One platform continuation; the Windows coordinator owns the only stamp.
set -euo pipefail
repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo"
source scripts/linux-build-env.sh
node scripts/release-state.mjs context >/dev/null
tool_root="/mnt/e/BuildCache/natally-ai-studio/linux-tools/tauri2-cli"
if [[ ! -x "$tool_root/bin/tauri" ]]; then
  npm install --global --prefix "$tool_root" @tauri-apps/cli@2.11.4
fi
version=$(node -p 'JSON.parse(require("fs").readFileSync("version.json","utf8")).version')
semver=$(node -p 'JSON.parse(require("fs").readFileSync("version.json","utf8")).semverVersion')
export NATALLY_BUILD_VERSION="$version"
result=0
"$tool_root/bin/tauri" build --bundles appimage,deb,rpm -- --locked || result=$?
deb=$(find "$CARGO_TARGET_DIR/release/bundle/deb" -maxdepth 1 -type f -name "*_${semver}_amd64.deb" -print -quit 2>/dev/null || true)
image=$(find "$CARGO_TARGET_DIR/release/bundle/appimage" -maxdepth 1 -type f -name "*_${semver}_amd64.AppImage" -print -quit 2>/dev/null || true)
if [[ -n "$deb" && $(dpkg-deb -f "$deb" Version) == "$semver" ]]; then
  dpkg-deb --info "$deb"
  node scripts/release-state.mjs stage deb "$deb" linux-amd64.deb "Ubuntu 24.04; dpkg-deb version $version"
fi
if [[ -n "$image" && $(head -c 4 "$image" | od -An -tx1 | tr -d ' \n') == 7f454c46 ]]; then
  file "$image"
  offset=$(env -u APPIMAGE_EXTRACT_AND_RUN "$image" --appimage-offset)
  [[ "$offset" =~ ^[0-9]+$ ]]
  unsquashfs -s -o "$offset" "$image"
  node scripts/release-state.mjs stage appimage "$image" linux-amd64.AppImage "Ubuntu 24.04; ELF runtime and SquashFS verified; canonical Tauri version $version"
fi
if ! command -v rpm >/dev/null 2>&1; then
  echo "rpm tool is required to verify and stage the RPM package; install rpm (e.g. apt-get install rpm)" >&2
  result=1
else
  rpm=$(find "$CARGO_TARGET_DIR/release/bundle/rpm" -maxdepth 1 -type f -name "*${semver}*.x86_64.rpm" -print -quit 2>/dev/null || true)
  if [[ -n "$rpm" ]]; then
    pkg_version=$(rpm -qp --qf '%{VERSION}' "$rpm")
    pkg_arch=$(rpm -qp --qf '%{ARCH}' "$rpm")
    if [[ "$pkg_version" == "$semver" && "$pkg_arch" == "x86_64" ]]; then
      rpm -qpi "$rpm"
      node scripts/release-state.mjs stage rpm "$rpm" linux-x86_64.rpm "Ubuntu 24.04; rpm VERSION=$pkg_version ARCH=$pkg_arch verified; canonical Tauri version $version"
    else
      echo "RPM metadata mismatch: VERSION=$pkg_version ARCH=$pkg_arch, expected $semver/x86_64: $rpm" >&2
      result=1
    fi
  else
    echo "No RPM package found matching *${semver}*.x86_64.rpm under $CARGO_TARGET_DIR/release/bundle/rpm" >&2
    result=1
  fi
fi
exit "$result"
