/** Blog post catalogue. Empty until the first post ships — the RSS route
 * and sitemap already read from here, so publishing means appending one entry. */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
};

export const blogPosts: BlogPost[] = [];
