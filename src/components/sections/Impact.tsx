"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, stats, type Stat } from "@/data/profile";
import Counter from "../ui/Counter";
import { EASE_OUT } from "../ui/motion";

// The indigo "numbers" chapter: one statement inside an arch, four stats orbiting it.
export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.25, 1.05]);
  const ringsScale = useTransform(scrollYProgress, [0, 0.6], [0.8, 1.06]);
  const ringsOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);

  const [a, b, c, d] = stats;

  return (
    <section ref={sectionRef} id="impact" aria-label="Impact in numbers" className="relative overflow-hidden bg-indigo">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgb(155_107_255/0.22),transparent_70%)]" />
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="mb-14 flex flex-wrap items-end justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/80 lg:mb-20"
        >
          <span className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/60" /> By the numbers
          </span>
          <span className="text-white/60">Founder-first since 2019</span>
        </motion.div>

        <div className="grid items-center gap-y-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10">
          <div className="order-2 grid grid-cols-2 gap-x-6 gap-y-12 lg:order-1 lg:grid-cols-1 lg:gap-y-28">
            <StatBlock stat={a} index={0} side="left" />
            <StatBlock stat={b} index={1} side="left" />
          </div>

          {/* The arch. The in-view trigger sits on an unclipped wrapper: a fully clipped element never
              registers as visible, so it couldn't trigger its own reveal. */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="relative order-1 mx-auto lg:order-2"
          >
            {/* Concentric arches echoing the shape, centred on it */}
            <motion.div
              style={{ scale: ringsScale, opacity: ringsOpacity }}
              className="pointer-events-none absolute inset-0"
              aria-hidden
            >
              {[1.1, 1.5, 1.95, 2.45].map((k) => (
                <div
                  key={k}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-t-full rounded-b-[40px] border border-white/15"
                  style={{ width: `${k * 100}%`, height: `${k * 100}%` }}
                />
              ))}
            </motion.div>
            <motion.div
              variants={{
                hidden: { clipPath: "inset(100% 0% 0% 0% round 999px 999px 32px 32px)" },
                show: {
                  clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)",
                  transition: { duration: 1.4, ease: EASE_OUT },
                },
              }}
              className="relative aspect-[1/1.32] w-[min(400px,74vw)] overflow-hidden rounded-t-full rounded-b-[32px] bg-indigo-deep shadow-[0_60px_120px_-40px_rgb(0_0_0/0.6)]"
            >
              <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
                <Image
                  src="/images/vr-hero.png"
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover object-[58%_30%] opacity-90 mix-blend-luminosity"
                />
              </motion.div>
              <div className="absolute inset-0 bg-linear-to-b from-indigo/30 via-indigo-deep/40 to-indigo-deep" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-center md:p-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">Why founders pick me</p>
                <p className="mt-4 font-serif text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.02] text-white">
                  I think like a <em>founder</em>, build like an <em>engineer</em> &amp; obsess over every pixel.
                </p>
                <p className="mt-4 text-xs text-white/70">— {profile.shortName}</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="order-3 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-1 lg:gap-y-28">
            <StatBlock stat={c} index={2} side="right" />
            <StatBlock stat={d} index={3} side="right" />
          </div>
        </div>
      </div>

      {/* Fade back to the dark canvas for the work section */}
      <div className="pointer-events-none relative h-40 bg-linear-to-b from-indigo to-bg md:h-56" aria-hidden />
    </section>
  );
}

function StatBlock({ stat, index, side }: { stat: Stat; index: number; side: "left" | "right" }) {
  const left = side === "left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, delay: (index % 2) * 0.12, ease: EASE_OUT }}
      className={`relative ${left ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
        {String(index + 1).padStart(2, "0")} / {String(stats.length).padStart(2, "0")}
      </p>
      <p className="mt-2 font-serif text-[clamp(4.2rem,9vw,9.5rem)] leading-[0.85] text-white">
        <Counter value={stat.value} suffix={stat.suffix} />
      </p>
      <p className="mt-3 text-base font-medium text-white md:text-lg">{stat.label}</p>
      <p className="mt-1 text-sm text-white/65">{stat.detail}</p>

      {/* Connector to the arch (desktop) */}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.1, delay: 0.3 + (index % 2) * 0.12, ease: EASE_OUT }}
        className={`absolute top-1/2 hidden h-px w-[5.25rem] bg-white/50 lg:block ${
          left ? "right-[-2.5rem] origin-left" : "left-[-2.5rem] origin-right"
        }`}
        aria-hidden
      >
        <span className={`absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-neon shadow-[0_0_14px] shadow-neon ${left ? "right-0" : "left-0"}`} />
      </motion.span>
    </motion.div>
  );
}
