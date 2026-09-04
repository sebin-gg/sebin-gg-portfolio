import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopNav } from "@/components/desktop-nav";
import { BrandLink } from "@/components/brand-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
}));

describe("DesktopNav & BrandLink", () => {
  it("renders desktop navigation with active state on /blog", () => {
    render(<DesktopNav />);
    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink).toHaveAttribute("aria-current", "page");
    expect(blogLink).toHaveClass("text-accent");
    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/#about");
    expect(aboutLink).not.toHaveAttribute("aria-current");
  });

  it("renders brand logo linking to home root when on /blog", () => {
    render(<BrandLink />);
    const brand = screen.getByRole("link", { name: /sebin mathew/i });
    expect(brand).toHaveAttribute("href", "/");
  });
});
