import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { links, profile, siteUrl } from "@/lib/site";
import { hreflangAlternates, localePath, type Locale } from "@/lib/locale";
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
      siteName: `${profile.name} — portfolio`,
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      creator: links.x.handle,
      images: [`${siteUrl}/opengraph-image`],
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

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
      "@id": `${siteUrl}${localePath("{locale}", "/")}#website`,
      url: `${siteUrl}${localePath("{locale}", "/")}`,
      name: `${profile.name} — Portfolio`,
      description: "locale-meta-description",
      inLanguage: "{locale}",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}${localePath("{locale}", "/")}#profilepage`,
      url: `${siteUrl}${localePath("{locale}", "/")}`,
      name: "locale-meta-title",
      isPartOf: { "@id": `${siteUrl}${localePath("{locale}", "/")}#website` },
      about: { "@id": `${siteUrl}${localePath("{locale}", "/")}#person` },
      mainEntity: { "@id": `${siteUrl}${localePath("{locale}", "/")}#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}${localePath("{locale}", "/")}#person`,
      name: profile.name,
      givenName: profile.firstName,
      url: `${siteUrl}${localePath("{locale}", "/")}`,
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

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = await requireLocaleParam(params);
  const dict = getDictionary(locale);

  const localizedJsonLd = JSON.stringify(jsonLdData)
    .replace(/"\{locale\}"/g, `"${locale}"`)
    .replace(/"locale-meta-title"/g, `"${dict.meta.title}"`)
    .replace(/"locale-meta-description"/g, `"${dict.meta.description}"`);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="llms.txt" href="/llms.txt" />
        <ThemeInit />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localizedJsonLd }} />
      </head>
      <body className="bg-canvas text-ink flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
