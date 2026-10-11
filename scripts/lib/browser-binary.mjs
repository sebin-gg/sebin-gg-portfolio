import { existsSync, readFileSync } from "node:fs"; // skipcq: JS-0833 — ESM parsed with sourceType: script
import { dirname, isAbsolute, join, resolve } from "node:path";

/**
 * Resolve an executable Chrome-family binary from candidate paths.
 *
 * Env overrides (CHROME_PATH / THORIUM_PATH) on some machines point at a
 * `.bat`/`.cmd` wrapper — puppeteer spawns without a shell, and Node refuses
 * to spawn batch files directly (spawn EINVAL). When a candidate is a shell
 * wrapper, extract the executable path its launch line names (expanded for
 * batch variables like %LOCALAPPDATA%, and %~dp0 resolved against the
 * wrapper's own directory as cmd would) and recurse, so a wrapper chain
 * resolves down to a real execut­able file.
 *
 * Returns the first candidate that is a real (non-wrapper) executable file,
 * else the fully-unwrapped target of the first resolvable wrapper, else "".
 */
export function resolveBrowserBinary(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (!/\.(bat|cmd)$/i.test(candidate)) {
      if (existsSync(candidate)) return candidate;
      continue;
    }
    if (!existsSync(candidate)) continue;
    const unwrapped = unwrapShellWrapper(candidate);
    if (!unwrapped) continue;
    const resolved = resolveBrowserBinary([unwrapped]);
    if (resolved) return resolved;
  }
  return "";
}

/** cmd's %~dp0 is the drive+path of the batch file being run, without slash. */
const DP0_PREFIX = /^%~dp0/i;

/**
 * The executable a .bat/.cmd wrapper launches, else "".
 *
 * Only whole-line comments (`@REM …`, `:: …`) are ignored; a real launch line
 * may also carry flags such as --user-data-dir without changing its target.
 * Batch variables (`%LOCALAPPDATA%`) expand from the process environment.
 * `%~dp0` is the wrapper's own directory: strip it, then resolve any
 * resulting relative target against `dirname(%~dp0's wrapper)` — which is
 * exactly what cmd does at invocation time.
 */
export function unwrapShellWrapper(path) {
  try {
    for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (/^@?rem\b/i.test(line) || line.startsWith("::")) continue;
      if (line === "" || /^@echo\b/i.test(line)) continue;
      const target =
        line.match(/"([^"]+\.(?:exe|js|cmd|bat))"/i)?.[1] ??
        line.match(/^@?"?([^"\s]+\.(?:exe|js))"?(?:\s|$)/i)?.[1];
      if (!target) continue;
      const expanded = target.replace(/%([^%]+)%/g, (_m, name) => process.env[name] ?? name);
      let absolute = expanded;
      if (DP0_PREFIX.test(expanded)) {
        // %~dp0 carries its own trailing backslash, so join() restores the
        // separator that string concat would double or lose.
        absolute = join(dirname(path), expanded.slice("%~dp0".length));
      } else if (!isAbsolute(absolute)) {
        absolute = resolve(process.cwd(), absolute);
      }
      return absolute;
    }
  } catch {
    return "";
  }
  return "";
}
