import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { links, profile, siteMeta, siteUrl } from "@/lib/site";
import { ThemeInit } from "@/components/theme-init";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // The mono family styles small captions/prompts below the hero headline.
  // Skipping its preload lets the sans family (the LCP text) win bandwidth
  // on slow connections; mono then swaps in when ready.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMeta.title,
    template: `%s · ${profile.name}`,
  },
  description: siteMeta.description,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: [
    "Sebin Mathew",
    "full-stack developer",
    "cybersecurity",
    "React",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteMeta.title,
    description: siteMeta.description,
    siteName: `${profile.name} — portfolio`,
  },
  twitter: {
    card: "summary",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e0c" },
  ],
  colorScheme: "light dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: "Computer Science Student & Developer",
  alumniOf: profile.college,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kottayam",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  sameAs: [links.github.href, links.linkedin.href, links.x.href],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInit />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-canvas text-ink flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="focus:bg-accent focus:text-accent-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
