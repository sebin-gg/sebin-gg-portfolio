import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_DARK_CLASS } from "@/lib/theme";

function htmlElement() {
  return document.documentElement;
}

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    localStorage.clear();
  });

  it("renders with a switch-to-dark label when the page is light", () => {
    htmlElement().classList.remove(THEME_DARK_CLASS);
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  });

  it("adds the dark class and stores the choice when clicked", () => {
    htmlElement().classList.remove(THEME_DARK_CLASS);
    localStorage.clear();
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(htmlElement().classList.contains(THEME_DARK_CLASS)).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("removes the dark class and stores light when clicked again", () => {
    htmlElement().classList.add(THEME_DARK_CLASS);
    localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    fireEvent.click(button);
    expect(htmlElement().classList.contains(THEME_DARK_CLASS)).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
