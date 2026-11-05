#!/usr/bin/env bash
# Completed-artifact web/PWA deployment (KStore rev8) to the Natally web
# targets — https://natally.robin.mba and https://natally.surge.sh.
# Thin wrapper over build_all.sh --deploy-existing, which works on either
# build computer (Linux runs scripts/deploy-existing.mjs directly; Windows is
# handed to the ps1 coordinator). Never lints, builds or stamps.
#
# Usage: deploy-surge.sh <dist/...-test-build-inventory.json> [domain ...]
#   domains default to $SURGE_DOMAINS (comma separated) when none are given.
set -euo pipefail
REPO_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
INVENTORY="${1:?Usage: deploy-surge.sh <dist/...-test-build-inventory.json> [domains...] or set SURGE_DOMAINS}"
shift
if [ "$#" -gt 0 ]; then DOMAINS=$(IFS=,; echo "$*"); else DOMAINS="${SURGE_DOMAINS:?Provide domains as arguments or set SURGE_DOMAINS}"; fi
exec bash "$REPO_DIR/build_all.sh" --deploy-existing "$INVENTORY" --domains "$DOMAINS"
