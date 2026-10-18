import fs from "node:fs"; // skipcq: JS-0833 — ESM parsed with sourceType: script
import path from "node:path";

const appDir = path.resolve(".next/server/app");
const staticDir = path.resolve(".next/static");
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
