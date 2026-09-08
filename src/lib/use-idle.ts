import { useEffect, useState } from "react";

/**
 * Returns true once the main thread has been idle (requestIdleCallback), or
 * after a short fallback timer when idle callbacks are unavailable. Used to
 * defer hydration of progressive-enhancement widgets off the critical path so
 * their parse/execute work lands after the load window.
 */
export function useIdle(timeoutMs = 2000): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setIdle(true);
    };

    if (typeof window === "undefined") return;

    const hasIdle = "requestIdleCallback" in window;
    if (hasIdle) {
      const id = window.requestIdleCallback(finish, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(finish, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [timeoutMs]);

  return idle;
}
