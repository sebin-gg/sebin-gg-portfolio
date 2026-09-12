import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogHeader } from "@/components/blog-header";

describe("BlogHeader", () => {
  it("renders the English title and lede by default", () => {
    render(<BlogHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Notes & write-ups");
    expect(screen.getByText(/Security walkthroughs/)).toBeInTheDocument();
  });

  it("renders the translated title for another locale", () => {
    render(<BlogHeader locale="es" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Notas y artículos");
  });
});
