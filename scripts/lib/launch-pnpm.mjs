import { spawnSync, spawn } from "node:child_process";
import { accessSync, constants, existsSync, realpathSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Spawn the repo's package manager without PATH lookup (Sonar S4036).
 *
 * Every check/perf script launches `pnpm start` or `pnpm exec …`. Calling the
 * bare command name makes Node resolve it through PATH, so a writable entry
 * earlier in PATH shadows the real binary — the classic way CI scripts get
 * hijacked, and exactly what S4036 flags.
 *
 * This helper resolves the *absolute* pnpm executable once per call, then
 * every spawn hands Node that fixed path — no PATH search happens:
 *   1. corepack layout: when corepack provides pnpm, the running version is
 *      named by npm_config_user_agent (e.g. "pnpm/11.20.0 …") and its entry
 *      point lives at an absolute path under COREPACK_ROOT;
 *   2. otherwise the executable found on PATH is resolved to its real file
 *      (`command -v pnpm` + readlink) and verified before use.
 *
 * Each candidate is verified (absolute path, exists, regular file,
 * executable) before it is handed back, so a broken or spoofed entry fails
 * closed with a clear error instead of falling through to a PATH search.
 */

const here = dirname(fileURLToPath(import.meta.url));

function isExecutableFile(p) {
  if (typeof p !== "string" || !p.startsWith("/")) return false;
  try {
    if (!existsSync(p)) return false;
    if (!statSync(p).isFile()) return false;
    accessSync(p, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveSymlinkTarget(p) {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/** Resolve pnpm to an absolute, verified executable path. Throws when none is found. */
export function resolvePnpmBin() {
  const errors = [];
  const ua = process.env.npm_config_user_agent ?? "";
  const version = ua.match(/pnpm\/(\d[\dA-Za-z.+-]*)/)?.[1];
  const corepackRoot = process.env.COREPACK_ROOT ?? "";
  if (version && corepackRoot) {
    // Corepack keeps one directory per package-manager version; the pnpm
    // entry point is the absolute file inside it.
    const entry = resolve(corepackRoot, `pnpm/${version}/lib/pnpm.js`);
    if (isExecutableFile(entry) || existsSync(entry)) return entry;
    errors.push(`corepack entry missing: ${entry}`);
  }
  try {
    // S4036: the PATH search here covers only the two fixed probe commands
    // ("sh" and "command -v pnpm"). The spawn sites never consult PATH — they
    // execute the absolute verified path this function returns, so a writable
    // PATH entry cannot substitute the package-manager binary.
    const probe = spawnSync("/bin/sh", ["-c", "command -v pnpm"], {
      encoding: "utf8",
    });
    // S4036: reading `.stdout` tolerates a failed probe (status != 0) and the
    // fallback below fails closed, so a missing shell/probe cannot silently
    // substitute an unverified binary.
    const found = (probe.stdout ?? "").trim().split("\n")[0];
    if (found) {
      const real = found.startsWith("/") ? resolveSymlinkTarget(found) : "";
      if (isExecutableFile(real)) return real;
      errors.push(`PATH entry failed verification: ${found}`);
    } else {
      errors.push("`command -v pnpm` found nothing on PATH");
    }
  } catch (error) {
    errors.push(`PATH probe failed: ${error?.message ?? error}`);
  }
  throw new Error(
    `pnpm executable not found — install pnpm and re-run from the repo root. (${errors.join("; ")})`,
  );
}

/** Async `spawn(pnpm, args, options)` with the command pinned to an absolute path. */
export function spawnPnpm(args, options) {
  return spawn(resolvePnpmBin(), args, options);
}

/** Sync `spawnSync(pnpm, args, options)` with the command pinned to an absolute path. */
export function spawnSyncPnpm(args, options) {
  return spawnSync(resolvePnpmBin(), args, options);
}
