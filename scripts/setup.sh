#!/usr/bin/env bash
# One-shot project setup. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Checking toolchain"
node -v
pnpm -v

echo "==> Installing dependencies"
pnpm install

echo "==> Installing Playwright Chromium (for e2e + visual checks)"
pnpm exec playwright install chromium

echo "==> Refreshing résumé PDF copy (public/resume.pdf)"
bash scripts/prepare-resume.sh || echo "! No résumé PDF found to copy — skipping (the committed one stays)."

echo
echo "✔ Setup complete."
echo
echo "Next:"
echo "  pnpm dev           → http://localhost:3000"
echo "  pnpm check:all     → full quality gate (lint, typecheck, format, unit, build, e2e)"
echo "  bash scripts/links.sh  → opens every account/app you still need to enable (Vercel, CodeRabbit, ...)"
