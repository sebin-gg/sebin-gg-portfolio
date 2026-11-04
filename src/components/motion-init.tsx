import { motionInitScriptSource } from "@/lib/motion";

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function MotionInit() {
  const html = { __html: motionInitScriptSource() };
  // skipcq — static script assembled from module constants, same trust
  // boundary as ThemeInit: no user input reaches this markup
  return <script dangerouslySetInnerHTML={html} />;
}
