"use client";

import { MotionConfig } from "framer-motion";

// Honour the visitor's "reduce motion" setting for every Framer Motion animation on the page.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
