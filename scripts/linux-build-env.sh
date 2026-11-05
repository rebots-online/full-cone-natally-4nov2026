#!/usr/bin/env bash
# Source inside the Natally-Build WSL distribution. Its ext4.vhdx is on E:.
# Keep Linux binaries and build output on its ext4 filesystem, not /mnt/c.
export NATALLY_TOOL_ROOT="${NATALLY_TOOL_ROOT:-/opt/natally}"
export CARGO_HOME="$NATALLY_TOOL_ROOT/cargo"
export RUSTUP_HOME="$NATALLY_TOOL_ROOT/rustup"
export RUSTUP_TOOLCHAIN=1.94.1
export PATH="$NATALLY_TOOL_ROOT/node-v22.23.3-linux-x64/bin:$NATALLY_TOOL_ROOT/tools/bin:$CARGO_HOME/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export CARGO_TARGET_DIR="$NATALLY_TOOL_ROOT/targets/appimage"
export npm_config_cache="$NATALLY_TOOL_ROOT/caches/npm"
export TMPDIR="$NATALLY_TOOL_ROOT/caches/tmp"
mkdir -p "$CARGO_TARGET_DIR" "$npm_config_cache" "$TMPDIR"
