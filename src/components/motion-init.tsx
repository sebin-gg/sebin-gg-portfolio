import { motionInitScriptSource } from "@/lib/motion";

export function MotionInit() {
  return <script dangerouslySetInnerHTML={{ __html: motionInitScriptSource() }} />;
}
