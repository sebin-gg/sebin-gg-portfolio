import Script from "next/script";
import { motionInitScriptSource } from "@/lib/motion";

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function MotionInit() {
  // Children form avoids dangerouslySetInnerHTML; beforeInteractive keeps the
  // attribute on <html> ahead of first paint, same guarantee as ThemeInit.
  return (
    <Script id="motion-init" strategy="beforeInteractive">
      {motionInitScriptSource()}
    </Script>
  );
}
