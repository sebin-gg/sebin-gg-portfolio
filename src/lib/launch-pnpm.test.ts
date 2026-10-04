import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
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
  it("resolves an absolute executable path (never a bare command name)", async () => {
    const { resolvePnpmBin } = await import(HELPER);
    const bin = resolvePnpmBin();
    expect(bin).not.toBe("pnpm");
    expect(bin.endsWith("pnpm.mjs") || bin.endsWith("pnpm.js") || bin.endsWith("pnpm")).toBe(true);
    if (process.platform !== "win32") expect(bin.startsWith("/")).toBe(true);
  });

  it("the resolved entrypoint actually executes (exit 0 on --version)", async () => {
    const { resolvePnpmBin } = await import(HELPER);
    const result = spawnSync(resolvePnpmBin(), ["--version"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
  }, 30_000);

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
