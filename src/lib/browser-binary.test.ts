// skipcq: JS-0067 — these are file-scope test declarations, not globals
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// skipcq: JS-0067
import { resolveBrowserBinary } from "../../scripts/lib/browser-binary.mjs";

function tempWrapper(content: string): { dir: string; wrapper: string; exe: string } {
  const dir = mkdtempSync(join(tmpdir(), "browser-binary-"));
  const exeDir = join(dir, "Thorium", "Application");
  mkdirSync(exeDir, { recursive: true });
  const exe = join(exeDir, "thorium.exe");
  writeFileSync(exe, "-- fake --");
  const wrapper = join(dir, "thorium_agent.bat");
  writeFileSync(wrapper, content);
  return { dir, wrapper, exe };
}

describe("resolveBrowserBinary", () => {
  it("unwraps a .bat agent wrapper to the real browser exe it launches", () => {
    const { dir, wrapper, exe } = tempWrapper("@echo off\r\n");
    try {
      // Rebuild the wrapper with the real exe path now that we know it.
      writeFileSync(
        wrapper,
        "@echo off\r\n" +
          "REM Wrapper script to launch Thorium for automated agents.\r\n" +
          "REM Uses a temporary, isolated profile directory.\r\n" +
          `"${exe}" --user-data-dir="%TEMP%\\thorium_agent_profile" %*\r\n`,
      );
      expect(resolveBrowserBinary([process.env.THORIUM_PATH ?? "", wrapper])).toBe(exe);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("prefers the first real executable and skips non-wrapper missing paths", () => {
    const { dir, exe, wrapper } = tempWrapper("@echo off\r\n");
    try {
      // Remove the misleading .bat so the wrapper no longer exists as a file;
      // only the real exe remains, and a missing earlier candidate is skipped.
      const missing = join(dir, "missing.exe");
      rmSync(wrapper);
      expect(resolveBrowserBinary([missing, exe])).toBe(exe);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("returns a direct exe candidate unchanged", () => {
    const { dir, exe } = tempWrapper("@echo off\r\n");
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
