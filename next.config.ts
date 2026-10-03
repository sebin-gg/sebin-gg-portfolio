import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Inline the (small, Tailwind-generated) CSS into <head> so first paint
    // doesn't wait an extra round-trip for the stylesheet — the biggest win on
    // 2G/3G first visits. CSS is only ~8 KB gzipped, so the caching trade-off
    // is acceptable for a portfolio whose visitors are mostly first-timers.
    inlineCss: true,
    // The app has two root layouts — (root) for English and [locale] for
    // hi/ml — so Next cannot compose a global 404 from a single root layout.
    // globalNotFound hands unmatched URLs (and notFound() bubbles that reach
    // the root, e.g. invalid locale segments) to app/global-not-found.tsx,
    // which ships its own full HTML document.
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
