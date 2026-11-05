#!/usr/bin/env bash
# Idempotent prerequisites only, in the existing Ubuntu 24.04 distribution.
set -euo pipefail
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_ID" == 24.04 ]] || { echo 'Ubuntu 24.04 is mandatory' >&2; exit 1; }
packages=(build-essential pkg-config libwebkit2gtk-4.1-dev libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev patchelf libfuse2t64 squashfs-tools file zip unzip)
missing=()
for package in "${packages[@]}"; do
  dpkg-query -W -f='${Status}' "$package" 2>/dev/null | grep -q 'install ok installed' || missing+=("$package")
done
if (( ${#missing[@]} )); then
  [[ $(id -u) == 0 ]] || { printf 'Missing prerequisites: %s\n' "${missing[*]}" >&2; exit 1; }
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y --no-install-recommends "${missing[@]}"
fi
