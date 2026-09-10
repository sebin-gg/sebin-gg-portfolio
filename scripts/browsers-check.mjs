#!/usr/bin/env node
/**
 * Chrome-family browser sweep via puppeteer-core (no Playwright browsers):
 * discovers every installed Chromium-based browser and runs the shared site
 * audit in each one. Covers Thorium, Chrome, Chromium, Brave, Edge, Vivaldi,
 * Opera, Chromium forks on the box.
 *
 * Usage: pnpm build && pnpm check:browsers
 * Env:   BROWSERS="chrome,edge" to restrict, CHECK_CONCURRENCY=2 (default).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  checkSite,
  createLimiter,
  launch,
  report,
  requireBuild,
  root,
  serve,
} from "./lib/browser-check.mjs";

const CANDIDATES = [
  [
    "thorium",
    "Thorium",
    ["/usr/bin/thorium-browser", "/usr/bin/thorium", `${process.env.HOME}/.local/bin/thorium`],
  ],
  [
    "chrome",
    "Chrome",
    ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/opt/google/chrome/chrome"],
  ],
  [
    "chromium",
    "Chromium",
    ["/usr/bin/chromium-browser", "/usr/bin/chromium", "/snap/bin/chromium"],
  ],
  ["brave", "Brave", ["/usr/bin/brave-browser", "/usr/bin/brave"]],
  ["edge", "Edge", ["/usr/bin/microsoft-edge-stable", "/usr/bin/microsoft-edge"]],
  ["vivaldi", "Vivaldi", ["/usr/bin/vivaldi-stable", "/usr/bin/vivaldi"]],
  ["opera", "Opera", ["/usr/bin/opera"]],
];

const wanted = process.env.BROWSERS?.split(",").map((s) => s.trim().toLowerCase()) ?? null;
const found = CANDIDATES.flatMap(([id, name, paths]) =>
  paths
    .filter((p) => existsSync(p))
    .map((p) => ({ id, name, path: process.env[`${id.toUpperCase()}_PATH`] ?? p })),
)
  .filter(({ id }) => !wanted || wanted.includes(id))
  // Same binary can appear under several candidate paths — audit each once.
  .filter((entry, i, all) => all.findIndex((e) => e.path === entry.path) === i);

if (found.length === 0) {
  console.error(
    "✗ No Chrome-family browser found. Set BROWSERS or install one (thorium/chrome/brave/edge/vivaldi/opera).",
  );
  process.exit(1);
}

requireBuild();
const { server, base } = await serve(3300);
const limiter = createLimiter(Number(process.env.CHECK_CONCURRENCY ?? 2));

try {
  console.log(`Auditing ${found.length} browser(s) against ${base}`);
  const results = await Promise.all(
    found.map(({ id, name, path }) =>
      limiter(async () => {
        console.log(`▸ ${name}: ${path}`);
        const browser = await launch(path);
        if (!browser) return { id, ok: false, error: `could not launch ${path}` };
        const failures = await checkSite(browser, base, {
          screenshotsDir: resolve(root, "docs/screenshots", id),
        });
        await browser.close();
        return { id, ok: report(name, failures) };
      }),
    ),
  );

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`✗ ${failed.length} browser(s) failed checks:`);
    for (const f of failed) console.error(`  - ${f.id}${f.error ? `: ${f.error}` : ""}`);
    process.exit(1);
  }
  console.log(`✔ All ${results.length} browser(s) passed.`);
} finally {
  server.kill("SIGTERM");
}
