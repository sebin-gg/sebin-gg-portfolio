import { existsSync, readFileSync } from "node:fs";

/**
 * Resolve an executable Chrome-family binary from candidate paths.
 *
 * Env overrides (CHROME_PATH / THORIUM_PATH) on some machines point at a
 * `.bat`/`.cmd` wrapper — puppeteer spawns without a shell, and Node refuses
 * to spawn batch files directly (spawn EINVAL). When a candidate is a shell
 * wrapper, extract the real executable path it launches so the same env var
 * works for puppeteer and for direct spawns.
 *
 * Returns the first candidate that is a real (non-wrapper) executable file,
 * else the unwrapped target of the first resolvable wrapper, else "".
 */
export function resolveBrowserBinary(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const unwrapped = unwrapShellWrapper(candidate);
    if (unwrapped && existsSync(unwrapped)) return unwrapped;
    if (!unwrapped && existsSync(candidate)) return candidate;
  }
  return "";
}

/** Path of the executable a one-line .bat/.cmd wrapper launches, else "". */
function unwrapShellWrapper(path) {
  if (!/\.(bat|cmd)$/i.test(path) || !existsSync(path)) return "";
  try {
    for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      // Skip comments first (@REM …). The launch line itself may carry
      // --user-data-dir (profile-dir boilerplate) but still names the exe.
      if (/^@?rem\b/i.test(line)) continue;
      const quoted = line.match(/"([^"]+\.(?:exe|js|cmd|bat))"/i);
      if (quoted) return quoted[1];
      const bare = line.match(/^@?"?([^"\s]+\.(?:exe|js))"?(?:\s|$)/i);
      if (bare) return bare[1];
    }
  } catch {
    return "";
  }
  return "";
}
