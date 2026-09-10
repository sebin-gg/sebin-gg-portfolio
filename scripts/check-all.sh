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

step "Playwright browsers (idempotent, cached)"
pnpm exec playwright install chromium firefox webkit || fail "playwright install"

step "E2E tests (Playwright: chromium/firefox/webkit/mobile)"
pnpm test:e2e || fail "pnpm test:e2e"

# Real Safari engine already runs in Playwright WebKit above; Firefox too.
# These dedicated runners exist for `pnpm check:safari` / `pnpm check:firefox`.

if command -v lynx >/dev/null 2>&1 || command -v w3m >/dev/null 2>&1 || command -v links >/dev/null 2>&1; then
  step "Terminal browsers (lynx/w3m no-JS content check)"
  pnpm check:terminal || fail "pnpm check:terminal"
else
  echo "! lynx/w3m/links not installed — skipping terminal browser check"
fi

if command -v thorium-browser >/dev/null 2>&1 || [ -x /usr/bin/thorium-browser ]; then
  step "Thorium browser check (Puppeteer)"
  pnpm check:thorium || fail "pnpm check:thorium"
fi

# Chrome-family discovery sweep: only when another engine actually exists
# locally (otherwise chromium e2e above already covered it).
CHROME_FAMILY=""
for b in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge vivaldi opera; do
  if command -v "$b" >/dev/null 2>&1; then CHROME_FAMILY=1; break; fi
done
if [ -n "$CHROME_FAMILY" ]; then
  step "Chrome-family sweep (puppeteer-core discovery)"
  pnpm check:browsers || fail "pnpm check:browsers"
fi

step "Core Web Vitals Matrix (4G/3G/2G/Slow 2G + 20x CPU throttling)"
pnpm test:perf || fail "pnpm test:perf"

echo
echo "✔ All checks passed."
