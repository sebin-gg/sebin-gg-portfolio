import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { hreflangAlternates } from "@/lib/locale";

type SitemapEntry = MetadataRoute.Sitemap[number];

/** One sitemap row per canonical route, with hreflang alternates for all locales. */
function localizedEntry(
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
): SitemapEntry {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: hreflangAlternates(path, siteUrl),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    localizedEntry("/", "monthly", 1),
    localizedEntry("/blog", "weekly", 0.6),
    localizedEntry("/accessibility", "yearly", 0.4),
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
