import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Clarity from "@microsoft/clarity";
import { ClarityLoader } from "@/components/clarity";

vi.mock("@microsoft/clarity", () => ({
  default: { init: vi.fn() },
}));

describe("ClarityLoader", () => {
  it("initializes Clarity once on mount and renders nothing", () => {
    const { container } = render(<ClarityLoader />);
    expect(container).toBeEmptyDOMElement();
    expect(vi.mocked(Clarity.init)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Clarity.init)).toHaveBeenCalledWith("zas9c0vkoo");
  });
});
