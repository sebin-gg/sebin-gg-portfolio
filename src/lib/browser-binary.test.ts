// skipcq: JS-0067 — these are file-scope test declarations, not globals
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
// skipcq: JS-0067
import { resolveBrowserBinary } from "../../scripts/lib/browser-binary.mjs";

// isolating each environment-modifying case from the host, not from env.
const THORIUM_PATH = "THORIUM_PATH";
const savedThorium = process.env[THORIUM_PATH];
afterEach(() => {
  if (savedThorium === undefined) delete process.env[THORIUM_PATH];
  else process.env[THORIUM_PATH] = savedThorium;
});

function tempLayout() {
  const dir = mkdtempSync(join(tmpdir(), "browser-binary-"));
  const exe = join(dir, "Thorium", "Application", "thorium.exe");
  mkdirSync(join(dir, "Thorium", "Application"), { recursive: true });
  writeFileSync(exe, "-- fake --");
  const wrapper = join(dir, "thorium_agent.bat");
  return { dir, wrapper, exe };
}

function launchLine(exe: string): string {
  return (
    "@echo off\r\n" +
    "REM Wrapper script to launch Thorium for automated agents.\r\n" +
    `:: comment using "${exe}" before the real launch\r\n` +
    `REM another "${exe}" mention\r\n` +
    `\r\n` +
    `\r\n` +
    `"${exe}" --user-data-dir="%TEMP%\\thorium_agent_profile" %*\r\n`
  );
}

describe("resolveBrowserBinary", () => {
  it("unwraps a .bat agent wrapper to the real browser exe it launches", () => {
    const { dir, wrapper, exe } = tempLayout();
    try {
      writeFileSync(wrapper, launchLine(exe));
      const resolved = resolveBrowserBinary([process.env[THORIUM_PATH] ?? "", wrapper]);
      expect(resolved.toLowerCase()).toBe(exe.toLowerCase());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("expands %VAR% targets from the process environment", () => {
    const { dir, wrapper } = tempLayout();
    const appDir = join(dir, "AppDir");
    mkdirSync(appDir, { recursive: true });
    writeFileSync(join(appDir, "browser.exe"), "-- fake --");
    try {
      writeFileSync(wrapper, `@echo off\r\n"%MY_BROWSER_DIR%${sep}browser.exe" %*\r\n`);
      process.env.MY_BROWSER_DIR = appDir;
      expect(resolveBrowserBinary([wrapper])).toBe(join(appDir, "browser.exe"));
    } finally {
      delete process.env.MY_BROWSER_DIR;
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("resolves targets relative to the wrapper's own directory (cd-independent)", () => {
    const { dir, exe } = tempLayout();
    try {
      // A wrapper somewhere else that names the exe by its relative location.
      const otherDir = join(dir, "agent");
      mkdirSync(otherDir, { recursive: true });
      // Both platforms' path.join resolve "/" — cmd also accepts it.
      const rel = "../Thorium/Application/thorium.exe";
      writeFileSync(join(otherDir, "wrap.bat"), `@echo off\r\n"%~dp0${rel}" %*\r\n`);
      // %~dp0 expansion is not a plain env var; the relative fallback must
      // still find the exe when the variable name itself is unknown.
      const resolved = resolveBrowserBinary([join(otherDir, "wrap.bat")]);
      expect(resolved.toLowerCase()).toBe(exe.toLowerCase());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("unwraps a nested wrapper chain down to the real executable", () => {
    const { dir, wrapper, exe } = tempLayout();
    try {
      const outer = join(dir, "outer.bat");
      writeFileSync(outer, `@echo off\r\n"${wrapper}" %*\r\n`);
      writeFileSync(wrapper, launchLine(exe));
      expect(resolveBrowserBinary([outer]).toLowerCase()).toBe(exe.toLowerCase());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("prefers the first real executable and skips missing paths", () => {
    const { dir, exe, wrapper } = tempLayout();
    try {
      rmSync(wrapper, { force: true });
      expect(resolveBrowserBinary([join(dir, "missing.exe"), exe])).toBe(exe);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("returns a direct exe candidate unchanged", () => {
    const { dir, exe } = tempLayout();
    try {
      expect(resolveBrowserBinary([exe])).toBe(exe);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails closed when nothing resolvable exists", () => {
    expect(resolveBrowserBinary(["", "/nonexistent/browser.exe", "/nonexistent/wrap.bat"])).toBe(
      "",
    );
  });
});
