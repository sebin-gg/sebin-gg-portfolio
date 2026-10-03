import { blogPosts } from "@/lib/blog";
import { profile, siteMeta, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * `BlogPost.slug` is an arbitrary string, so it has to be escaped as a URL path
 * segment before it reaches `<link>`/`<guid>`; a `<` in a slug would otherwise
 * produce malformed XML. Ordinary slugs round-trip unchanged.
 */
function postUrl(slug: string): string {
  return `${siteUrl}/blog/${encodeURIComponent(slug)}`;
}

/** Fails the build rather than publishing `<pubDate>Invalid Date</pubDate>`. */
function requireRfc822Date(publishedAt: string, slug: string): string {
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`blog post "${slug}" has a publishedAt that is not a date: "${publishedAt}"`);
  }
  return parsed.toUTCString();
}

function buildRss(): string {
  const items = blogPosts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl(post.slug))}</link>
      <guid>${escapeXml(postUrl(post.slug))}</guid>
      <pubDate>${requireRfc822Date(post.publishedAt, post.slug)}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(`${profile.name} — blog`)}</title>\n    <link>${escapeXml(`${siteUrl}/blog`)}</link>\n    <description>${escapeXml(siteMeta.description)}</description>\n    <language>en-us</language>\n${items}\n  </channel>\n</rss>\n`;
}

export function GET() {
  return new Response(buildRss(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
