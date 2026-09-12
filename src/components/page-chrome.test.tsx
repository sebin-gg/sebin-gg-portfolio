import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageChrome } from "@/components/page-chrome";

describe("PageChrome", () => {
  it("composes skip link, header, main and footer in English", () => {
    render(
      <PageChrome locale="en" currentPath="/blog" skipLabel="Skip to content">
        <p>page body</p>
      </PageChrome>,
    );
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("page body")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("marks every translated region with the locale lang", () => {
    render(
      <PageChrome locale="hi" currentPath="/" skipLabel="skip">
        <p>body</p>
      </PageChrome>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("lang", "hi");
    expect(main).toHaveAttribute("id", "main");
    expect(screen.getByRole("link", { name: "skip" })).toHaveAttribute("lang", "hi");
    expect(screen.getByRole("banner")).toHaveAttribute("lang", "hi");
    expect(screen.getByRole("contentinfo")).toHaveAttribute("lang", "hi");
  });
});
