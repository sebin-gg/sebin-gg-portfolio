// skipcq: JS-0067 — ES module, declarations cannot leak into global scope
export const MOTION_PARAM = "motion";
// skipcq: JS-0067
export const MOTION_ATTRIBUTE = "data-motion";

export type MotionPreference = "on" | "off";

/**
 * Parses the ?motion= override. "on" forces animation, "off" kills it.
 * "auto" and everything else (including no param) mean "no override" —
 * the OS prefers-reduced-motion setting decides.
 */
// skipcq: JS-0067
export function resolveMotionParam(value: string | null): MotionPreference | null {
  if (value === "on" || value === "off") return value;
  return null;
}

/**
 * Returns the raw inline script that applies the motion override before
 * paint. ?motion=on|off sets <html data-motion="…">; anything else removes
 * the attribute. Nothing is persisted — the param only affects the page it
 * was loaded on. The logic is duplicated from resolveMotionParam on purpose:
 * it cannot import it before the bundle loads.
 */
// skipcq: JS-0067
export function motionInitScriptSource(): string {
  const attr = JSON.stringify(MOTION_ATTRIBUTE);
  const param = JSON.stringify(MOTION_PARAM);
  const script = `
(function () {
  var ATTR = ${attr}, PARAM = ${param};
  var value = null;
  try { value = new URLSearchParams(window.location.search).get(PARAM); } catch (e) {}
  if (value === "on" || value === "off") {
    document.documentElement.setAttribute(ATTR, value);
  } else {
    document.documentElement.removeAttribute(ATTR);
  }
})();
`;
  return script;
}
