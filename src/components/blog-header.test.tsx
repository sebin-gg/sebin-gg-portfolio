import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogHeader } from "@/components/blog-header";
import { getDictionary } from "@/lib/i18n/dictionaries";

describe("BlogHeader", () => {
  it("renders the English title and lede by default", () => {
    const dict = getDictionary("en");
    render(<BlogHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dict.blog.title);
    expect(screen.getByText(dict.blog.lede)).toBeInTheDocument();
  });

  it("renders the translated title and lede for another locale", () => {
    const dict = getDictionary("es");
    render(<BlogHeader locale="es" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dict.blog.title);
    expect(screen.getByText(dict.blog.lede)).toBeInTheDocument();
  });
});
