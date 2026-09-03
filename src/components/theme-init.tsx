import { themeInitScriptSource } from "@/lib/theme";

export function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScriptSource() }} />;
}
