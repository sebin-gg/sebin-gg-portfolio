#!/usr/bin/env bash
# Full local quality gate — the same checks CI runs, minus the slow extras
# (mutation testing and Lighthouse live in their own workflows).
set -uo pipefail
cd "$(dirname "$0")/.."

step() {
  echo
  echo "==========================================================="
  echo "  $1"
  echo "==========================================================="
}

fail() {
  echo
  echo "✗ FAILED at: $1"
  exit 1
}

step "Lint (incl. complexity cap for CRAP)"
pnpm lint || fail "pnpm lint"

step "Typecheck"
pnpm typecheck || fail "pnpm typecheck"

step "Format check (Prettier)"
pnpm format:check || fail "pnpm format:check"

step "Unit tests + coverage"
pnpm test:unit || fail "pnpm test:unit"

step "CRAP gate (< 6)"
pnpm crap:gate || fail "pnpm crap:gate"

step "Production build"
pnpm build || fail "pnpm build"

step "E2E tests (Playwright)"
pnpm test:e2e || fail "pnpm test:e2e"

echo
echo "✔ All checks passed."
