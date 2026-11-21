"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { process, type ProcessStep } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import { EASE_OUT } from "../ui/motion";

// Editorial "how I work": four chapters, image and text alternating sides.
export default function Process() {
  return (
    <section id="process" className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute left-0 top-1/3 size-[40vmax] rounded-full bg-ultra/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading index="02" kicker="How I work" title="From spark to shipped" accent="shipped" />
          <p className="max-w-sm text-muted">
            Four chapters, one partner. The same founder-first rhythm takes every idea from a sketch to a product in
            your users&apos; hands.
          </p>
        </div>

        <ol className="mt-20 space-y-28 md:mt-32 md:space-y-44">
          {process.map((step, i) => (
            <Step key={step.title} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ step, index }: { step: ProcessStep; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const flip = index % 2 === 1;

  // Image opens up from a narrow window as the chapter scrolls into place, then drifts (parallax).
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clipPath = useTransform(
    enter,
    [0, 1],
    ["inset(22% 18% 22% 18% round 28px)", "inset(0% 0% 0% 0% round 28px)"],
  );
  const imageScale = useTransform(enter, [0, 1], [1.35, 1.04]);
  const imageY = useTransform(pass, [0, 1], ["-6%", "6%"]);
  const numberY = useTransform(pass, [0, 1], [120, -120]);

  const n = String(index + 1).padStart(2, "0");

  return (
    <li ref={ref} className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
      {/* Image */}
      <div className={`relative lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}>
        <motion.div style={{ clipPath }} className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-surface">
          <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0">
            <Image
              src={step.image}
              alt={`${step.title}: ${step.kicker}`}
              fill
              sizes="(max-width: 1024px) 92vw, 640px"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-bg/60 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-bg/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink/85 backdrop-blur-md">
            {step.kicker}
          </span>
        </motion.div>

        {/* Oversized chapter number, drifting against the image */}
        <motion.span
          style={{ y: numberY }}
          className={`text-outline pointer-events-none absolute -top-16 select-none font-serif text-[clamp(8rem,18vw,17rem)] leading-none md:-top-24 ${
            flip ? "-left-4 lg:-left-20" : "-right-4 lg:-right-20"
          }`}
          aria-hidden
        >
          {n}
        </motion.span>
      </div>

      {/* Copy */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        >
          <motion.p
            variants={item}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-neon"
          >
            <span className="font-serif text-2xl normal-case tracking-normal text-ink">{n}</span>
            <span className="h-px w-10 bg-neon/60" />
            Chapter {index + 1} / {process.length}
          </motion.p>
          <h3 className="mt-6 overflow-hidden pb-2 font-serif text-[clamp(3.4rem,7vw,6.5rem)] leading-[0.9]">
            <motion.span variants={rise} className="block">
              {step.title}
              <span className="text-neon">.</span>
            </motion.span>
          </h3>
          <motion.p variants={item} className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
            {step.body}
          </motion.p>
          <motion.ul variants={item} className="mt-8 max-w-md border-t border-white/10">
            {step.points.map((pt) => (
              <li
                key={pt}
                className="flex items-center justify-between border-b border-white/10 py-3.5 text-sm text-ink/85"
              >
                {pt}
                <span className="size-1.5 rounded-full bg-neon/70" />
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </li>
  );
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const rise = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } },
};
