#!/usr/bin/env node
/**
 * Safari-engine check: runs the full Playwright suite in WebKit
 * (the engine behind Safari) against the production build.
 *
 * Usage: pnpm build && pnpm check:safari
 */
import { spawnSyncPnpm } from "./lib/launch-pnpm.mjs";

const result = spawnSyncPnpm(["exec", "playwright", "test", "--project=webkit"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
