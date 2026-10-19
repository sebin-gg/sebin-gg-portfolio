#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT

mkdir -p "$TEST_ROOT/scripts" "$TEST_ROOT/public" "$TEST_ROOT/docs"
cp "$SCRIPT_DIR/prepare-resume.sh" "$TEST_ROOT/scripts/prepare-resume.sh"
printf 'canonical PDF bytes\n' >"$TEST_ROOT/public/resume.pdf"
printf 'old docs copy\n' >"$TEST_ROOT/docs/Sebin-Mathew-Resume.pdf"

(cd "$TEST_ROOT" && bash scripts/prepare-resume.sh >/dev/null)
cmp -s "$TEST_ROOT/public/resume.pdf" "$TEST_ROOT/docs/Sebin-Mathew-Resume.pdf"

printf 'replacement PDF bytes\n' >"$TEST_ROOT/public/resume.pdf"
printf 'keep this copy on failure\n' >"$TEST_ROOT/docs/Sebin-Mathew-Resume.pdf"
mkdir -p "$TEST_ROOT/bin"
cat >"$TEST_ROOT/bin/cp" <<'SH'
#!/usr/bin/env bash
exit 1
SH
chmod +x "$TEST_ROOT/bin/cp"

if (cd "$TEST_ROOT" && PATH="$TEST_ROOT/bin:$PATH" bash scripts/prepare-resume.sh >/dev/null 2>&1); then
  echo "Expected the simulated copy failure to fail synchronization." >&2
  exit 1
fi
printf 'keep this copy on failure\n' >"$TEST_ROOT/expected.pdf"
cmp -s "$TEST_ROOT/expected.pdf" "$TEST_ROOT/docs/Sebin-Mathew-Resume.pdf"
shopt -s nullglob
partials=("$TEST_ROOT/docs"/.resume.*)
if ((${#partials[@]} > 0)); then
  echo "Temporary résumé files were left behind after copy failure." >&2
  exit 1
fi

rm "$TEST_ROOT/public/resume.pdf"
if (cd "$TEST_ROOT" && bash scripts/prepare-resume.sh >/dev/null 2>&1); then
  echo "Expected a missing canonical résumé to fail synchronization." >&2
  exit 1
fi
cmp -s "$TEST_ROOT/expected.pdf" "$TEST_ROOT/docs/Sebin-Mathew-Resume.pdf"

echo "Résumé synchronization failure paths passed."
