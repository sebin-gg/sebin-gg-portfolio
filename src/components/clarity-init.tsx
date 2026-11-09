import { clarityInitScriptSource } from "@/lib/clarity";

export function ClarityInit() {
  return <script dangerouslySetInnerHTML={{ __html: clarityInitScriptSource() }} />;
}
