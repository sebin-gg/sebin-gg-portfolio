import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ThemeInit } from "@/components/theme-init";
import { themeInitScriptSource } from "@/lib/theme";

describe("ThemeInit", () => {
  it("injects the theme init script into the head", () => {
    const { container } = render(<ThemeInit />);
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('document.documentElement.classList.add("dark")');
    expect(script?.textContent).toBe(themeInitScriptSource());
  });
});
