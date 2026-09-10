#!/usr/bin/env node
/**
 * Shared helpers for the browser E2E/visual check scripts:
 *  - serve(): builds nothing, spawns `pnpm start --port <port>` on an existing
 *    production build and resolves once the server answers.
 *  - checkSite(): drives one browser through the whole site audit
 *    (routes, console/page errors, horizontal overflow, theme switch,
 *    screenshots) using puppeteer-core.
 *
 * Every check script (thorium, chrome-family discovery, terminal) reuses
 * these so the assertions stay identical across engines.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import puppeteer from "puppeteer-core";

export const root = resolve(import.meta.dirname, "..", "..");

export function requireBuild() {
  if (!existsSync(resolve(root, ".next/BUILD_ID")) && !existsSync(resolve(root, ".next/server"))) {
    console.error("No build found — run `pnpm build` first.");
    process.exit(1);
  }
}

export async function serve(port) {
  const server = spawn("pnpm", ["start", "--port", String(port)], {
    cwd: root,
    stdio: "ignore",
  });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(base);
      if (res.ok) return { server, base };
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill("SIGTERM");
  throw new Error(`Server did not start on :${port} in time`);
}

/** Shared view matrix: both theme × both device class + narrow /blog widths. */
export const views = [
  { name: "desktop-dark", width: 1440, height: 900, dark: true },
  { name: "desktop-light", width: 1440, height: 900, dark: false },
  { name: "mobile-dark", width: 390, height: 844, dark: true },
  { name: "mobile-light", width: 390, height: 844, dark: false },
];

export const blogWidths = [320, 360, 768];

/**
 * Run the full site audit against one already-launched puppeteer browser.
 * Returns a list of failure descriptions (empty = pass).
 */
export async function checkSite(browser, base, { screenshotsDir } = {}) {
  const failures = [];
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") failures.push(`Console error on ${page.url()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => failures.push(`Page error on ${page.url()}: ${err.message}`));

  for (const { name, width, height, dark } of views) {
    await page.setViewport({ width, height });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: dark ? "dark" : "light" },
    ]);
    await page.goto(`${base}/`, { waitUntil: "networkidle2", timeout: 60_000 });

    await page.evaluate((isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }, dark);

    await new Promise((r) => setTimeout(r, 150));
    if (screenshotsDir) {
      mkdirSync(screenshotsDir, { recursive: true });
      await page.screenshot({ path: resolve(screenshotsDir, `${name}.png`), fullPage: true });
    }

    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (overflow.scroll > overflow.client) {
      failures.push(`${name}: horizontal overflow ${overflow.scroll}px > ${overflow.client}px`);
    }
  }

  for (const width of blogWidths) {
    await page.setViewport({ width, height: 800 });
    await page.goto(`${base}/blog`, { waitUntil: "networkidle2", timeout: 60_000 });
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    if (overflow.scroll > overflow.client) {
      failures.push(`blog at ${width}px: overflow ${overflow.scroll}px > ${overflow.client}px`);
    }
  }

  await page.close();
  return failures;
}

export function report(browserName, failures) {
  if (failures.length > 0) {
    console.error(failures.map((f) => `✗ [${browserName}] ${f}`).join("\n"));
    return false;
  }
  console.log(`✔ ${browserName}: all routes, themes and responsive widths verified`);
  return true;
}

/**
 * Launch puppeteer-core against an executable path with CI-friendly flags.
 * Returns null when the binary cannot start (engine too old, missing deps…).
 */
export async function launch(executablePath) {
  try {
    return await puppeteer.launch({
      executablePath,
      headless: true,
      timeout: 30_000,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (err) {
    console.warn(`! Could not launch ${executablePath}: ${err.message.split("\n")[0]}`);
    return null;
  }
}

/** Simple FIFO limiter so N browsers run without melting the machine. */
export function createLimiter(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (queue.length === 0) return;
    if (active >= concurrency) return;
    active++;
    const job = queue.shift();
    job
      .fn()
      .then(job.resolve, job.reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return function run(fn) {
    return new Promise((resolveRun, rejectRun) => {
      queue.push({ fn, resolve: resolveRun, reject: rejectRun });
      next();
    });
  };
}
