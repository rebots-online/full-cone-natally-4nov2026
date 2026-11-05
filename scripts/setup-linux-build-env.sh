#!/usr/bin/env bash
# Run as root in the dedicated Natally-Build Ubuntu 22.04 WSL distribution.
# Install that distribution with --location E:\DevTools\wsl\Natally-Build.
set -euo pipefail
if [[ $(id -u) != 0 ]]; then
  printf 'Run this setup as root inside the build distribution.\n' >&2
  exit 1
fi
source "$(dirname "${BASH_SOURCE[0]}")/linux-build-env.sh"
install -m 0644 "$(dirname "${BASH_SOURCE[0]}")/linux-build-env.sh" "$NATALLY_TOOL_ROOT/env.sh"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
  build-essential curl wget file git ca-certificates pkg-config \
  libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
  libayatana-appindicator3-dev librsvg2-dev patchelf libfuse2 \
  squashfs-tools xz-utils xvfb xauth dbus-x11

mkdir -p "$NATALLY_TOOL_ROOT/downloads"
if [[ ! -x "$NATALLY_TOOL_ROOT/node-v22.23.3-linux-x64/bin/node" ]]; then
  (
    cd "$NATALLY_TOOL_ROOT/downloads"
    curl -fLsS --retry 2 https://nodejs.org/dist/v22.23.3/node-v22.23.3-linux-x64.tar.xz -o node-v22.23.3-linux-x64.tar.xz
    curl -fLsS --retry 2 https://nodejs.org/dist/v22.23.3/SHASUMS256.txt -o SHASUMS256.txt
    grep ' node-v22.23.3-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
    tar -xf node-v22.23.3-linux-x64.tar.xz -C "$NATALLY_TOOL_ROOT"
  )
fi
if [[ ! -x "$CARGO_HOME/bin/rustup" ]]; then
  curl -fLsS --retry 2 https://sh.rustup.rs -o "$NATALLY_TOOL_ROOT/downloads/rustup-init.sh"
  sh "$NATALLY_TOOL_ROOT/downloads/rustup-init.sh" -y --no-modify-path --profile minimal --default-toolchain 1.94.1
fi
rustup toolchain install 1.94.1 --profile minimal
if [[ ! -x "$NATALLY_TOOL_ROOT/tools/bin/tauri" ]] || \
   [[ $(tauri --version) != 'tauri-cli 2.11.4' ]]; then
  npm install --global --prefix "$NATALLY_TOOL_ROOT/tools" @tauri-apps/cli@2.11.4
fi
node --version
rustc --version
cargo --version
tauri --version
pkg-config --modversion webkit2gtk-4.1 gtk+-3.0
