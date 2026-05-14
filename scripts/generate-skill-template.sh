#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-demo-skill}"
SCENARIO="${2:-describe scenario}"
ID="$(date +%s)"
TARGET_DIR="docs/skills"
mkdir -p "$TARGET_DIR"
cat > "$TARGET_DIR/${ID}-${NAME}.md" <<EOT
# ${NAME}

## Scenario
${SCENARIO}

## Inputs
- TODO

## Steps
- TODO
EOT

echo "generated: $TARGET_DIR/${ID}-${NAME}.md"
