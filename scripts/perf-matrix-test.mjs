#!/usr/bin/env node
/**
 * Live Performance & Core Web Vitals Matrix Test:
 * Tests LCP, CLS, FCP, TTFB, and Long Tasks under simulated:
 *  - Networks: 4G, 3G, 2G, Slow 2G
 *  - CPU throttling: 1x, 4x (mid-tier), 6x (budget), 20x (extreme low-end)
 *  - Devices: Mobile (390x844) & Desktop (1440x900)
 *  - Routes: / and /blog
 *
 * Usage: node scripts/perf-matrix-test.mjs
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const root = resolve(import.meta.dirname, "..");
const PORT = 3400;

const BROWSER_PATHS = [
  process.env.THORIUM_PATH,
  process.env.CHROME_PATH,
  "/usr/bin/thorium-browser",
  "/usr/bin/thorium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/home/sebinmathew/.local/bin/thorium",
].filter(Boolean);

const executablePath = BROWSER_PATHS.find((p) => existsSync(p));

if (!executablePath) {
  console.error("✗ No Chrome/Thorium browser binary found.");
  process.exit(1);
}

if (!existsSync(resolve(root, ".next/BUILD_ID")) && !existsSync(resolve(root, ".next/server"))) {
  console.error("No production build found — please run `pnpm build` first.");
  process.exit(1);
}

const NETWORKS = {
  Unthrottled: { latency: 0, download: -1, upload: -1 },
  "4G": { latency: 20, download: (4 * 1024 * 1024) / 8, upload: (3 * 1024 * 1024) / 8 }, // 4 Mbps
  "3G": { latency: 100, download: (1.6 * 1024 * 1024) / 8, upload: (750 * 1024) / 8 }, // 1.6 Mbps
  "2G": { latency: 300, download: (450 * 1024) / 8, upload: (150 * 1024) / 8 }, // 450 kbps
  "Slow 2G": { latency: 800, download: (150 * 1024) / 8, upload: (50 * 1024) / 8 }, // 150 kbps
};

// Permutations matrix
const MATRIX = [
  {
    name: "Desktop Unthrottled",
    device: "Desktop",
    width: 1440,
    height: 900,
    network: "Unthrottled",
    cpuSlowdown: 1,
    route: "/",
    lcpLimit: 1200,
    clsLimit: 0.05,
  },
  {
    name: "Desktop 20x CPU Slow 2G",
    device: "Desktop",
    width: 1440,
    height: 900,
    network: "Slow 2G",
    cpuSlowdown: 20,
    route: "/",
    lcpLimit: 7500,
    clsLimit: 0.05,
  },
  {
    name: "Mid-tier Mobile 4G (4x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "4G",
    cpuSlowdown: 4,
    route: "/",
    lcpLimit: 1500,
    clsLimit: 0.05,
  },
  {
    name: "Mid-tier Mobile 3G (4x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "3G",
    cpuSlowdown: 4,
    route: "/",
    lcpLimit: 2500,
    clsLimit: 0.05,
  },
  {
    name: "Budget Mobile 2G (6x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "2G",
    cpuSlowdown: 6,
    route: "/",
    lcpLimit: 4000,
    clsLimit: 0.05,
  },
  {
    name: "Extreme Low-end Slow 2G (20x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "Slow 2G",
    cpuSlowdown: 20,
    route: "/",
    lcpLimit: 7500,
    clsLimit: 0.05,
  },
  {
    name: "Blog Route Low-end 3G (6x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "3G",
    cpuSlowdown: 6,
    route: "/blog",
    lcpLimit: 2500,
    clsLimit: 0.05,
  },
  {
    name: "Blog Route Extreme Slow 2G (20x CPU)",
    device: "Mobile",
    width: 390,
    height: 844,
    network: "Slow 2G",
    cpuSlowdown: 20,
    route: "/blog",
    lcpLimit: 7500,
    clsLimit: 0.05,
  },
];

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
  throw new Error("Server failed to start on port " + PORT);
}

const server = spawn("pnpm", ["start", "--port", String(PORT)], { cwd: root, stdio: "ignore" });

try {
  const base = `http://127.0.0.1:${PORT}`;
  await waitForServer(base);

  console.log(`\n================================================================================`);
  console.log(`  Live Performance Matrix (Network Throttling + CPU Slowdown Permutations)`);
  console.log(`  Browser: ${executablePath}`);
  console.log(`================================================================================\n`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const results = [];
  let allPassed = true;

  for (const config of MATRIX) {
    const page = await browser.newPage();
    await page.setViewport({ width: config.width, height: config.height });

    // Attach CDP session for network & CPU throttling
    const client = await page.createCDPSession();
    await client.send("Network.enable");

    const net = NETWORKS[config.network];
    if (net.download > 0) {
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: net.latency,
        downloadThroughput: net.download,
        uploadThroughput: net.upload,
      });
    }

    if (config.cpuSlowdown > 1) {
      await client.send("Emulation.setCPUThrottlingRate", { rate: config.cpuSlowdown });
    }

    // Install Web Vitals listeners before page loads
    await page.evaluateOnNewDocument(() => {
      window.__vitals = { lcp: 0, cls: 0, fcp: 0, longTasksDuration: 0, longTasksCount: 0 };

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.__vitals.lcp = Math.round(entry.startTime);
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__vitals.cls += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            window.__vitals.fcp = Math.round(entry.startTime);
          }
        }
      }).observe({ type: "paint", buffered: true });

      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            window.__vitals.longTasksCount++;
            window.__vitals.longTasksDuration += Math.round(entry.duration);
          }
        }).observe({ type: "longtask", buffered: true });
      } catch {
        /* longtask observer may not be available on all engines */
      }
    });

    const targetUrl = `${base}${config.route}`;
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 30000 });

    // Allow any trailing observations to settle
    await new Promise((r) => setTimeout(r, 200));

    const vitals = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const ttfb = nav ? Math.round(nav.responseStart) : 0;
      return {
        ...window.__vitals,
        ttfb,
        cls: Number(window.__vitals.cls.toFixed(4)),
      };
    });

    // If LCP wasn't recorded explicitly, fall back to FCP
    if (!vitals.lcp && vitals.fcp) {
      vitals.lcp = vitals.fcp;
    }

    const clsPassed = vitals.cls <= config.clsLimit;
    const lcpPassed = vitals.lcp <= config.lcpLimit;
    const passed = clsPassed && lcpPassed;

    if (!passed) {
      allPassed = false;
    }

    results.push({
      profile: config.name,
      route: config.route,
      network: config.network,
      cpu: `${config.cpuSlowdown}x`,
      ttfb: `${vitals.ttfb}ms`,
      fcp: `${vitals.fcp}ms`,
      lcp: `${vitals.lcp}ms (lim ${config.lcpLimit}ms)`,
      cls: `${vitals.cls} (lim ${config.clsLimit})`,
      longTasks: `${vitals.longTasksCount} (${vitals.longTasksDuration}ms)`,
      status: passed ? "✔ PASS" : "✗ FAIL",
    });

    await page.close();
  }

  await browser.close();

  // Print results table
  console.table(results);

  if (!allPassed) {
    console.error("\n✗ Performance matrix assertion failed! One or more tests exceeded limits.\n");
    process.exit(1);
  }

  console.log(
    "\n✔ All performance matrix tests passed! LCP and CLS strictly within budget across all permutations.\n",
  );
} finally {
  server.kill("SIGTERM");
}
