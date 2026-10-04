import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SCRIPTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../scripts");
const HELPER = join(SCRIPTS_DIR, "lib", "launch-pnpm.mjs");

function getInvocation(target: string | { command: string; prefixArgs?: string[] }) {
  if (typeof target === "string") return { command: target, args: [] };
  return { command: target.command, args: target.prefixArgs ?? [] };
}

/**
 * S4036 contract: script-launched package-manager commands must never be
 * resolved through PATH. The helper returns an absolute, verified executable,
 * and every script spawn site consults the helper instead of naming `pnpm`.
 */
describe("scripts/lib/launch-pnpm.mjs", () => {
  it("resolves an absolute executable target (never a bare command name)", async () => {
    const mod = await import(HELPER);
    const { command } = getInvocation(mod.resolvePnpmBin());
    expect(command).not.toBe("pnpm");
    expect(isAbsolute(command)).toBe(true);
  });

  it("the resolved target actually executes (exit 0 on --version)", async () => {
    const mod = await import(HELPER);
    const { command, args } = getInvocation(mod.resolvePnpmBin());
    const result = spawnSync(command, [...args, "--version"], {
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
  }, 30_000);

  it("resolves pnpm's versioned Windows command-shim target", async () => {
    const { resolveWindowsShimTarget } = await import(HELPER);
    const shim = "C:\\actions\\setup-pnpm\\node_modules\\.bin\\pnpm.CMD";
    const actual = resolveWindowsShimTarget(
      shim,
      '@ECHO off\r\n"%dp0%\\..\\pnpm\\bin\\pnpm.mjs" %*\r\n',
    );
    expect(actual).toBe("C:\\actions\\setup-pnpm\\node_modules\\pnpm\\bin\\pnpm.mjs");
  });

  it("skips the extensionless sh shim that cmd's where lists first", async () => {
    const { windowsCandidate } = await import(HELPER);
    // Real `where pnpm` output on a Windows runner: the POSIX `sh` script is
    // listed before the .CMD wrapper, and Node cannot exec either the bare
    // script or a .CMD directly.
    const whereOutput = [
      "C:\\Users\\runneradmin\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm",
      "C:\\Users\\runneradmin\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm.cmd",
      "C:\\Users\\runneradmin\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm.ps1",
    ];
    expect(windowsCandidate(whereOutput)).toBe(whereOutput[1]);
    expect(windowsCandidate(["C:\\tools\\pnpm\\pnpm.exe"])).toBe("C:\\tools\\pnpm\\pnpm.exe");
    expect(windowsCandidate(whereOutput.slice(0, 1))).toBe("");
  });

  it("throws a clear error before spawning when no pnpm entrypoint resolves", async () => {
    // Empty PATH + no corepack/user-agent env leaves nothing verifiable.
    const oldPath = process.env.PATH;
    const oldUa = process.env.npm_config_user_agent;
    const oldCorepack = process.env.COREPACK_ROOT;
    try {
      process.env.PATH = "/nonexistent-launch-pnpm-probe";
      delete process.env.npm_config_user_agent;
      delete process.env.COREPACK_ROOT;
      const { resolvePnpmBin } = await import(HELPER);
      expect(() => resolvePnpmBin()).toThrow(/pnpm executable not found/);
    } finally {
      process.env.PATH = oldPath;
      if (oldUa === undefined) delete process.env.npm_config_user_agent;
      else process.env.npm_config_user_agent = oldUa;
      if (oldCorepack === undefined) delete process.env.COREPACK_ROOT;
      else process.env.COREPACK_ROOT = oldCorepack;
    }
  });

  it("every flagged spawn site goes through the helper (no bare pnpm, no shell:true)", () => {
    const sites = [
      "firefox-check.mjs",
      "safari-check.mjs",
      "visual-check.mjs",
      "lib/browser-check.mjs",
      "perf-lighthouse-matrix.mjs",
      "perf-matrix-test.mjs",
    ];
    for (const site of sites) {
      const src = readFileSync(join(SCRIPTS_DIR, site), "utf8");
      expect(src, site).not.toMatch(/spawnSync?\s*\(\s*["']pnpm["']/);
      expect(src, site).not.toMatch(/shell\s*:\s*true/);
      expect(src, site).toMatch(/spawn(Sync)?Pnpm\s*\(/);
    }
  });
});
