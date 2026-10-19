#!/usr/bin/env bash
# Keep the repository copy synchronized with the résumé served by the website.
set -euo pipefail
cd "$(dirname "$0")/.."

SOURCE="public/resume.pdf"
TARGET="docs/Sebin-Mathew-Resume.pdf"

if [[ ! -s "$SOURCE" ]]; then
  echo "! Missing canonical résumé: $SOURCE" >&2
  exit 1
fi

mkdir -p docs
if ! cmp -s "$SOURCE" "$TARGET"; then
  cp "$SOURCE" "$TARGET"
fi

echo "✔ Synchronized résumé PDF"
echo "  → $SOURCE (canonical website file)"
echo "  → $TARGET (matching docs copy)"