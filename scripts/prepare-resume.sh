#!/usr/bin/env bash
# Keep the repository copy synchronized with the résumé served by the website.
set -euo pipefail
cd "$(dirname "$0")/.."

SOURCE="public/resume.pdf"
TARGET="docs/Sebin-Mathew-Resume.pdf"
TARGET_DIR="$(dirname "$TARGET")"
tmp=""

cleanup() {
  if [[ -n "$tmp" ]]; then
    rm -f "$tmp"
  fi
}
trap cleanup EXIT

if [[ ! -s "$SOURCE" ]]; then
  echo "! Missing canonical résumé: $SOURCE" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
if ! cmp -s "$SOURCE" "$TARGET"; then
  tmp="$(mktemp "$TARGET_DIR/.resume.XXXXXX")"
  cp "$SOURCE" "$tmp"
  mv -f "$tmp" "$TARGET"
  tmp=""
fi

echo "✔ Synchronized résumé PDF"
echo "  → $SOURCE (canonical website file)"
echo "  → $TARGET (matching docs copy)"
