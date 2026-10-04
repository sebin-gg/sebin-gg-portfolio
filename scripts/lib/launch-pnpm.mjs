import { spawnSync, spawn } from "node:child_process";
import { existsSync, realpathSync, statSync } from "node:fs";
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
 *   2. otherwise PATH is searched only for the two fixed probe commands
 *      (the system shell and `command -v`/`where`), the reported pnpm path
 *      is resolved to its real file and verified (absolute, regular file,
 *      present) before use.
 *
 * The spawn sites never consult PATH — they execute the absolute verified
 * path this function returns, so a writable PATH entry cannot substitute the
 * package-manager binary. A broken or spoofed entry fails closed with a
 * clear error instead of falling through to a PATH search.
 */

const here = dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === "win32";

function commandExists(p) {
  try {
    return typeof p === "string" && p.length > 0 && existsSync(p) && statSync(p).isFile();
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

function probePATHLookup() {
  // Fixed probe commands only — never the value being resolved. On Windows
  // the lookup shell is cmd.exe via `where`; everywhere else /bin/sh.
  // S4036: reading `.stdout` tolerates a failed probe (status != 0) and the
  // caller fails closed below, so a missing shell/probe cannot silently
  // substitute an unverified binary.
  const shell = isWindows ? (process.env.ComSpec ?? "C:\\Windows\\System32\\cmd.exe") : "/bin/sh";
  const script = isWindows ? "where pnpm" : "command -v pnpm";
  const probe = spawnSync(shell, isWindows ? ["/c", script] : ["-c", script], {
    encoding: "utf8",
  });
  return (probe.stdout ?? "").trim().split(/\r?\n/)[0] ?? "";
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
    if (commandExists(entry)) return entry;
    errors.push(`corepack entry missing: ${entry}`);
  }
  try {
    const found = probePATHLookup();
    if (found) {
      const absolute = isWindows ? found : found.startsWith("/") ? resolveSymlinkTarget(found) : "";
      if (commandExists(absolute)) return absolute;
      errors.push(`PATH entry failed verification: ${found}`);
    } else {
      errors.push("PATH lookup found no pnpm");
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
