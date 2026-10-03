import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/blog";

describe("blog catalogue", () => {
  it("stays sorted newest-first when posts ship", () => {
    // Compare parsed instants, not raw strings: ISO timestamps carrying
    // different UTC offsets sort incorrectly as text
    // (`2026-02-01T00:30:00+02:00` precedes `2026-01-31T23:00:00Z`
    // chronologically but sorts after it lexically). The RSS route parses every
    // `publishedAt`, so a value that is not a date has to fail here too.
    const times = blogPosts.map((post) => {
      const time = Date.parse(post.publishedAt);
      expect(Number.isNaN(time), `publishedAt is not a date: ${post.publishedAt}`).toBe(false);
      return time;
    });
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });
});
