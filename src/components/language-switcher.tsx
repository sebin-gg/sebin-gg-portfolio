"use client";

import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  localeFromPathname,
  switchLocalePath,
  type Locale,
} from "@/lib/locale";

function SwitchLink({
  locale,
  active,
  pathname,
}: {
  locale: Locale;
  active: Locale;
  pathname: string | null;
}) {
  const current = locale === active;
  return (
    <a
      href={switchLocalePath(pathname, locale)}
      aria-label={LOCALE_NAMES[locale]}
      title={LOCALE_NAMES[locale]}
      aria-current={current ? "true" : undefined}
      className={`rounded-md px-1.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
        current ? "text-accent bg-panel-2/70" : "text-ink-faint hover:text-accent"
      }`}
    >
      {locale.toUpperCase()}
    </a>
  );
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const active = localeFromPathname(pathname);
  const dict = getDictionary(active);

  return (
    <nav aria-label={dict.language} className="flex items-center gap-0.5">
      {SUPPORTED_LOCALES.map((locale) => (
        <SwitchLink key={locale} locale={locale} active={active} pathname={pathname} />
      ))}
    </nav>
  );
}
