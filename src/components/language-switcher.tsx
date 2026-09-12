import { LOCALE_NAMES, SUPPORTED_LOCALES, localePath, type Locale } from "@/lib/locale";

function SwitchLink({
  locale,
  currentLocale,
  currentPath,
  label,
}: {
  readonly locale: Locale;
  readonly currentLocale: Locale;
  readonly currentPath: string;
  readonly label: string;
}) {
  const current = locale === currentLocale;
  return (
    <a
      href={localePath(locale, currentPath)}
      aria-label={label}
      title={label}
      aria-current={current ? "true" : undefined}
      className={`rounded-md px-1.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
        current ? "text-accent bg-panel-2/70" : "text-ink-faint hover:text-accent"
      }`}
    >
      {locale.toUpperCase()}
    </a>
  );
}

/**
 * Zero-JS language switcher. `currentPath` is the canonical (locale-stripped)
 * route passed down from the server-rendered page, so links resolve at build
 * time and this component ships no JavaScript.
 */
export function LanguageSwitcher({
  currentLocale,
  currentPath,
  ariaLabel,
}: {
  readonly currentLocale: Locale;
  readonly currentPath: string;
  readonly ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-0.5">
      {SUPPORTED_LOCALES.map((locale) => (
        <SwitchLink
          key={locale}
          locale={locale}
          currentLocale={currentLocale}
          currentPath={currentPath}
          label={LOCALE_NAMES[locale]}
        />
      ))}
    </nav>
  );
}
