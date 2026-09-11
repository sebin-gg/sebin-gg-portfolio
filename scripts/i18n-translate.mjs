#!/usr/bin/env node
/**
 * Runs `gt translate` to refresh committed locale JSON files
 * (src/lib/i18n/<locale>.json) from the English source of truth.
 *
 * Skips with a warning when GT_API_KEY / GT_PROJECT_ID are not configured,
 * so CI stays green before the General Translation account is set up.
 * Docs: https://generaltranslation.com/docs
 */
import { execSync, spawnSync } from "node:child_process";

const hasSecrets = Boolean(process.env.GT_API_KEY && process.env.GT_PROJECT_ID);

if (!hasSecrets) {
  console.warn(
    "[i18n] GT_API_KEY / GT_PROJECT_ID not set — skipping gt translate. " +
      "Locales keep their committed translations (or English seeds).",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["--yes", "gt@latest", "translate"], {
  stdio: "inherit",
  env: process.env,
});

if (result.error || result.status !== 0) {
  console.error("[i18n] gt translate failed. Verify secrets and gt.config.json.");
  process.exit(result.status ?? 1);
}

// gt translate writes into src/lib/i18n/; surface the diff for the CI log.
try {
  const diff = execSync("git --no-pager diff --stat -- src/lib/i18n", { encoding: "utf8" });
  if (diff.trim()) console.log(diff);
} catch {
  // git diff is informational only.
}
