import { describe, expect, it } from "vitest";
import { assertBlogSlugs, blogPosts, findPost } from "./blog";

describe("blog catalogue", () => {
  it("ships unique URL-safe slugs", () => {
    expect(() => assertBlogSlugs(blogPosts)).not.toThrow();
  });

  it("rejects slugs that are not single path segments", () => {
    for (const slug of ["a/b", "a?b", "a#b", "Has Caps", "under_score"]) {
      expect(() => assertBlogSlugs([{ slug }])).toThrow(/URL-safe/);
    }
  });

  it("rejects duplicate slugs", () => {
    expect(() => assertBlogSlugs([{ slug: "same" }, { slug: "same" }])).toThrow(/Duplicate/);
  });

  it("findPost resolves shipped slugs and misses unknown ones", () => {
    const post = findPost("slowlang-a-language-that-punishes-fast-typing");
    expect(post?.title).toMatch(/typing too fast/);
    expect(post?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(findPost("no-such-post")).toBeUndefined();
  });
});
