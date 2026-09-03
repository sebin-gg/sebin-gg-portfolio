#!/usr/bin/env node
/**
 * Visual check for the human in the loop:
 *  - screenshots the home page (light + dark, desktop + mobile)
 *  - asserts no horizontal overflow on common widths (320px and up)
 *
 * Usage: pnpm build && node scripts/visual-check.mjs
 * Output: docs/screenshots/*.png — review them and send feedback.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "..");
const PORT = 3200;
const outDir = resolve(root, "docs/screenshots");

if (!existsSync(resolve(root, ".next/BUILD_ID")) && !existsSync(resolve(root, ".next/server"))) {
  console.error("No build found — run `pnpm build` first.");
  process.exit(1);
}

const server = spawn("pnpm", ["start", "--port", String(PORT)], { cwd: root, stdio: "ignore" });

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server did not start in time");
}

const views = [
  { name: "desktop-light", width: 1440, height: 900, dark: false },
  { name: "desktop-dark", width: 1440, height: 900, dark: true },
  { name: "mobile-light", width: 390, height: 844, dark: false },
  { name: "mobile-dark", width: 390, height: 844, dark: true },
];

try {
  const base = `http://127.0.0.1:${PORT}`;
  await waitForServer(base);
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const failures = [];

  for (const { name, width, height, dark } of views) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    // Force the toggle state too, in case the inline script disagreed.
    await page.evaluate((enabled) => {
      document.documentElement.classList.toggle("dark", enabled);
      localStorage.setItem("theme", enabled ? "dark" : "light");
    }, dark);
    await page.waitForTimeout(150);
    await page.screenshot({ path: resolve(outDir, `${name}.png`), fullPage: true });

    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (overflow.scroll > overflow.client) {
      failures.push(`${name}: horizontal overflow ${overflow.scroll}px > ${overflow.client}px`);
    }
    console.log(`✔ ${name} captured (width ${width}px, ${dark ? "dark" : "light"})`);
  }

  // Scan the narrowest widths for overflow specifically.
  for (const width of [320, 360, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(base + "/blog", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (overflow.scroll > overflow.client) {
      failures.push(`blog at ${width}px: overflow ${overflow.scroll}px > ${overflow.client}px`);
    }
  }
  console.log("✔ No horizontal overflow on /blog at 320/360/768px");
  await browser.close();

  if (failures.length > 0) {
    console.error(failures.map((f) => `✗ ${f}`).join("\n"));
    process.exit(1);
  }
  console.log(`\nScreenshots saved to docs/screenshots/ — review them!`);
} finally {
  server.kill("SIGTERM");
}
