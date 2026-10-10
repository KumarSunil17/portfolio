"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { LuAward, LuBriefcase, LuGraduationCap, LuMapPin } from "react-icons/lu";
import { education, experience } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { EASE_OUT } from "../ui/motion";

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 0.75", "end 0.6"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading index="04" kicker="Quest log" title="The journey" />

        <div ref={timelineRef} className="relative mt-16 md:mt-24">
          {/* Track + scroll-drawn progress line */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-[calc(25%+11px)]" />
          <motion.div
            style={{ scaleY: draw }}
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-linear-to-b from-neon via-ultra to-flare shadow-[0_0_12px] shadow-neon md:left-[calc(25%+11px)]"
          />

          {experience.map((job) => (
            <article key={job.company} className="relative grid gap-6 pb-16 pl-12 md:grid-cols-4 md:gap-0 md:pl-0">
              <Reveal className="md:pr-12 md:text-right">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{job.period}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted md:justify-end">
                  <LuMapPin /> {job.location}
                </p>
              </Reveal>

              <Node className="left-0 top-0 md:left-[25%]">
                <LuBriefcase />
              </Node>

              <Reveal delay={0.1} className="md:col-span-3 md:pl-16">
                <div className="hud-corners relative rounded-2xl border border-line bg-surface p-6 [--s:16px] md:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                      <span className="size-1.5 animate-pulse rounded-full bg-signal" /> Current
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Founder mode</span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-black uppercase leading-tight md:text-5xl">
                    <span className="text-gradient">{job.role}</span>
                  </h3>
                  <p className="mt-2 text-lg text-neon">{job.company}</p>
                  {job.alsoRole && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                      Also · {job.alsoRole}
                    </p>
                  )}
                  <p className="mt-6 max-w-3xl border-l-2 border-neon/60 pl-4 text-lg leading-relaxed text-ink/90">
                    {job.lead}
                  </p>
                  <ul className="mt-8 grid gap-4 md:grid-cols-2">
                    {job.points.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
                        className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 leading-relaxed text-ink/85"
                      >
                        <span className="mt-1 font-mono text-xs text-neon">0{i + 1}</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </article>
          ))}

          {education.map((item, i) => (
            <article key={item.title} className="relative grid gap-4 pb-12 pl-12 last:pb-0 md:grid-cols-4 md:gap-0 md:pl-0">
              <Reveal className="md:pr-12 md:text-right">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{item.period}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted md:justify-end">
                  <LuMapPin /> {item.location}
                </p>
              </Reveal>

              <Node className="left-0 top-0 md:left-[25%]">
                {item.kind === "Degree" ? <LuGraduationCap /> : <LuAward />}
              </Node>

              <Reveal delay={0.1 + i * 0.05} className="md:col-span-3 md:pl-16">
                <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface/60 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{item.kind}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold uppercase">{item.title}</h3>
                  </div>
                  <p className="text-ink/80">{item.org}</p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Node({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`absolute grid size-6 place-items-center rounded-full border border-neon bg-bg text-[11px] text-neon shadow-[0_0_16px] shadow-neon/60 ${className}`}
    >
      {children}
    </motion.span>
  );
}
