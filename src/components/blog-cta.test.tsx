import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCta } from "@/components/blog-cta";

describe("BlogCta", () => {
  it("links to the blog route with a coming-soon pill", () => {
    render(<BlogCta />);
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notes & write-ups" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see what.s planned/i })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});
