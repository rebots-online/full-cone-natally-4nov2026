#!/usr/bin/env bash
# Internal helper: reuse installed tools in the existing Ubuntu 24.04.
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_ID" == 24.04 ]] || { echo 'Ubuntu 24.04 is required' >&2; return 1; }
export PATH="$HOME/.cargo/bin:/usr/local/bin:/usr/bin:/bin"
for node_bin in "$HOME"/.nvm/versions/node/v*/bin/node; do
  [[ -x "$node_bin" ]] || continue
  if (( $("$node_bin" -p 'Number(process.versions.node.split(".")[0])') >= 22 )); then
    export PATH="$(dirname "$node_bin"):$PATH"
  fi
done
export CARGO_TARGET_DIR="${NATALLY_LINUX_TARGET:-$HOME/.cache/natally-ai-studio/target}"
export npm_config_cache="${npm_config_cache:-/mnt/e/BuildCache/natally-ai-studio/npm-linux}"
export XDG_CACHE_HOME="/mnt/e/BuildCache/natally-ai-studio/linux-cache"
export TMPDIR="/mnt/e/BuildCache/natally-ai-studio/tmp-linux"
export APPIMAGE_EXTRACT_AND_RUN=1
export NO_STRIP=1
mkdir -p "$CARGO_TARGET_DIR" "$XDG_CACHE_HOME" "$TMPDIR"
