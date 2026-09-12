import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopNav } from "@/components/desktop-nav";
import { resolveNavigation } from "@/lib/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

describe("DesktopNav", () => {
  it("renders desktop navigation with active state on /blog", () => {
    const dict = getDictionary("en");
    const items = resolveNavigation("/blog");
    render(<DesktopNav items={items} ariaLabel={dict.nav.primary} />);
    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink).toHaveAttribute("aria-current", "page");
    expect(blogLink).toHaveClass("text-accent");
    const expLink = screen.getByRole("link", { name: "Experience" });
    expect(expLink).toHaveAttribute("href", "/#experience");
    expect(expLink).not.toHaveAttribute("aria-current");
  });

  it("keeps hash anchors in-page on a home route", () => {
    const dict = getDictionary("en");
    const items = resolveNavigation("/");
    render(<DesktopNav items={items} ariaLabel={dict.nav.primary} />);
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "#experience");
    expect(screen.queryByRole("link", { name: "Blog" })).not.toHaveAttribute("aria-current");
  });
});
