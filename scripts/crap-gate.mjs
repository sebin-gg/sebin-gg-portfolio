#!/usr/bin/env node
/**
 * CRAP (Change Risk Anti-Patterns) gate.
 *
 *   CRAP(m) = c(m)^2 * (1 - cov(m))^3 + c(m)
 *
 * Keeps every function under a CRAP score of 6 by combining:
 *   1. an ESLint cyclomatic-complexity cap (<= 4, enforced for src/**), and
 *   2. the global line coverage floor from the last `pnpm test:unit` run.
 *
 * With coverage >= 55% the worst case for c = 4 is 4^2*(0.45)^3 + 4 = 5.82 < 6,
 * and our coverage threshold is far above that. Run `pnpm test:unit` before
 * this script so coverage/coverage-summary.json exists.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const coverageFile = resolve(root, "coverage/coverage-summary.json");
const COMPLEXITY_CAP = 4;

function runLintComplexity() {
  const [command, ...entryArgs] = eslintCommand();
  try {
    return JSON.parse(
      execFileSync(command, [...entryArgs, "src", "--format", "json"], { encoding: "utf8" }),
    );
  } catch (error) {
    // ESLint exits 1 when it finds problems but still prints JSON to stdout.
    return JSON.parse(error.stdout);
  }
}

/*
 * The .bin shims are not spawnable from Node without `shell:true` (the
 * extensionless POSIX sh shim is ENOENT for CreateProcess on Windows, and the
 * .CMD wrapper silently no-ops when spawned directly from a Node child on
 * Node 26). Resolve the real eslint JS entry and run it with the current Node
 * executable — portable across pnpm's .pnpm layout on every platform.
 */
function eslintCommand() {
  // eslint's package exports hide bin/eslint.js, so resolve from its package
  // root (the bin path is fixed by the package layout, not the exports map).
  const requireKid = createRequire(resolve(root, "package.json"));
  const pkgDir = requireKid.resolve("eslint/package.json");
  const entry = resolve(pkgDir, "..", "bin", "eslint.js");
  return [process.execPath, entry];
}

function maxComplexity(report) {
  let worst = 0;
  for (const file of report) {
    for (const msg of file.messages ?? []) {
      if (msg.ruleId === "complexity") {
        const found = Number(msg.message.match(/complexity of (\d+)/)?.[1] ?? COMPLEXITY_CAP);
        worst = Math.max(worst, found);
      }
    }
  }
  return worst;
}

function crap(complexity, coverage) {
  const uncovered = 1 - coverage / 100;
  return complexity ** 2 * uncovered ** 3 + complexity;
}

function readLineCoverage() {
  if (!existsSync(coverageFile)) return null;
  const summary = JSON.parse(readFileSync(coverageFile, "utf8"));
  const pct = summary.total?.lines?.pct;
  return typeof pct === "number" ? Math.round(pct * 100) / 100 : null;
}

const report = runLintComplexity();
const worst = maxComplexity(report);
const coverage = readLineCoverage();

console.log(
  `ESLint complexity report: worst function complexity = ${worst} (cap ${COMPLEXITY_CAP})`,
);
if (worst > COMPLEXITY_CAP) {
  console.error(`✗ Failing: complexity exceeds cap of ${COMPLEXITY_CAP}.`);
  process.exit(1);
}

if (coverage === null) {
  console.warn(
    "! coverage/coverage-summary.json not found — run `pnpm test:unit` first. Skipping the coverage half of the gate.",
  );
} else {
  const worstCrap = crap(worst, coverage);
  console.log(`Line coverage floor from last unit run: ${coverage}%`);
  console.log(
    `Worst-case CRAP at complexity ${worst} and ${coverage}% coverage: ${worstCrap.toFixed(3)}`,
  );
  if (worstCrap >= 6) {
    console.error(`✗ Failing: worst-case CRAP ${worstCrap.toFixed(3)} is not < 6.`);
    process.exit(1);
  }
}

console.log("✓ CRAP gate passed — every function stays under a CRAP score of 6.");
