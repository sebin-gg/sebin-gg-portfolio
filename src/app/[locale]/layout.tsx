import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { links, profile, siteUrl } from "@/lib/site";
import { hreflangAlternates, localePath, SUPPORTED_LOCALES } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireLocaleParam } from "@/app/[locale]/locale-params";
import { ThemeInit } from "@/components/theme-init";
import "../(root)/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { locale: string }[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${siteUrl}${localePath(locale, "/")}`,
      languages: hreflangAlternates("/", siteUrl),
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}${localePath(locale, "/")}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: dict.meta.title,
      locale: locale,
      images: [
        {
          url: "/og-image",
          width: 1200,
          height: 630,
          // The PNG is one shared asset, so its pixels stay English. The alt
          // is the string screen readers and link previews announce, so it
          // uses the localized title instead of an English "portfolio".
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      creator: links.x.handle,
      images: [`${siteUrl}/og-image`],
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
  colorScheme: "light dark",
};

type JsonLdPrimitive = string | number | boolean | null;
interface JsonLdValue {
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[] | JsonLdValue | JsonLdValue[];
}

function buildJsonLd(locale: string, title: string, description: string): JsonLdValue {
  const pageUrl = `${siteUrl}${localePath(locale, "/")}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        url: pageUrl,
        name: `${profile.name} — Portfolio`,
        description,
        inLanguage: locale,
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: title,
        isPartOf: { "@id": `${pageUrl}#website` },
        about: { "@id": `${pageUrl}#person` },
        mainEntity: { "@id": `${pageUrl}#person` },
      },
      {
        "@type": "Person",
        "@id": `${pageUrl}#person`,
        name: profile.name,
        givenName: profile.firstName,
        url: pageUrl,
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
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);

  const jsonLd = buildJsonLd(locale, dict.meta.title, dict.meta.description);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="llms.txt" href="/llms.txt" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${profile.name} — blog`}
          href="/rss.xml"
        />
        <ThemeInit />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-canvas text-ink flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
