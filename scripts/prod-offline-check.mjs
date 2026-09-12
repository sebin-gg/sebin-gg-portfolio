/**
 * Production sanity check for the offline banner:
 *  1. prerendered HTML contains no banner (server snapshot = online)
 *  2. every locale dictionary carries the offline strings
 *  3. the banner code ships in the client chunks
 * Run: node scripts/prod-offline-check.mjs [baseUrl]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "https://sebin-gg.vercel.app";
let failures = 0;
const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failures++;
};

// 1. Prerendered home HTML must not contain the banner markup.
const home = await (await fetch(base + "/")).text();
check(
  !home.includes("You’re offline"),
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
const chunkDir = ".next/static/chunks";
let shipped = false;
try {
  for (const f of readdirSync(chunkDir)) {
    if (!f.endsWith(".js")) continue;
    if (readFileSync(join(chunkDir, f), "utf8").includes("offline.message")) shipped = true;
  }
} catch {
  console.log("SKIP .next/static/chunks missing — run pnpm build first");
}
check(shipped, "offline banner code present in client chunks");

process.exit(failures === 0 ? 0 : 1);
