import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const dict = getDictionary("en");
  return (
    <>
      <a
        href="#main"
        className="focus:bg-accent focus:text-accent-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {dict.common.skipToContent}
      </a>
      {/* currentPath is a non-home route so the brand link and section
          anchors target the home page, not this anchor-less document. */}
      <SiteHeader locale="en" currentPath="/404" />
      <main id="main" className="flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8 2xl:max-w-[90rem]">
          <p className="text-accent text-7xl font-extrabold tracking-tight sm:text-8xl">404</p>
          <h1 className="text-ink mt-4 text-xl font-semibold">That page doesn&rsquo;t exist</h1>
          <p className="text-ink-soft mt-2 max-w-md">
            The link is broken, or the page moved. Either way, the exit is back to home.
          </p>
          <Link
            href="/"
            className="bg-accent text-accent-ink hover:bg-accent-strong mt-8 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
