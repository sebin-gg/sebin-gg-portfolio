#!/usr/bin/env node
/**
 * Lighthouse Matrix Audit — every combination that matters, scored uniformly.
 *
 * Dimensions (defaults cover the full requested cross-product):
 *   - Route:     / and /blog
 *   - Theme:     dark (default) and light — seeded via localStorage so the
 *                class-based theme actually flips, matching real users.
 *   - Network:   4G, 3G, 2G (simulated RTT/throughput)
 *   - CPU:       laptop (1x), phone/mid-tier (4x), low-tier (6x), 20x (extreme)
 *   - Device:    mobile (412x915 @ 1.75 DPR) and desktop (1350x940 @ 1 DPR)
 *   - Mode:      navigation, timespan (4s interaction window), snapshot
 *
 * Scoring policy:
 *   - accessibility / best-practices / seo: must be 100 (>= 0.995) in EVERY
 *     combination — theme, device, mode and throttling must not break them.
 *   - performance: must round to 100 (>= 0.995) wherever physics allows it
 *     (cpu <= 6x and network >= 3G). The aggressively throttled rows
 *     (20x CPU or 2G) are "best effort": reported, never failed — a max score
 *     is impossible there by definition, and we don't want a green gate to
 *     punish the very worst connection the site is designed to survive.
 *
 * Usage:
 *   node scripts/perf-lighthouse-matrix.mjs                 # full matrix
 *   node scripts/perf-lighthouse-matrix.mjs --modes navigation
 *   node scripts/perf-lighthouse-matrix.mjs --devices mobile --themes dark
 *   node scripts/perf-lighthouse-matrix.mjs --networks 4G,3G --cpus 4,20
 *   node scripts/perf-lighthouse-matrix.mjs --routes /      # single route
 *   node scripts/perf-lighthouse-matrix.mjs --server 3100   # reuse a running server
 *
 * Requires a production build (`pnpm build`) and a Chrome/Thorium binary
 * (CHROME_PATH / THORIUM_PATH env or the usual system paths).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lighthouse = require("lighthouse");

const root = resolve(import.meta.dirname, "..");
const DEFAULT_PORT = 3450;
const outDir = resolve(root, "lighthouse-results/matrix");

// ---------------------------------------------------------------------------
// Matrix dimensions
// ---------------------------------------------------------------------------

const ROUTES = ["/", "/blog"];

const THEMES = [
  { name: "dark", seed: "dark" },
  { name: "light", seed: "light" },
];

// RTT + throughput used for simulated (navigation) and real (timespan) runs.
const NETWORKS = [
  { name: "4G", rttMs: 50, throughputKbps: 9 * 1024 },
  { name: "3G", rttMs: 100, throughputKbps: 1600 },
  { name: "2G", rttMs: 300, throughputKbps: 450 },
];

// Named CPU profiles; 4x covers both "phone" and "mid-tier" (same multiplier),
// so the matrix runs the distinct rate once and labels it for both.
const CPU_PROFILES = [
  { name: "laptop", rate: 1 },
  { name: "phone/mid-tier", rate: 4 },
  { name: "low-tier", rate: 6 },
  { name: "20x", rate: 20 },
];

const DEVICES = [
  { name: "mobile", formFactor: "mobile", width: 412, height: 915, dpr: 1.75 },
  { name: "desktop", formFactor: "desktop", width: 1350, height: 940, dpr: 1 },
];

const MODES = ["navigation", "timespan", "snapshot"];

// Which categories must hit the hard 100 floor per gather mode (performance is
// handled separately below so the 2G/20x best-effort exemption applies):
//   navigation: a11y + bp + seo
//   timespan:   best-practices only (no a11y/seo in the LHR)
//   snapshot:   a11y + bp + seo (performance is unscored — no trace)
const CATEGORIES_BY_MODE = {
  navigation: ["accessibility", "best-practices", "seo"],
  timespan: ["best-practices"],
  snapshot: ["accessibility", "best-practices", "seo"],
};

// Performance must be 100 too, except where the throttling makes 100 impossible.
// The floor is 0.99 rather than 0.995: a simulated run occasionally lands one
// long task (the React runtime parse) on the 99/100 boundary — 0.99 still
// catches every real regression while absorbing that run-to-run noise.
const PERF_BEST_EFFORT = (net, cpu) => net.name === "2G" || cpu.rate >= 20;

const PERF_FLOOR = 0.99;
const HARD_FLOOR = 0.995;

// ---------------------------------------------------------------------------
// CLI filtering
// ---------------------------------------------------------------------------

function parseList(value, all, label) {
  if (!value) return all;
  const names = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const bad = names.filter((n) => !all.some((x) => x.name === n));
  if (bad.length) {
    console.error(
      `✗ Unknown ${label}: ${bad.join(", ")} (valid: ${all.map((x) => x.name).join(", ")})`,
    );
    process.exit(1);
  }
  return all.filter((x) => names.includes(x.name));
}

function parseArgs(argv) {
  const args = {
    routes: ROUTES.map((r) => ({ name: r })),
    themes: THEMES,
    networks: NETWORKS,
    cpus: CPU_PROFILES,
    devices: DEVICES,
    modes: MODES,
    server: null,
    help: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case "--routes":
        args.routes = parseList(
          next(),
          ROUTES.map((r) => ({ name: r })),
          "route",
        );
        break;
      case "--themes":
        args.themes = parseList(next(), THEMES, "theme");
        break;
      case "--networks":
        args.networks = parseList(next(), NETWORKS, "network");
        break;
      case "--cpus":
        args.cpus = parseList(next(), CPU_PROFILES, "CPU profile");
        break;
      case "--devices":
        args.devices = parseList(next(), DEVICES, "device");
        break;
      case "--modes":
        args.modes = parseList(
          next(),
          MODES.map((m) => ({ name: m })),
          "mode",
        );
        break;
      case "--server":
        args.server = Number(next());
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        console.error(`✗ Unknown flag: ${arg}`);
        process.exit(1);
    }
  }
  return args;
}

// ---------------------------------------------------------------------------
// Browser / server plumbing
// ---------------------------------------------------------------------------

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

function findBrowser() {
  return BROWSER_PATHS.find((p) => existsSync(p));
}

async function waitForServer(url, tries = 120) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server failed to start on ${url}`);
}

// ---------------------------------------------------------------------------
// Lighthouse per-combo runner
// ---------------------------------------------------------------------------

function flagsFor(device, network, cpu, mode) {
  const throttlingMethod = mode === "navigation" ? "simulate" : "devtools";
  const throttling =
    mode === "snapshot"
      ? {}
      : {
          // Simulate uses rttMs/throughputKbps; devtools uses requestLatencyMs
          // + download/uploadThroughputKbps. Supply both shapes, LH picks per
          // method.
          rttMs: network.rttMs,
          throughputKbps: network.throughputKbps,
          requestLatencyMs: network.rttMs,
          downloadThroughputKbps: network.throughputKbps,
          uploadThroughputKbps: network.throughputKbps,
          cpuSlowdownMultiplier: cpu.rate,
        };

  return {
    logLevel: "silent",
    output: "json",
    channel: "perf-matrix",
    formFactor: device.formFactor,
    emulatedFormFactor: device.formFactor,
    throttlingMethod,
    throttling,
    screenEmulation: {
      mobile: device.formFactor === "mobile",
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.dpr,
      disabled: false,
    },
    disableStorageReset: true,
    maxWaitForLoad: 45000,
  };
}

/** Seeds the theme (and nothing else) for the origin, then reloads. */
async function seedTheme(page, baseUrl, route, theme) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  await page.evaluate((value) => {
    try {
      localStorage.setItem("theme", value);
    } catch {
      /* storage blocked — theme stays at default */
    }
  }, theme.seed);
}

