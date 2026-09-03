import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow, SectionHeading } from "@/components/section-heading";

describe("Eyebrow", () => {
  it("renders the label with a decorative dot", () => {
    render(<Eyebrow>About</Eyebrow>);
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});

describe("SectionHeading", () => {
  it("renders title and kicker without a lede", () => {
    render(<SectionHeading id="x-title" kicker="Skills" title="Toolbox" />);
    expect(screen.getByRole("heading", { name: "Toolbox" })).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.queryByText("Some description.")).not.toBeInTheDocument();
  });

  it("renders the lede when provided", () => {
    render(<SectionHeading id="y-title" kicker="Blog" title="Notes" lede="Some description." />);
    expect(screen.getByRole("heading", { name: "Notes" })).toBeInTheDocument();
    expect(screen.getByText("Some description.")).toBeInTheDocument();
  });
});
