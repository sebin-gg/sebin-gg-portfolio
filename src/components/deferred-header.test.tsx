import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import {
  DeferredActiveSection,
  DeferredMobileNav,
  DeferredThemeToggle,
} from "@/components/deferred-header";
import { resolveNavigation } from "@/lib/navigation";
import { THEME_DARK_CLASS } from "@/lib/theme";

vi.mock("@/components/active-section", () => ({
  ActiveSection: () => <div data-testid="spy-observer" />,
}));

describe("deferred header widgets", () => {
  afterEach(() => {
    document.documentElement.classList.remove(THEME_DARK_CLASS);
    vi.useRealTimers();
  });

  it("keeps the theme toggle a non-interactive placeholder until idle", async () => {
    // The site defaults to dark (class applied by the inline init script).
    document.documentElement.classList.add(THEME_DARK_CLASS);
    vi.useFakeTimers();
    render(
      <DeferredThemeToggle lightLabel="Switch to light mode" darkLabel="Switch to dark mode" />,
    );
    // Before idle there is no button yet — only the same-size placeholder.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();

    expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("keeps the mobile menu button as a placeholder until idle", async () => {
    vi.useFakeTimers();
    render(
      <DeferredMobileNav
        items={resolveNavigation("/")}
        mobileLabel="Mobile"
        openLabel="Open menu"
        closeLabel="Close menu"
        resumeLabel="Résumé"
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();

    expect(await screen.findByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("mounts the active-section spy only after idle", async () => {
    vi.useFakeTimers();
    render(<DeferredActiveSection ids={["about"]} />);
    expect(screen.queryByTestId("spy-observer")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    vi.useRealTimers();

    expect(await screen.findByTestId("spy-observer")).toBeInTheDocument();
  });
});
