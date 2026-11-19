import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Experience } from "@/components/experience";

describe("Experience", () => {
  it("links FOCES to the executive committee", () => {
    render(<Experience />);

    expect(screen.getByRole("link", { name: "FOCES CEC" })).toHaveAttribute(
      "href",
      "https://foces.ceconline.edu/#execom",
    );
    expect(screen.getByRole("link", { name: "FOCES CEC" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "FOCES CEC" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
