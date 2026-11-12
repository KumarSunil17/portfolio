"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type MagnetProps = {
  children: ReactNode;
  /** How far outside the element (px) the cursor still attracts it. */
  padding?: number;
  /** Higher = weaker pull. The element moves by (cursor offset / strength). */
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  disabled = false,
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const off = disabled || reduceMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el || off) return;

    // The element's current translation, so we can measure where it *rests*.
    // Without this, the centre moves with the element and the pull feeds back on itself.
    let tx = 0;
    let ty = 0;

    const move = (x: number, y: number, transition: string) => {
      tx = x;
      ty = y;
      el.style.transition = transition;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left - tx + width / 2;
      const centerY = top - ty + height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      if (Math.abs(dx) < width / 2 + padding && Math.abs(dy) < height / 2 + padding) {
        move(dx / strength, dy / strength, activeTransition);
      } else if (tx !== 0 || ty !== 0) {
        move(0, 0, inactiveTransition);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [off, padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
}
