#!/usr/bin/env node
/**
 * Firefox-engine check: runs the full Playwright suite in Firefox
 * against the production build.
 *
 * Usage: pnpm build && pnpm check:firefox
 */
import { spawnSyncPnpm } from "./lib/launch-pnpm.mjs";

const result = spawnSyncPnpm(["exec", "playwright", "test", "--project=firefox"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
