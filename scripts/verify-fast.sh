#!/usr/bin/env bash
# Fast inner-loop gate for agents and humans: lint + typecheck + format +
# unit tests (no coverage), all in parallel. Use while iterating; run the
# full `pnpm check:all` once before opening a PR. Browser and perf checks
# are intentionally excluded — see `pnpm test:e2e:chrome` for those.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

# Per-invocation log dir so concurrent runs never share/truncate logs.
LOGDIR="$(mktemp -d "${TMPDIR:-/tmp}/verify-fast.XXXXXX")"
trap 'rm -rf "$LOGDIR"' EXIT

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
pnpm lint >"$LOGDIR/lint.log" 2>&1 & lint_pid=$!
pnpm typecheck >"$LOGDIR/typecheck.log" 2>&1 & typecheck_pid=$!
pnpm format:check >"$LOGDIR/format.log" 2>&1 & format_pid=$!
pnpm test:unit:fast >"$LOGDIR/unit.log" 2>&1 & unit_pid=$!

failed_names=()
wait "$lint_pid" || failed_names+=("lint")
wait "$typecheck_pid" || failed_names+=("typecheck")
wait "$format_pid" || failed_names+=("format")
wait "$unit_pid" || failed_names+=("unit")
if ((${#failed_names[@]} > 0)); then
  for failed_name in "${failed_names[@]}"; do
    echo "--- $failed_name failed, tail of its log:"
    tail -30 "$LOGDIR/$failed_name.log"
  done
  fail "parallel gates"
fi

echo
echo "✔ Fast gates passed (lint, typecheck, format, unit:fast)."
