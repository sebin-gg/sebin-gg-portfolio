import { motionInitScriptSource } from "@/lib/motion";

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function MotionInit() {
  const html = { __html: motionInitScriptSource() };
  // skipcq: JS-0440 — static script from module constants, no user input
  return <script dangerouslySetInnerHTML={html} />;
}
