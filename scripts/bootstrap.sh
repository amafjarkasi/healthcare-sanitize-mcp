#!/usr/bin/env bash
set -euo pipefail
mkdir -p src/core src/detection src/policy src/pipeline src/cli config/signatures docs scripts
# This script is optional: it does not recreate full file contents (already tracked in repo)
echo "Run: npm install && npm run build" > /dev/null