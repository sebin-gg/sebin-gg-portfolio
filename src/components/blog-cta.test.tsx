import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCta } from "@/components/blog-cta";

describe("BlogCta", () => {
  it("links to the blog route with a new-post pill", () => {
    render(<BlogCta />);
    expect(screen.getByText("New post")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notes & write-ups" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the first post/i })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});
