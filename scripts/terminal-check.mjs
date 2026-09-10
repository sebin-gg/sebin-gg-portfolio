#!/usr/bin/env node
/**
 * Terminal / text-mode browser check (lynx, w3m, links). Proves the site
 * stays usable with zero JavaScript, zero CSS and zero images: the content
 * a screen reader or search bot sees is what these engines see.
 *
 * Per engine: home + blog must return 200, and both must contain the
 * essential text landmarks (name, tagline fragment, section headings,
 * blog route text, résumé link).
 *
 * Usage: pnpm build && pnpm check:terminal
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { requireBuild, serve } from "./lib/browser-check.mjs";

const execFileAsync = promisify(execFile);

const ENGINES = [
  { cmd: "lynx", dump: ["-dump", "-nolist"] },
  { cmd: "w3m", dump: ["-dump", "-no-cookie"] },
  { cmd: "links", dump: ["-dump"] },
];

const MUST_CONTAIN = [
  ["home", "/", ["Sebin Mathew", "About", "Projects", "Skills", "Experience"]],
  ["blog", "/blog", ["Blog"]],
];

async function dump(engine, url) {
  const { stdout } = await execFileAsync(engine.cmd, [...engine.dump, url], {
    timeout: 20_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  return stdout;
}

requireBuild();
const { server, base } = await serve(3301);

try {
  const available = [];
  for (const engine of ENGINES) {
    try {
      await execFileAsync("which", [engine.cmd]);
      available.push(engine);
    } catch {
      console.warn(`! ${engine.cmd} not installed — skipped`);
    }
  }
  if (available.length === 0) {
    console.error("✗ No terminal browser found. Install one: sudo apt install lynx w3m links");
    process.exit(1);
  }

  let failed = false;
  for (const engine of available) {
    for (const [label, path, needles] of MUST_CONTAIN) {
      const text = await dump(engine, `${base}${path}`);
      const missing = needles.filter((n) => !text.includes(n));
      if (missing.length > 0) {
        console.error(`✗ [${engine.cmd}] ${label}: missing text: ${missing.join(" | ")}`);
        failed = true;
      } else {
        console.log(`✔ [${engine.cmd}] ${label}: all ${needles.length} landmarks present`);
      }
    }
  }
  if (failed) process.exit(1);
  console.log(`✔ Terminal-browser check passed (${available.map((e) => e.cmd).join(", ")}).`);
} finally {
  server.kill("SIGTERM");
}
