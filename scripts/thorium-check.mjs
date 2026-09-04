#!/usr/bin/env node
/**
 * Thorium Browser E2E/Visual check using puppeteer-core:
 *  - Launches the locally installed Thorium browser (/usr/bin/thorium-browser)
 *  - Verifies home and blog routes without runtime/console errors
 *  - Asserts no horizontal overflow across desktop and mobile viewports
 *  - Checks dark/light theme switching
 *  - Captures screenshots into docs/screenshots/thorium/
 *
 * Usage: pnpm build && node scripts/thorium-check.mjs
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(import.meta.dirname, "..");
const PORT = 3300;
const outDir = resolve(root, "docs/screenshots/thorium");

const THORIUM_PATHS = [
  process.env.THORIUM_PATH,
  "/usr/bin/thorium-browser",
  "/usr/bin/thorium",
  "/home/sebinmathew/.local/bin/thorium",
].filter(Boolean);

const executablePath = THORIUM_PATHS.find((p) => existsSync(p));

if (!executablePath) {
  console.error("✗ Thorium browser not found. Set THORIUM_PATH or install thorium-browser.");
  process.exit(1);
}

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
  { name: "desktop-dark", width: 1440, height: 900, dark: true },
  { name: "desktop-light", width: 1440, height: 900, dark: false },
  { name: "mobile-dark", width: 390, height: 844, dark: true },
  { name: "mobile-light", width: 390, height: 844, dark: false },
];

try {
  const base = `http://127.0.0.1:${PORT}`;
  await waitForServer(base);
  mkdirSync(outDir, { recursive: true });

  console.log(`Launching Thorium at: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  const failures = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      failures.push(`Console error on ${page.url()}: ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    failures.push(`Page error on ${page.url()}: ${err.message}`);
  });

  for (const { name, width, height, dark } of views) {
    await page.setViewport({ width, height });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: dark ? "dark" : "light" },
    ]);
    await page.goto(`${base}/`, { waitUntil: "networkidle0" });

    await page.evaluate((isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }, dark);

    await new Promise((r) => setTimeout(r, 150));
    await page.screenshot({ path: resolve(outDir, `${name}.png`), fullPage: true });

    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));

    if (overflow.scroll > overflow.client) {
      failures.push(`${name}: horizontal overflow ${overflow.scroll}px > ${overflow.client}px`);
    }

    console.log(`✔ ${name} verified in Thorium (${width}x${height}, ${dark ? "dark" : "light"})`);
  }

  for (const width of [320, 360, 768]) {
    await page.setViewport({ width, height: 800 });
    await page.goto(`${base}/blog`, { waitUntil: "networkidle0" });
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (overflow.scroll > overflow.client) {
      failures.push(`blog at ${width}px: overflow ${overflow.scroll}px > ${overflow.client}px`);
    }
  }
  console.log("✔ /blog responsive widths (320/360/768px) verified in Thorium");

  await browser.close();

  if (failures.length > 0) {
    console.error(failures.map((f) => `✗ ${f}`).join("\n"));
    process.exit(1);
  }

  console.log(`✔ Thorium check passed! Screenshots saved in docs/screenshots/thorium/`);
} finally {
  server.kill("SIGTERM");
}
