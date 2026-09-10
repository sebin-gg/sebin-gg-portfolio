#!/usr/bin/env node
/**
 * Firefox-engine check: runs the full Playwright suite in Firefox
 * against the production build.
 *
 * Usage: pnpm build && pnpm check:firefox
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "playwright", "test", "--project=firefox"], {
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
