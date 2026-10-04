import { spawnSync, spawn } from "node:child_process";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { resolve, win32 } from "node:path";

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
 *      present) before use. On Windows `where` lists several shim flavours,
 *      so the candidate chosen is the one Node can actually execute.
 *
 * The spawn sites never consult PATH — they execute the absolute verified
 * path this function returns, so a writable PATH entry cannot substitute the
 * package-manager binary. A broken or spoofed entry fails closed with a
 * clear error instead of falling through to a PATH search.
 */

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

export function resolveWindowsShimTarget(shim, contents = readFileSync(shim, "utf8")) {
  // npm's Windows command shim invokes the real entrypoint as the quoted
  // %dp0%-relative argument immediately before %*. Do not assume a sibling
  // .cjs exists: pnpm's shim can point into its versioned global install.
  const invocation = contents
    .split(/\r?\n/)
    .find((line) => line.includes("%*") && /"%dp0%[\\/][^"]+"\s+%\*/i.test(line));
  const match = invocation?.match(/"%dp0%[\\/]([^"]+)"\s+%\*/i);
  if (!match) return "";
  return win32.resolve(win32.dirname(shim), match[1].replaceAll("/", "\\"));
}

function probePATHCandidates() {
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
  return (probe.stdout ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Pick the Windows candidate Node can actually execute. cmd's `where` lists
 * every shim flavour npm's cmd-shim writes — the extensionless POSIX `sh`
 * script, `pnpm.CMD`, and `pnpm.ps1` — and the `sh` script sorts first, so the
 * first line is never the one Node can run. Prefer a real `.exe`, else the
 * `.CMD` wrapper whose fixed entrypoint we can parse and launch through Node.
 */
export function windowsCandidate(candidates) {
  return (
    candidates.find((c) => /\.exe$/i.test(c)) ?? candidates.find((c) => /\.cmd$/i.test(c)) ?? ""
  );
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
    if (commandExists(entry)) {
      return isWindows ? { command: process.execPath, prefixArgs: [entry] } : entry;
    }
    errors.push(`corepack entry missing: ${entry}`);
  }
  try {
    const candidates = probePATHCandidates();
    if (isWindows) {
      // cmd's `where` prints every shim flavour, not the executable one.
      // Resolve the wrapper's fixed entrypoint and launch JS with Node
      // directly so spawn never needs shell:true.
      const found = windowsCandidate(candidates);
      const target = /\.exe$/i.test(found) ? found : resolveWindowsShimTarget(found);
      if (win32.isAbsolute(target) && commandExists(target)) {
        if (/\.(?:c|m)?js$/i.test(target)) {
          return { command: process.execPath, prefixArgs: [target] };
        }
        if (/\.exe$/i.test(target)) return target;
      }
      errors.push(`PATH entry failed verification: ${found || candidates.join(", ") || "none"}`);
    } else {
      const found = candidates[0] ?? "";
      const absolute = found.startsWith("/") ? resolveSymlinkTarget(found) : "";
      if (absolute && commandExists(absolute)) return absolute;
      errors.push(`PATH entry failed verification: ${found || "none"}`);
    }
  } catch (error) {
    errors.push(`PATH probe failed: ${error?.message ?? error}`);
  }
  throw new Error(
    `pnpm executable not found — install pnpm and re-run from the repo root. (${errors.join("; ")})`,
  );
}

/**
 * Split the resolved target into an executable plus fixed prefix args so
 * both platforms share one call shape: string on POSIX, { command,
 * prefixArgs } on Windows where Node itself must launch the verified pnpm JS entrypoint.
 */
function invocation(target) {
  if (typeof target === "string") return { command: target, prefixArgs: [] };
  return target;
}

/** Async `spawn(pnpm, args, options)` with the command pinned to an absolute path. */
export function spawnPnpm(args, options) {
  const { command, prefixArgs } = invocation(resolvePnpmBin());
  return spawn(command, [...prefixArgs, ...args], options);
}

/** Sync `spawnSync(pnpm, args, options)` with the command pinned to an absolute path. */
export function spawnSyncPnpm(args, options) {
  const { command, prefixArgs } = invocation(resolvePnpmBin());
  return spawnSync(command, [...prefixArgs, ...args], options);
}
