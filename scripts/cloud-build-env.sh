#!/usr/bin/env bash
# Cloud build environment for build_all.sh (Robin, 2026-11-03): one environment,
# not tied to any computer, able to build every platform. Paste this file's
# contents into the cloud environment's Setup script (title bar → environment →
# Edit → Setup script); every new session then has the full toolchain.
# Installs: Linux bundle + cross-compile packages, JDK 21, Rust targets
# (Android, Windows), cargo-xwin, tauri-cli, Android SDK/NDK at ~/Android/Sdk
# (build_all.sh's default ANDROID_HOME). Secrets are NOT installed here — the
# setup script cannot read them; they come from the environment's variables at
# build time.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
sudo() { if [ "$(id -u)" = 0 ]; then "$@"; else command sudo "$@"; fi; }

sudo apt-get update -q
sudo apt-get install -y -q --no-install-recommends \
  build-essential pkg-config libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
  libayatana-appindicator3-dev librsvg2-dev patchelf libfuse2t64 squashfs-tools \
  file zip unzip rpm nsis clang lld llvm openjdk-21-jdk-headless curl ca-certificates

command -v rustup >/dev/null || curl -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
. "$HOME/.cargo/env"
rustup target add aarch64-linux-android x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
cargo install --locked tauri-cli --version '^2'

SDK="$HOME/Android/Sdk"
if [ ! -x "$SDK/cmdline-tools/latest/bin/sdkmanager" ]; then
  mkdir -p "$SDK/cmdline-tools" && cd "$SDK/cmdline-tools"
  curl -sSfLo tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q tools.zip && mv cmdline-tools latest && rm tools.zip
fi
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" --licenses >/dev/null
"$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" \
  "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.0.12077973"
echo "Cloud build environment ready: Android SDK at $SDK"
