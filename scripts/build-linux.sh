#!/usr/bin/env bash
# One platform continuation; the Windows coordinator owns the only stamp.
set -euo pipefail
repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo"
source scripts/linux-build-env.sh
node scripts/release-state.mjs check
tool_root="$HOME/.local/share/tauri2-cli"
if [[ ! -x "$tool_root/bin/tauri" ]]; then
  npm install --global --prefix "$tool_root" @tauri-apps/cli@2.11.4
fi
version=$(node -p 'JSON.parse(require("fs").readFileSync("version.json","utf8")).version')
export NATALLY_BUILD_VERSION="$version"
result=0
"$tool_root/bin/tauri" build --bundles appimage,deb -- --locked || result=$?
deb=$(find "$CARGO_TARGET_DIR/release/bundle/deb" -maxdepth 1 -type f -name "*_${version}_amd64.deb" -print -quit 2>/dev/null || true)
image=$(find "$CARGO_TARGET_DIR/release/bundle/appimage" -maxdepth 1 -type f -name "*_${version}_amd64.AppImage" -print -quit 2>/dev/null || true)
if [[ -n "$deb" && $(dpkg-deb -f "$deb" Version) == "$version" ]]; then
  dpkg-deb --info "$deb"
  node scripts/release-state.mjs stage deb "$deb" linux-amd64.deb "Ubuntu 24.04; dpkg-deb version $version"
fi
if [[ -n "$image" && $(head -c 4 "$image" | od -An -tx1 | tr -d ' \n') == 7f454c46 ]]; then
  file "$image"
  node scripts/release-state.mjs stage appimage "$image" linux-amd64.AppImage "Ubuntu 24.04; ELF AppImage built with canonical Tauri version $version"
fi
exit "$result"
