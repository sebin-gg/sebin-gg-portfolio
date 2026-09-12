/**
 * Production sanity check for the offline banner:
 *  1. prerendered HTML contains no banner (server snapshot = online)
 *  2. every locale dictionary carries the offline strings
 *  3. the banner code ships in the client chunks
 * Run: node scripts/prod-offline-check.mjs [baseUrl]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "https://sebin-gg.vercel.app";
let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failures++;
};

// 1. Prerendered home HTML must not contain the banner markup.
// Fail closed on HTTP errors and network failures: an error page omits
// the banner text, so accepting it would report a broken deploy as healthy.
let response;
try {
  response = await fetch(base + "/");
} catch (error) {
  console.log(`FAIL home fetch failed: ${error.cause?.message ?? error.message}`);
  process.exit(1);
}
check(response.ok, `home responds HTTP 2xx (got ${response.status})`);
const home = await response.text();
check(
  !home.includes('role="status"'),
  "home HTML has no offline banner (server snapshot = online)",
);

// 2. All committed locale dictionaries have the offline strings.
const i18nDir = "src/lib/i18n";
const locales = readdirSync(i18nDir).filter((f) => f.endsWith(".json") && f !== "manifest.json");
for (const file of locales) {
  const dict = JSON.parse(readFileSync(join(i18nDir, file), "utf8"));
  check(
    typeof dict.offline?.message === "string" &&
      dict.offline.message.length > 0 &&
      typeof dict.offline?.retryHint === "string" &&
      dict.offline.retryHint.length > 0,
    `${file} has offline.message + offline.retryHint`,
  );
}

// 3. The banner component ships in the client bundle.
// Next App Router emits client chunks in nested dirs
// (.next/static/chunks/app/...) — walk recursively.
const chunkDir = ".next/static/chunks";
let shipped = false;
let chunkCount = 0;
const scan = (dir) => {
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) {
      scan(full);
      continue;
    }
    if (!f.endsWith(".js")) continue;
    chunkCount++;
    if (readFileSync(full, "utf8").includes("offline.message")) shipped = true;
  }
};
try {
  scan(chunkDir);
} catch {
  console.log("FAIL .next/static/chunks missing — run pnpm build first");
  process.exit(1);
}
check(chunkCount > 0, `scanned ${chunkCount} client chunks`);
check(shipped, "offline banner code present in client chunks");

process.exit(failures === 0 ? 0 : 1);
