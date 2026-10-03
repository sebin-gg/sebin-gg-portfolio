import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";

describe("blog catalogue", () => {
  it("stays sorted newest-first when posts ship", () => {
    const dates = blogPosts.map((post) => post.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});
