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

  it("the fade travels far enough to be visible", () => {
    const fade = css.match(/@keyframes section-fade\s*\{[\s\S]*?\}\s*\}/)?.[0] ?? "";
    expect(fade).toContain("translateY(24px)");
  });
});

describe("?motion=on load-in cue", () => {
  it("plays a one-shot page-enter animation on #main", () => {
    expect(css).toContain("@keyframes page-enter");
    expect(css).toMatch(/html\[data-motion="on"\] #main\s*\{[^}]*animation: page-enter/);
  });

  it("needs no scroll-driven timeline so it works without view() support", () => {
    const rule = css.match(/html\[data-motion="on"\] #main\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).not.toContain("animation-timeline");
  });
});
