"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const CLARITY_PROJECT_ID = "zas9c0vkoo";

// skipcq: JS-0067 — module-scoped export, not a global declaration
export function ClarityLoader() {
  useEffect(() => {
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);
  return null;
}
