"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe reduced-motion flag. It reads `false` while hydrating, matching the server
 * render, then switches to the visitor's real preference. Motion's `useReducedMotion` reports
 * the real value on the first client render, so markup that branches on it can mismatch the
 * server HTML.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
