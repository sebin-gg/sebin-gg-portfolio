import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogPostBody, renderInlineText } from "@/components/blog-post-body";

describe("renderInlineText", () => {
  it("passes plain text through unchanged", () => {
    const { container } = render(<span>{renderInlineText("just words")}</span>);
    expect(container).toHaveTextContent("just words");
    expect(container.querySelectorAll("a,strong")).toHaveLength(0);
  });

  it("renders markdown links as noopener anchors", () => {
    render(<span>{renderInlineText("see [the post](https://example.com/p) here")}</span>);
    const link = screen.getByRole("link", { name: "the post" });
    expect(link).toHaveAttribute("href", "https://example.com/p");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders bold spans and keeps surrounding text", () => {
    const { container } = render(<span>{renderInlineText("a **bold** move")}</span>);
    expect(container).toHaveTextContent("a bold move");
    expect(container.querySelector("strong")).toHaveTextContent("bold");
  });
});

describe("BlogPostBody", () => {
  it("renders paragraphs, headings and lists in order", () => {
    render(
      <BlogPostBody
        blocks={[
          { kind: "p", text: "intro" },
          { kind: "h2", text: "mid" },
          { kind: "list", items: ["one", "two"] },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "mid" })).toBeInTheDocument();
    expect(screen.getByText("intro")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
