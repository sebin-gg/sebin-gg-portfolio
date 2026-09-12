import { resumeUrl } from "@/lib/site";
import { getSectionIds, isHomeRoute, localizedNavItems, resolveNavigation } from "@/lib/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/locale";
import { DesktopNav } from "@/components/desktop-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  DeferredActiveSection,
  DeferredMobileNav,
  DeferredThemeToggle,
} from "@/components/deferred-header";
import { DownloadIcon } from "@/components/icons";

const sectionIds = getSectionIds();

/** Tablet gets an icon-only résumé button; lg+ gets the labeled one. */
function ResumeActions({
  shortLabel,
  downloadLabel,
}: {
  readonly shortLabel: string;
  readonly downloadLabel: string;
}) {
  return (
    <>
      <a
        href={resumeUrl}
        aria-label={downloadLabel}
        title={downloadLabel}
        className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 hidden h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-all hover:shadow-md md:flex lg:hidden"
      >
        <DownloadIcon className="h-4 w-4" />
      </a>
      <a
        href={resumeUrl}
        className="bg-accent text-accent-ink hover:bg-accent-strong shadow-accent/20 hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:shadow-md lg:flex"
      >
        <DownloadIcon className="h-4 w-4" />
        {shortLabel}
      </a>
    </>
  );
}

/** Brand anchor: in-page jump on a home route, same-locale home elsewhere. */
function BrandAnchor({
  locale,
  currentPath,
}: {
  readonly locale: Locale;
  readonly currentPath: string;
}) {
  const href = isHomeRoute(currentPath) ? "#top" : localePath(locale, "/");
  return (
    <a
      href={href}
      className="text-ink hover:text-accent rounded-lg text-[15px] font-bold tracking-tight transition-colors"
    >
      Sebin Mathew<span className="text-accent">.</span>
    </a>
  );
}

export function SiteHeader({
  locale = DEFAULT_LOCALE,
  currentPath = "/",
}: {
  readonly locale?: Locale;
  readonly currentPath?: string;
}) {
  const dict = getDictionary(locale);
  const rawItems = localizedNavItems(dict, locale);
  // Resolve against the canonical (locale-stripped) path so active-state
  // logic stays identical across locales, but pass the real locale so hash
  // links on off-home pages point at the same locale's home (/ta/#about).
  const resolvedItems = resolveNavigation(currentPath, rawItems, locale);

  return (
    <header
      lang={locale === DEFAULT_LOCALE ? undefined : locale}
      className="border-line/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-lg"
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 min-[420px]:gap-4 sm:px-6 lg:px-8 2xl:max-w-[90rem]">
        <BrandAnchor locale={locale} currentPath={currentPath} />
        <DesktopNav items={resolvedItems} ariaLabel={dict.nav.primary} />

        <div className="flex min-w-0 shrink items-center gap-1.5">
          <LanguageSwitcher
            currentLocale={locale}
            currentPath={currentPath}
            ariaLabel={dict.common.language}
            className="max-w-[7.25rem] lg:max-w-none"
          />
          <DeferredThemeToggle lightLabel={dict.common.toLight} darkLabel={dict.common.toDark} />
          <ResumeActions
            shortLabel={dict.header.resumeShort}
            downloadLabel={dict.header.downloadResume}
          />
          <DeferredMobileNav
            items={resolvedItems}
            mobileLabel={dict.nav.mobile}
            openLabel={dict.header.openMenu}
            closeLabel={dict.header.closeMenu}
            resumeLabel={dict.header.resumeShort}
          />
        </div>
      </div>
      <DeferredActiveSection ids={sectionIds} />
    </header>
  );
}
