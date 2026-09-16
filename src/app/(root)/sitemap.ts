import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";

type SitemapEntry = MetadataRoute.Sitemap[number];

const CANONICAL_PATHS = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.4 },
] as const;

/** One sitemap row per canonical route, with hreflang alternates for all locales. */
function localizedEntry(entry: (typeof CANONICAL_PATHS)[number]): SitemapEntry {
  return {
    url: `${siteUrl}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: {
      languages: hreflangAlternates(entry.path, siteUrl),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...CANONICAL_PATHS.map(localizedEntry),
    {
      // llms.txt — machine-readable site summary for AI agents.
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/resume.pdf`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
