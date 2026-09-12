"use client";

import { useSyncExternalStore } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/locale";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * Bottom banner shown while the browser reports no network. Static-first site:
 * visited routes are already on disk, so the copy points that out instead of
 * pretending a retry button can fetch anything. Server snapshot assumes online
 * so the prerendered HTML never contains the banner.
 */
export function OfflineBanner({ locale }: { readonly locale: Locale }) {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  if (online) return null;

  const dict = getDictionary(locale);
  return (
    <div
      role="status"
      className="border-line bg-panel text-ink fixed inset-x-0 bottom-0 z-50 border-t px-4 py-3 shadow-lg backdrop-blur-md"
    >
      <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm sm:justify-between">
        <span className="font-semibold">{dict.offline.message}</span>
        <span className="text-ink-soft">{dict.offline.retryHint}</span>
      </p>
    </div>
  );
}
