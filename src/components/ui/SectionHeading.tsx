"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "./motion";

type Props = {
  index: string;
  kicker: string;
  title: string;
  className?: string;
  /** "md" for tight spots, like the side panel of the horizontal projects track. */
  size?: "lg" | "md";
  /** Words of the title set in the editorial serif italic, e.g. "built". */
  accent?: string;
  /** Colour of the kicker line; defaults to neon. */
  tone?: "neon" | "light";
};

export default function SectionHeading({ index, kicker, title, className = "", size = "lg", accent, tone = "neon" }: Props) {
  const words = title.split(" ");
  const accented = new Set(accent?.split(" "));
  return (
    <div className={className}>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className={`mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] ${
          tone === "neon" ? "text-neon" : "text-white/80"
        }`}
      >
        <span className={`h-px w-8 ${tone === "neon" ? "bg-neon" : "bg-white/60"}`} />
        [{index}] {"//"} {kicker}
      </motion.p>
      {/* The h2 owns the in-view trigger: the words start clipped out of view, so they can't observe themselves. */}
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className={`font-display font-black uppercase leading-[0.9] tracking-tight ${
          size === "lg" ? "text-[clamp(2.4rem,7vw,5.5rem)]" : "text-[clamp(2.2rem,4.6vw,4.5rem)]"
        }`}
      >
        {/* Each word animates in its own clip; real spaces between them keep the heading's text
            ("Products I've built") intact for search engines and screen readers. */}
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={
                  accented.has(word)
                    ? "inline-block pr-[0.06em] font-serif text-[1.12em] font-normal normal-case italic leading-[0.8] tracking-normal"
                    : "inline-block"
                }
                variants={{
                  hidden: { y: "105%" },
                  show: { y: "0%", transition: { duration: 0.9, delay: i * 0.08, ease: EASE_OUT } },
                }}
              >
                {word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </motion.h2>
    </div>
  );
}
