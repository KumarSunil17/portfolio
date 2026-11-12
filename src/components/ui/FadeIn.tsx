"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// motion.create() builds a component, so do it once at module level rather than
// during render (which would remount the element on every update).
const elements = {
  div: motion.create("div"),
  section: motion.create("section"),
  h1: motion.create("h1"),
  h2: motion.create("h2"),
  p: motion.create("p"),
  span: motion.create("span"),
  li: motion.create("li"),
};

type FadeInProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport" | "transition"
> & {
  as?: keyof typeof elements;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

export default function FadeIn({
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  children,
  ...rest
}: FadeInProps) {
  const Element = elements[as] as typeof motion.div;

  return (
    <Element
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Element>
  );
}
