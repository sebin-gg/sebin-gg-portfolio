import { DEFAULT_LOCALE, TEXT_DIRECTION, type Locale } from "@/lib/locale";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Composes the localized chrome around page content. Every page declares its
 * own canonical path so the language switcher can link the same page in each
 * locale — resolved at build time, zero client JS.
 */
export function PageChrome({
  locale = DEFAULT_LOCALE,
  currentPath,
  skipLabel,
  children,
}: {
  locale?: Locale;
  currentPath: string;
  skipLabel: string;
  children: React.ReactNode;
}) {
  const isDefault = locale === DEFAULT_LOCALE;
  return (
    <>
      <a
        href="#main"
        className="focus:bg-accent focus:text-accent-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        {skipLabel}
      </a>
      <SiteHeader locale={locale} currentPath={currentPath} />
      <main
        id="main"
        lang={isDefault ? undefined : locale}
        dir={TEXT_DIRECTION[locale]}
        className="flex-1"
      >
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
