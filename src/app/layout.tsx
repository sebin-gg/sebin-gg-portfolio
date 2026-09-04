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
    "Sebin Mathew Portfolio",
    "full-stack developer",
    "full stack engineer",
    "cybersecurity",
    "cybersecurity student Kerala",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "FastAPI",
    "Python backend",
    "College of Engineering Chengannur",
    "portfolio",
    "web performance",
    "static site",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: siteMeta.title,
    description: siteMeta.description,
    siteName: `${profile.name} — portfolio`,
  },
  twitter: {
    card: "summary",
    title: siteMeta.title,
    description: siteMeta.description,
    creator: links.x.handle,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
  colorScheme: "light dark",
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: `${profile.name} — Portfolio`,
      description: siteMeta.description,
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: siteMeta.title,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      givenName: profile.firstName,
      url: siteUrl,
      jobTitle: "Computer Science Student & Full-Stack Developer",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: profile.college,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kottayam",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      sameAs: [links.github.href, links.linkedin.href, links.x.href],
      knowsAbout: [
        "Computer Science",
        "Full-Stack Development",
        "Cybersecurity",
        "Next.js",
        "TypeScript",
        "FastAPI",
        "Python",
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="llms.txt" href="/llms.txt" />
        <ThemeInit />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
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
