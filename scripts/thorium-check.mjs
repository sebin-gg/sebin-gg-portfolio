#!/usr/bin/env node
/**
 * Thorium Browser E2E/Visual check using puppeteer-core:
 *  - Launches the locally installed Thorium browser (/usr/bin/thorium-browser)
 *  - Runs the shared audit: home + blog routes, console/page errors,
 *    horizontal overflow, dark/light theme switching, screenshots
 *    into docs/screenshots/thorium/
 *
 * Usage: pnpm build && node scripts/thorium-check.mjs
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { checkSite, launch, report, requireBuild, root, serve } from "./lib/browser-check.mjs";

const THORIUM_PATHS = [
  process.env.THORIUM_PATH,
  "/usr/bin/thorium-browser",
  "/usr/bin/thorium",
  `${process.env.HOME}/.local/bin/thorium`,
].filter(Boolean);

const executablePath = THORIUM_PATHS.find((p) => existsSync(p));

if (!executablePath) {
  console.error("✗ Thorium browser not found. Set THORIUM_PATH or install thorium-browser.");
  process.exit(1);
}

requireBuild();
const { server, base } = await serve(3300);

try {
  console.log(`Launching Thorium at: ${executablePath}`);
  const browser = await launch(executablePath);
  if (!browser) process.exit(1);

  const failures = await checkSite(browser, base, {
    screenshotsDir: resolve(root, "docs/screenshots/thorium"),
  });
  await browser.close();

  if (!report("Thorium", failures)) process.exit(1);
  console.log("✔ Thorium check passed! Screenshots saved in docs/screenshots/thorium/");
} finally {
  server.kill("SIGTERM");
}
