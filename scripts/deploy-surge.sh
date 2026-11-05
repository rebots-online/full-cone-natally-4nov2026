#!/usr/bin/env bash
# Completed-artifact deployment entry point (KStore rev8).
# Delegates to the PowerShell coordinator; this wrapper never runs npm lint,
# npm build or the Surge CLI itself.
#
# Usage: deploy-surge.sh <inventory-path> [more domains...]
#   domains default to $SURGE_DOMAINS (comma separated) when no domain args are given.
set -euo pipefail
REPO_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd -- "$REPO_DIR"
INVENTORY="${1:?Usage: deploy-surge.sh <dist/...-test-build-inventory.json> [domains...] or set SURGE_DOMAINS}"
shift
if [ "$#" -gt 0 ]; then DOMAINS=$(IFS=,; echo "$*"); else DOMAINS="${SURGE_DOMAINS:?Provide domains as arguments or set SURGE_DOMAINS}"; fi
exec npm.cmd run build:all -- -DeployExisting "$INVENTORY" -DeployDomains "$DOMAINS"
