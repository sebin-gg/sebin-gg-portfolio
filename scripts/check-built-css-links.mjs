import fs from "node:fs"; // skipcq: JS-0833 — ESM parsed with sourceType: script
import path from "node:path";

const appDir = path.resolve(".next/server/app");
const staticDir = path.resolve(".next/static");
const routeCacheDir = path.resolve(".next/server/route-cache");
const prerenderManifestPath = path.resolve(".next/prerender-manifest.json");
if (!fs.existsSync(appDir) || !fs.existsSync(staticDir)) {
  console.error("Build output is missing. Run `pnpm build` first.");
  process.exit(1);
}

const htmlFiles = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
  }
}
collect(appDir);

// Vercel's Next.js adapter writes build-time responses to route-cache instead
// of leaving the plain HTML files that this check inspects in server/app.
const hasVercelAdapterPrerenders =
  process.env.VERCEL === "1" &&
  fs.existsSync(routeCacheDir) &&
  fs.readdirSync(routeCacheDir).length > 0 &&
  fs.existsSync(prerenderManifestPath) &&
  Object.keys(JSON.parse(fs.readFileSync(prerenderManifestPath, "utf8")).routes ?? {}).length > 0;

if (htmlFiles.length === 0 && hasVercelAdapterPrerenders) {
  console.log(
    "Skipping direct HTML asset scan: the Vercel Next.js adapter stores prerendered responses in .next/server/route-cache.",
  );
  process.exit(0);
}

const errors = [];
if (htmlFiles.length === 0) {
  errors.push("No prerendered HTML files were found.");
}
let stylesheetCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = tag.match(/\brel=(?:"([^"]*)"|'([^']*)')/i);
    if (!rel || !rel.slice(1).filter(Boolean).join("").split(/\s+/).includes("stylesheet"))
      continue;
    const href = tag.match(/\bhref=(?:"([^"]*)"|'([^']*)')/i);
    if (!href) {
      errors.push(`${path.relative(appDir, file)}: stylesheet link has no href`);
      continue;
    }
    const url = href[1] ?? href[2];
    if (/\s/.test(url)) {
      errors.push(
        `${path.relative(appDir, file)}: stylesheet href contains multiple paths or whitespace: ${url}`,
      );
      continue;
    }
    const decoded = decodeURIComponent(url.split(/[?#]/, 1)[0]);
    const prefix = "/_next/static/";
    if (!decoded.startsWith(prefix)) {
      errors.push(`${path.relative(appDir, file)}: unexpected stylesheet URL: ${url}`);
      continue;
    }
    const asset = path.resolve(staticDir, decoded.slice(prefix.length));
    if (!asset.startsWith(`${staticDir}${path.sep}`) || !fs.existsSync(asset)) {
      errors.push(`${path.relative(appDir, file)}: stylesheet file is missing: ${url}`);
      continue;
    }
    stylesheetCount++;
  }
}
if (stylesheetCount === 0) {
  errors.push("No stylesheet links were found in the prerendered HTML files.");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${stylesheetCount} stylesheet links across ${htmlFiles.length} prerendered HTML files.`,
);
