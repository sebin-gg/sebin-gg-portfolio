import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "@/components/section-heading";

describe("SectionHeading", () => {
  it("renders title without a lede", () => {
    render(<SectionHeading id="x-title" title="Toolbox" />);
    expect(screen.getByRole("heading", { name: "Toolbox" })).toBeInTheDocument();
    expect(screen.queryByText("Some description.")).not.toBeInTheDocument();
  });

  it("renders the lede when provided", () => {
    render(<SectionHeading id="y-title" title="Notes" lede="Some description." />);
    expect(screen.getByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(screen.getByText("Some description.")).toBeInTheDocument();
  });
});