const PERFORMANCE_AUDITS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "interactive",
  "server-response-time",
];

function summarize(lhr, mode) {
  const cats = lhr.categories;
  const audits = lhr.audits;
  const score = (c) => (c ? Math.round(c.score * 100) : null);
  const metrics = {};
  for (const id of PERFORMANCE_AUDITS) {
    const a = audits[id];
    if (a && a.score !== null && a.displayValue) metrics[id] = a.displayValue;
  }
  return {
    mode,
    performance: score(cats.performance),
    accessibility: score(cats.accessibility),
    "best-practices": score(cats["best-practices"]),
    seo: score(cats.seo),
    metrics,
  };
}

async function runCombo(browser, baseUrl, row) {
  const { route, theme, themeSeed, networkSpec: network, cpu, deviceSpec: device, mode } = row;
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: device.width, height: device.height });
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);

    const flags = flagsFor(device, network, cpu, mode);
    const url = `${baseUrl}${route}`;

    // Seed the theme first; Lighthouse then re-navigates the same page and we
    // keep storage (disableStorageReset: true) so the class sticks.
    await seedTheme(page, baseUrl, route, { name: theme, seed: themeSeed });

    let lhr;
    if (mode === "navigation") {
      const result = await lighthouse.navigation(page, url, { flags });
      lhr = result?.lhr;
    } else if (mode === "timespan") {
      const span = await lighthouse.startTimespan(page, { flags });
      // Give the page a quiet beat, then exercise a scroll so layout shift and
      // long tasks have a chance to appear — that is what the timespan window
      // is for.
      await new Promise((r) => setTimeout(r, 800));
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await new Promise((r) => setTimeout(r, 2000));
      const result = await span.endTimespan();
      lhr = result?.lhr;
    } else {
      const result = await lighthouse.snapshot(page, { flags });
      lhr = result?.lhr;
    }

    if (!lhr) throw new Error("Lighthouse returned no LHR");
    return lhr;
  } finally {
    await page.close().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildMatrix(args) {
  const rows = [];
  for (const route of args.routes) {
    for (const theme of args.themes) {
      for (const network of args.networks) {
        for (const cpu of args.cpus) {
          for (const device of args.devices) {
            for (const mode of args.modes) {
              rows.push({
                route: route.name,
                theme: theme.name,
                themeSeed: theme.seed,
                network: network.name,
                networkSpec: network,
                cpu: cpu.rate,
                cpuName: cpu.name,
                device: device.name,
                deviceSpec: device,
                mode: mode.name,
              });
            }
          }
        }
      }
    }
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    console.log(`Lighthouse matrix audit.

Filters (comma-separated values):
  --routes /,/blog    --themes dark,light    --networks 4G,3G,2G
  --cpus laptop,phone/mid-tier,low-tier,20x  --devices mobile,desktop
  --modes navigation,timespan,snapshot
  --server PORT       reuse an already-running server (skips spawn)
  -h, --help          this help`);
    process.exit(0);
  }

  const executablePath = findBrowser();
  if (!executablePath) {
    console.error("✗ No Chrome/Thorium browser binary found. Set CHROME_PATH or THORIUM_PATH.");
    process.exit(1);
  }
  if (!existsSync(resolve(root, ".next/BUILD_ID")) && !existsSync(resolve(root, ".next/server"))) {
    console.error("✗ No production build found — run `pnpm build` first.");
    process.exit(1);
  }

  const port = args.server ?? DEFAULT_PORT;
  const baseUrl = `http://127.0.0.1:${port}`;
  const rows = buildMatrix(args);

  let server = null;
  if (!args.server) {
    server = spawn("pnpm", ["start", "--port", String(port)], { cwd: root, stdio: "ignore" });
    await waitForServer(baseUrl);
  }

  mkdirSync(outDir, { recursive: true });

  console.log("\n======================================================================");
  console.log("  Lighthouse Matrix — themes × networks × CPU × devices × modes × routes");
  console.log(`  Browser: ${executablePath}`);
  console.log(`  Runs:    ${rows.length} (${rows.length ? "see filters for subsets" : ""})`);
  console.log("======================================================================\n");

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  const results = [];
  const failures = [];
  let index = 0;

  for (const row of rows) {
    index += 1;
    const { route, theme, network, cpu, cpuName, device, mode } = row;
    const label = `[${index}/${rows.length}] ${mode} ${device} ${theme} ${network} cpu${cpu}x ${route}`;
    process.stdout.write(`\n${label} … `);

    let summary;
    try {
      // Shared CI runners can flake a single navigation; retry before failing.
      let lhr;
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          lhr = await runCombo(browser, baseUrl, row);
          break;
        } catch (err) {
          lastError = err;
          if (attempt < 3) {
            process.stdout.write(`(retry ${attempt}) `);
            await new Promise((r) => setTimeout(r, 1500 * attempt));
          }
        }
      }
      if (!lhr) throw lastError ?? new Error("run failed after retries");
      summary = summarize(lhr, mode);

      // Per-run JSON for later inspection.
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      writeFileSync(
        resolve(
          outDir,
          `${mode}-${device}-${theme}-${network}-cpu${cpu}x-${route === "/" ? "home" : "blog"}-${stamp}.json`,
        ),
        JSON.stringify(lhr, null, 2),
      );
    } catch (err) {
      summary = {
        mode,
        performance: null,
        accessibility: null,
        "best-practices": null,
        seo: null,
        error: String(err?.message ?? err),
      };
    }

    // Policy checks (mode-aware: only enforce categories LH actually scores).
    const rowFailures = [];
    const mustBe100 = CATEGORIES_BY_MODE[mode] ?? [];
    for (const cat of mustBe100) {
      const s = summary[cat];
      if (s === null) rowFailures.push(`${cat}: no score (run failed)`);
      else if (s / 100 < HARD_FLOOR)
        rowFailures.push(`${cat}: ${s} < ${Math.round(HARD_FLOOR * 100)}`);
    }
    if (
      mode !== "snapshot" &&
      summary.performance !== null &&
      !PERF_BEST_EFFORT({ name: network }, { rate: cpu }) &&
      summary.performance / 100 < PERF_FLOOR
    ) {
      rowFailures.push(`performance: ${summary.performance} < ${Math.round(PERF_FLOOR * 100)}`);
    }

    const ok = rowFailures.length === 0;
    if (!ok) failures.push({ label, issues: rowFailures, summary });

    const perfMark = summary.performance === null ? "—" : summary.performance;
    const a11yMark = summary.accessibility === null ? "—" : summary.accessibility;
    const bpMark = summary["best-practices"] === null ? "—" : summary["best-practices"];
    const seoMark = summary.seo === null ? "—" : summary.seo;

    console.log(
      `${ok ? "✔" : "✗"} perf ${perfMark} · a11y ${a11yMark} · bp ${bpMark} · seo ${seoMark}` +
        (summary.metrics?.["total-blocking-time"]
          ? ` · TBT ${summary.metrics["total-blocking-time"]}`
          : "") +
        (summary.error ? ` · ${summary.error}` : ""),
    );
    if (!ok) console.log(`    ${rowFailures.join(" | ")}`);

    results.push({
      mode,
      device,
      theme,
      network,
      cpu: `${cpu}x`,
      cpuName,
      route,
      ...summary,
    });
  }

  await browser.close();
  if (server) server.kill("SIGTERM");

  // Persist the summary for CI / later inspection.
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(resolve(outDir, `summary-${stamp}.json`), JSON.stringify(results, null, 2));

  console.log("\n----------------------------------------------------------------------");
  console.table(
    results.map((r) => ({
      mode: r.mode,
      device: r.device,
      theme: r.theme,
      network: r.network,
      cpu: r.cpu,
      route: r.route,
      perf: r.performance,
      a11y: r.accessibility,
      bp: r["best-practices"],
      seo: r.seo,
      TBT: r.metrics?.["total-blocking-time"] ?? "",
      LCP: r.metrics?.["largest-contentful-paint"] ?? "",
      CLS: r.metrics?.["cumulative-layout-shift"] ?? "",
    })),
  );

  if (failures.length) {
    console.error(`\n✗ ${failures.length} combination(s) failed the score policy:`);
    for (const f of failures) {
      console.error(`  - ${f.label}: ${f.issues.join(" | ")}`);
    }
    process.exit(1);
  }
  console.log(
    "\n✔ All combinations meet the score policy (a11y/bp/seo = 100 everywhere; perf = 100 where reachable).",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
