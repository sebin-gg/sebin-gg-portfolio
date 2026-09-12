import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { OfflineBanner } from "@/components/offline-banner";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** jsdom's navigator.onLine never changes on its own; drive it per test. */
function setOnline(value: boolean): void {
  vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(value);
}

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe("OfflineBanner", () => {
  it("renders nothing while the browser is online", () => {
    setOnline(true);
    render(<OfflineBanner locale="en" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("appears with localized copy when the connection drops", () => {
    setOnline(true);
    render(<OfflineBanner locale="en" />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    setOnline(false);
    fireEvent(window, new Event("offline"));
    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent(getDictionary("en").offline.message);
    expect(banner).toHaveTextContent(getDictionary("en").offline.retryHint);
  });

  it("hides again when the connection returns", () => {
    setOnline(false);
    render(<OfflineBanner locale="en" />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    setOnline(true);
    fireEvent(window, new Event("online"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("localizes for a non-default locale", () => {
    setOnline(false);
    render(<OfflineBanner locale="ta" />);
    expect(screen.getByRole("status")).toHaveTextContent(getDictionary("ta").offline.message);
  });
});
