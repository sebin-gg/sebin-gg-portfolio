#!/usr/bin/env bash
# Full local quality gate — the same checks CI runs, minus the slow extras
# (mutation testing and Lighthouse live in their own workflows).
set -uo pipefail
cd "$(dirname "$0")/.."

step() {
  local label=$1
  echo
  echo "==========================================================="
  echo "  $label"
  echo "==========================================================="
}

fail() {
  local where=$1
  echo
  echo "✗ FAILED at: $where"
  exit 1
}

step "Lint + typecheck + format (parallel, independent)"
pnpm lint > /tmp/check-lint.log 2>&1 & lint_pid=$!
pnpm typecheck > /tmp/check-typecheck.log 2>&1 & typecheck_pid=$!
pnpm format:check > /tmp/check-format.log 2>&1 & format_pid=$!

parallel_failed=""
wait "$lint_pid" || parallel_failed="${parallel_failed} lint"
wait "$typecheck_pid" || parallel_failed="${parallel_failed} typecheck"
wait "$format_pid" || parallel_failed="${parallel_failed} format"
if [[ -n "$parallel_failed" ]]; then
  for job in $parallel_failed; do
    echo "--- $job failed, tail of /tmp/check-$job.log:"
    tail -30 "/tmp/check-$job.log"
  done
  fail "parallel gates:$parallel_failed"
fi
echo "✔ lint, typecheck and format all passed."

step "Unit tests + build + browsers (parallel, independent)"
pnpm test:unit > /tmp/check-unit.log 2>&1 & unit_pid=$!
pnpm build > /tmp/check-build.log 2>&1 & build_pid=$!
pnpm exec playwright install chromium firefox webkit > /tmp/check-pw.log 2>&1 & pw_pid=$!

parallel_failed=""
wait "$unit_pid" || parallel_failed="${parallel_failed} unit"
wait "$build_pid" || parallel_failed="${parallel_failed} build"
wait "$pw_pid" || parallel_failed="${parallel_failed} playwright-install"
if [[ -n "$parallel_failed" ]]; then
  for job in $parallel_failed; do
    echo "--- $job failed, tail of /tmp/check-$job.log:"
    tail -30 "/tmp/check-$job.log"
  done
  fail "parallel build:$parallel_failed"
fi
echo "✔ unit tests, build and browser install all passed."

step "CRAP gate (< 6, uses unit coverage above)"
pnpm crap:gate || fail "pnpm crap:gate"

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

if command -v thorium-browser >/dev/null 2>&1 || [[ -x /usr/bin/thorium-browser ]]; then
  step "Thorium browser check (Puppeteer)"
  pnpm check:thorium || fail "pnpm check:thorium"
fi

# Chrome-family discovery sweep: only when another engine actually exists
# locally (otherwise chromium e2e above already covered it).
CHROME_FAMILY=""
for b in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge vivaldi opera; do
  if command -v "$b" >/dev/null 2>&1; then CHROME_FAMILY=1; break; fi
done
if [[ -n "$CHROME_FAMILY" ]]; then
  step "Chrome-family sweep (puppeteer-core discovery)"
  pnpm check:browsers || fail "pnpm check:browsers"
fi

step "Core Web Vitals Matrix (4G/3G/2G/Slow 2G + 20x CPU throttling)"
pnpm test:perf || fail "pnpm test:perf"

echo
echo "✔ All checks passed."
