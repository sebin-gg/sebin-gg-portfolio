import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIdle } from "@/lib/use-idle";

describe("useIdle", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts idle=false and flips true after the fallback timer", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle());
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("uses requestIdleCallback when the browser provides it", () => {
    let invokeIdle: (() => void) | undefined;
    const requestIdle = vi.fn((cb: () => void) => {
      invokeIdle = cb;
      return 7;
    });
    const cancelIdle = vi.fn();
    vi.stubGlobal("requestIdleCallback", requestIdle);
    vi.stubGlobal("cancelIdleCallback", cancelIdle);

    const { result, unmount } = renderHook(() => useIdle());
    expect(requestIdle).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(false);

    act(() => {
      invokeIdle?.();
    });
    expect(result.current).toBe(true);

    unmount();
  });

  it("cancels the fallback timer on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useIdle());
    unmount();
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }).not.toThrow();
  });
});
