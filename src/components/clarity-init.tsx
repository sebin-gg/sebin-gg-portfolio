import { clarityInitScriptSource } from "@/lib/clarity";

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function ClarityInit() {
  // skipcq: JS-0440 — static bootstrap string built from a constant ID, no user input
  return <script dangerouslySetInnerHTML={{ __html: clarityInitScriptSource() }} />;
}
