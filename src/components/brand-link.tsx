"use client";

import { usePathname } from "next/navigation";
import { getLogoHref } from "@/lib/navigation";

export function BrandLink() {
  const pathname = usePathname();
  const href = getLogoHref(pathname);

  return (
    <a
      href={href}
      className="text-ink hover:text-accent rounded-lg text-[15px] font-bold tracking-tight transition-colors"
    >
      Sebin Mathew<span className="text-accent">.</span>
    </a>
  );
}
