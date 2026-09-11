import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/language-switcher";

const pathnameMock = vi.fn((): string | null => "/hi/blog");

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

describe("LanguageSwitcher", () => {
  it("marks the current locale and links the same page in the others", () => {
    pathnameMock.mockReturnValue("/hi/blog");
    render(<LanguageSwitcher />);

    expect(screen.getByRole("navigation", { name: "भाषा" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "हिन्दी" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "മലയാളം" })).toHaveAttribute("href", "/ml/blog");
  });

  it("falls back to English labels on the home route", () => {
    pathnameMock.mockReturnValue("/");
    render(<LanguageSwitcher />);

    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "हिन्दी" })).toHaveAttribute("href", "/hi");
  });
});
