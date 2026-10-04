import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SCRIPTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../scripts");
const HELPER = join(SCRIPTS_DIR, "lib", "launch-pnpm.mjs");

/**
 * S4036 contract: script-launched package-manager commands must never be
 * resolved through PATH. The helper returns an absolute, verified executable,
 * and every script spawn site consults the helper instead of naming `pnpm`.
 */
describe("scripts/lib/launch-pnpm.mjs", () => {
  // Both platforms share one call shape: a bare path, or { command, prefixArgs }
  // on Windows where Node itself has to launch the verified pnpm entrypoint.
  function getInvocation(target: string | { command: string; prefixArgs?: string[] }) {
    if (typeof target === "string") return { command: target, args: [] };
    return { command: target.command, args: target.prefixArgs ?? [] };
  }
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

  it("parses the %dp0% entry argument out of a Windows command shim", async () => {
    const { shimTargetFromContents } = await import(HELPER);
    const shim = "C:\\actions\\setup-pnpm\\node_modules\\.bin\\pnpm.CMD";
    const parsed = shimTargetFromContents(
      shim,
      '@ECHO off\r\n"%dp0%\\..\\pnpm\\bin\\pnpm.mjs" %*\r\n',
    );
    // win32 semantics always, so this assertion holds on any dev machine.
    expect(parsed).toBe("C:\\actions\\setup-pnpm\\node_modules\\pnpm\\bin\\pnpm.mjs");
    expect(shimTargetFromContents(shim, "@ECHO off\r\n")).toBe("");
  });

  it("falls back to the installed pnpm package when the shim target is stale", async () => {
    const { resolveWindowsShimTarget: resolveTarget } = await import(HELPER);
    // Reproduce the runner layout: PNPM_HOME/bin/pnpm.CMD whose %dp0% argument
    // points at a path that does not exist, with the real pnpm package living
    // further up the tree. The resolver must find the on-disk entrypoint.
    const root = mkdtempSync(join(tmpdir(), "launch-pnpm-"));
    const binDir = join(root, "node_modules", ".bin", "bin");
    const pkgDir = join(root, "node_modules", "pnpm", "bin");
    try {
      mkdirSync(binDir, { recursive: true });
      mkdirSync(pkgDir, { recursive: true });
      const entry = join(pkgDir, "pnpm.cjs");
      writeFileSync(entry, "// pnpm\n");
      writeFileSync(join(binDir, "pnpm.CMD"), '@ECHO off\r\n"%dp0%\\..\\missing\\pnpm.cjs" %*\r\n');
      const shim = join(binDir, "pnpm.CMD");
      const resolved = resolveTarget(shim);
      expect(resolved).not.toBe("");
      expect(existsSync(resolved)).toBe(true);
      expect(resolved).toContain("pnpm.cjs");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("skips the POSIX sh script that cmd's where lists first", async () => {
    const { windowsCandidate } = await import(HELPER);
    // Real `where pnpm` output on a Windows runner: the POSIX `sh` script is
    // listed before the .CMD wrapper, and Node cannot exec either the bare
    // script or a .CMD directly.
    const whereOutput = [
      "C:\\ci\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm",
      "C:\\ci\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm.cmd",
      "C:\\ci\\setup-pnpm\\node_modules\\.bin\\bin\\pnpm.ps1",
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
