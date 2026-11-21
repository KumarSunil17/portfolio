"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();

  // One stable tree (no hydration mismatch); reduced motion just turns the smoothing off.
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.09, smoothWheel: !reduce }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
