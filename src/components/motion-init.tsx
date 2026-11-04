import { motionInitScriptSource } from "@/lib/motion";

// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function MotionInit() {
  return <script dangerouslySetInnerHTML={{ __html: motionInitScriptSource() }} />;
}
