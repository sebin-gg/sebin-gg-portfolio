import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ThemeInit } from "@/components/theme-init";
import { themeInitScriptSource } from "@/lib/theme";

describe("ThemeInit", () => {
  it("injects the theme init script into the head", () => {
    const { container } = render(<ThemeInit />);
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.textContent).toBe(themeInitScriptSource());
  });

  it("toggles the dark class rather than only adding it", () => {
    // A light-mode device must be able to turn the class *off*; an unconditional
    // add would pin every first-time visitor to dark.
    const source = themeInitScriptSource();
    expect(source).toContain("classList.toggle");
    expect(source).not.toContain('classList.add("dark")');
  });
});
