import { describe, expect, it } from "vitest";
import OpengraphImage, { alt, contentType, size } from "@/app/opengraph-image";

describe("opengraph-image", () => {
  it("exports LinkedIn-ready metadata (1200x630 png with alt)", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toMatch(/Sebin Mathew/);
  });

  it("renders a png response", async () => {
    const res = await OpengraphImage();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("image/png");
  });
});
