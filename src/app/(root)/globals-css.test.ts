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
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*animation-duration: 0\.01ms !important/,
    );
  });
});
