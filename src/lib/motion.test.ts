import { afterEach, describe, expect, it } from "vitest";
import {
  MOTION_ATTRIBUTE,
  MOTION_PARAM,
  motionInitScriptSource,
  resolveMotionParam,
} from "@/lib/motion";

/** Runs the init script against a given URL query. */
// skipcq: JS-0067
function runInit(search: string) {
  window.history.pushState({}, "", `/${search}`);
  new Function(motionInitScriptSource())();
  return document.documentElement.getAttribute(MOTION_ATTRIBUTE);
}

afterEach(() => {
  window.history.pushState({}, "", "/");
  document.documentElement.removeAttribute(MOTION_ATTRIBUTE);
});

describe("resolveMotionParam", () => {
  it("accepts on and off", () => {
    expect(resolveMotionParam("on")).toBe("on");
    expect(resolveMotionParam("off")).toBe("off");
  });

  it("rejects anything else", () => {
    expect(resolveMotionParam(null)).toBeNull();
    expect(resolveMotionParam("")).toBeNull();
    expect(resolveMotionParam("auto")).toBeNull();
    expect(resolveMotionParam("banana")).toBeNull();
    expect(resolveMotionParam("ON")).toBeNull();
  });
});

describe("motionInitScriptSource", () => {
  it("references the param and attribute", () => {
    const source = motionInitScriptSource();
    expect(source).toContain(MOTION_PARAM);
    expect(source).toContain(MOTION_ATTRIBUTE);
  });

  it("applies ?motion=off", () => {
    expect(runInit("?motion=off")).toBe("off");
  });

  it("applies ?motion=on", () => {
    expect(runInit("?motion=on")).toBe("on");
  });

  it("clears the attribute on ?motion=auto", () => {
    document.documentElement.setAttribute(MOTION_ATTRIBUTE, "off");
    expect(runInit("?motion=auto")).toBeNull();
  });

  it("sets no attribute when the param is absent or invalid", () => {
    expect(runInit("")).toBeNull();
    expect(runInit("?motion=banana")).toBeNull();
  });

  it("does not persist an override across loads", () => {
    expect(runInit("?motion=off")).toBe("off");
    expect(runInit("")).toBeNull();
  });
});
