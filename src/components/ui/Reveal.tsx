"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "./motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "span";
};

export default function Reveal({ children, className, delay = 0, y = 40, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}
