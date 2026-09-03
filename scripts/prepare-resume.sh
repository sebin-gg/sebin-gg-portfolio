#!/usr/bin/env bash
# Copies your freshest résumé PDF into public/resume.pdf (served on the site)
# and docs/. Edit the glob below to match your real résumé filename.
set -euo pipefail
cd "$(dirname "$0")/.."

SEARCH_DIRS=("$HOME/Documents" "$HOME/Downloads")
PATTERNS=("*resume*.pdf" "*Resume*.pdf" "*RESUME*.pdf" "*CV*.pdf" "*cv*.pdf")

candidates=()
for dir in "${SEARCH_DIRS[@]}"; do
  for pattern in "${PATTERNS[@]}"; do
    while IFS= read -r -d '' file; do
      candidates+=("$file")
    done < <(find "$dir" -maxdepth 2 -iname "$pattern" -type f -print0 2>/dev/null)
  done
done

if [ "${#candidates[@]}" -eq 0 ]; then
  echo "! No résumé PDF found in ~/Documents or ~/Downloads."
  exit 1
fi

# Newest file wins.
newest="$(printf '%s\n' "${candidates[@]}" | xargs ls -t 2>/dev/null | head -1)"
newest="${newest:-${candidates[0]}}"

mkdir -p docs
cp "$newest" public/resume.pdf
cp "$newest" docs/Sebin-Mathew-Resume.pdf
echo "✔ Copied: $newest"
echo "  → public/resume.pdf"
echo "  → docs/Sebin-Mathew-Resume.pdf"
