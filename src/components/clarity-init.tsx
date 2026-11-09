import { clarityInitScriptSource } from "@/lib/clarity";

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function ClarityInit() {
  return <script dangerouslySetInnerHTML={{ __html: clarityInitScriptSource() }} />;
}
