"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

/** Reveals `text` one character at a time (opacity 0.2 → 1) as the paragraph scrolls through view. */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const total = text.length;
  let index = 0;

  return (
    // The characters are duplicated (placeholder + animated copy), so expose the
    // sentence once to assistive tech and hide the per-character spans.
    <p ref={ref} aria-label={text} className={className} style={style}>
      {words.map((word, wordIndex) => {
        const chars = Array.from(word).map((char) => {
          const i = index++;
          return (
            <Char key={i} progress={scrollYProgress} range={[i / total, (i + 1) / total]}>
              {char}
            </Char>
          );
        });
        index++; // the space after this word

        return (
          <span key={wordIndex} aria-hidden="true">
            {/* Words stay whole so lines only wrap between words. */}
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </p>
  );
}

function Char({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative">
      <span className="opacity-0">{children}</span>
      <motion.span className="absolute top-0 left-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}
