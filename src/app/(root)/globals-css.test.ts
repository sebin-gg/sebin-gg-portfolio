import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(import.meta.dirname, "globals.css"), "utf8");

describe("section fade-up animation", () => {
  it("runs only inside a view() support check and a no-preference media query", () => {
    const guard =
      /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*@supports \(animation-timeline: view\(\)\)\s*\{([^}]|\}(?!\s*\}))*\}/;
    expect(css).toMatch(guard);
    const block = css.match(guard)?.[0] ?? "";
    expect(block).toContain("section-fade");
    expect(block).toContain("animation-timeline: view()");
  });

  it("is collapsed by the global reduced-motion rule", () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*animation: none !important/);
  });

  it("the ?motion=off override kills animation the same way", () => {
    expect(css).toMatch(/html\[data-motion="off"\][\s\S]*?animation: none !important/);
  });

  it("the OS reduce block escapes an explicit ?motion=on override", () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*html:not\(\[data-motion="on"\]\)/);
  });
});
