#!/usr/bin/env node
/**
 * Safari-engine check: runs the full Playwright suite in WebKit
 * (the engine behind Safari) against the production build.
 *
 * Usage: pnpm build && pnpm check:safari
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "playwright", "test", "--project=webkit"], {
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
