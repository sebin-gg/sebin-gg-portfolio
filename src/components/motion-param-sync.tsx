"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MOTION_ATTRIBUTE, MOTION_PARAM, resolveMotionParam } from "@/lib/motion";

/**
 * Keeps html[data-motion] in sync with the URL across client-side
 * navigation: the init script only samples the query at load, so without
 * this an override would stick around after navigating to a param-free
 * route. Nothing to render — wrap in Suspense since useSearchParams bails
 * out of prerendering.
 */
// skipcq: JS-0067 — module-scoped component export, not a global declaration
export function MotionParamSync() {
  const override = resolveMotionParam(useSearchParams().get(MOTION_PARAM));

  useEffect(() => {
    if (override) {
      document.documentElement.setAttribute(MOTION_ATTRIBUTE, override);
    } else {
      document.documentElement.removeAttribute(MOTION_ATTRIBUTE);
    }
  }, [override]);

  return null;
}
