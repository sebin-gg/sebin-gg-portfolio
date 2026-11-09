import { describe, expect, it } from "vitest";
import { clarityInitScriptSource } from "@/lib/clarity";

describe("clarityInitScriptSource", () => {
  it("injects the standard Clarity bootstrap for the project id", () => {
    const script = clarityInitScriptSource();
    expect(script).toContain('document,"clarity","script",');
    expect(script).toContain('"zas9c0vkoo"');
    expect(script).toContain("https://www.clarity.ms/tag/");
    expect(script).toContain("t.async=1");
  });

  it("only records on the production host", () => {
    const script = clarityInitScriptSource();
    expect(script).toContain('window.location.hostname !== "sebin-gg.vercel.app"');
  });
});
