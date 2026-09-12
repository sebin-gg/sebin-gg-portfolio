/**
 * Production sanity check for the offline banner:
 *  1. prerendered HTML contains no banner (server snapshot = online)
 *  2. every locale dictionary carries the offline strings
 *  3. the banner code ships in the client chunks
 * Run: node scripts/prod-offline-check.mjs
 *
 * Operator-only tool with a hardcoded production origin — no URL input,
 * no request-derived data, no SSRF surface by construction.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Hardcoded by design: any variable URL (even allowlisted argv) trips
// Sonar jssecurity:S8703 on new_security_rating. Production origin only.
const target = "https://sebin-gg.vercel.app/";
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
  response = await fetch(target);
} catch (error) {
  console.log(`FAIL home fetch failed: ${error.cause?.message ?? error.message}`);
  process.exit(1);
}
if (!response.ok) {
  console.log(`FAIL home responds HTTP 2xx (got ${response.status})`);
  process.exit(1);
}
const contentType = response.headers.get("content-type") ?? "";
check(
  contentType.includes("text/html"),
  `home served as text/html (got ${contentType.split(";")[0].trim()})`,
);
const home = await response.text();
check(
  home.includes("<html") && home.includes("</html>") && home.includes("Sebin Mathew"),
  "home HTML is complete and served by this app",
);
check(
  !home.includes('role="status"'),
  "home HTML has no offline banner (server snapshot = online)",
);

// 2. Locales declared in manifest.json must ship the offline strings.
// Manifest is the single source of truth; a missing dictionary or a
// stale dictionary not declared in it both fail the check.
const i18nDir = "src/lib/i18n";
const manifest = JSON.parse(readFileSync(join(i18nDir, "manifest.json"), "utf8"));
const declared = new Set(manifest.map((entry) => entry.code));
for (const code of declared) {
  const path = join(i18nDir, `${code}.json`);
  let dict;
  try {
    dict = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    check(false, `${code}.json missing`);
    continue;
  }
  check(
    typeof dict.offline?.message === "string" &&
      dict.offline.message.length > 0 &&
      typeof dict.offline?.retryHint === "string" &&
      dict.offline.retryHint.length > 0,
    `${code}.json has offline.message + offline.retryHint`,
  );
}
for (const file of readdirSync(i18nDir)) {
  if (
    file.endsWith(".json") &&
    file !== "manifest.json" &&
    !declared.has(file.replace(/\.json$/, ""))
  ) {
    check(false, `${file} not declared in manifest.json`);
  }
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
