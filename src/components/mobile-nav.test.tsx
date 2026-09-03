import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MobileNav } from "@/components/mobile-nav";

describe("MobileNav", () => {
  it("starts closed with an expanded=false toggle", () => {
    render(<MobileNav />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("opens the panel and exposes the résumé action", () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const nav = screen.getByRole("navigation", { name: "Mobile" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /résumé/i })).toHaveAttribute("href", "/resume.pdf");
  });

  it("closes when the close button is clicked", () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("closes when a navigation link is clicked", () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
