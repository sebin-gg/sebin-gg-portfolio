#!/usr/bin/env bash
# Fast inner-loop gate for agents and humans: lint + typecheck + format +
# unit tests (no coverage), all in parallel. Use while iterating; run the
# full `pnpm check:all` once before opening a PR. Browser and perf checks
# are intentionally excluded — see `pnpm test:e2e:chrome` for those.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

step() {
  local label="$1"
  echo
  echo "==========================================================="
  echo "  $label"
  echo "==========================================================="
}

fail() {
  local where="$1"
  echo
  echo "✗ FAILED at: $where"
  exit 1
}

step "Lint + typecheck + format + unit:fast (parallel, independent)"
pnpm lint > /tmp/verify-lint.log 2>&1 & lint_pid=$!
pnpm typecheck > /tmp/verify-typecheck.log 2>&1 & typecheck_pid=$!
pnpm format:check > /tmp/verify-format.log 2>&1 & format_pid=$!
pnpm test:unit:fast > /tmp/verify-unit-fast.log 2>&1 & unit_pid=$!

parallel_failed=()
wait "$lint_pid" || parallel_failed+=("lint:/tmp/verify-lint.log")
wait "$typecheck_pid" || parallel_failed+=("typecheck:/tmp/verify-typecheck.log")
wait "$format_pid" || parallel_failed+=("format:/tmp/verify-format.log")
wait "$unit_pid" || parallel_failed+=("unit:fast:/tmp/verify-unit-fast.log")
if ((${#parallel_failed[@]} > 0)); then
  for entry in "${parallel_failed[@]}"; do
    echo "--- ${entry%%:*} failed, tail of ${entry##*:}:"
    tail -30 "${entry##*:}"
  done
  fail "parallel gates"
fi

echo
echo "✔ Fast gates passed (lint, typecheck, format, unit:fast)."
