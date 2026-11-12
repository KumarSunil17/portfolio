"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuLanguages, LuMapPin } from "react-icons/lu";
import { profile, stats } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../ui/TiltCard";
import Counter from "../ui/Counter";
import Reveal from "../ui/Reveal";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-28 md:py-40">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <motion.div style={{ y: portraitY }} className="relative mx-auto w-full max-w-md lg:mx-0">
          <Reveal y={60}>
            <TiltCard className="rounded-2xl">
              <div className="hud-corners relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-3 [--s:22px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image
                    src="/images/portrait.png"
                    alt={`Portrait of ${profile.name}`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 440px"
                    className="object-cover object-top"
                  />
                  <div className="scanlines absolute inset-0 opacity-40" />
                  <div className="absolute inset-0 bg-linear-to-t from-bg/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                    <div>
                      <p className="text-neon">ID · SKM-01</p>
                      <p className="mt-1 text-ink/80">{profile.title}</p>
                    </div>
                    <p className="flex items-center gap-1.5 text-signal">
                      <span className="size-1.5 rounded-full bg-signal" /> Verified
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-neon/10 blur-[80px]" />
        </motion.div>

        <div>
          <SectionHeading index="02" kicker="Player profile" title="Beyond the code" />
          <ScrollRevealText text={profile.summary} className="mt-10 text-xl leading-relaxed md:text-2xl md:leading-relaxed" />

          <Reveal className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
            <span className="flex items-center gap-2">
              <LuMapPin className="text-neon" /> {profile.location}
            </span>
            <span className="flex items-center gap-2">
              <LuLanguages className="text-neon" /> {profile.languages.join(" · ")}
            </span>
          </Reveal>

          <dl className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="flex flex-col-reverse bg-bg p-5 md:p-6">
                <dt className="mt-2 text-xs text-muted md:text-sm">{s.label}</dt>
                <dd className="font-display text-4xl font-black text-gradient md:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// Words light up one by one as the paragraph scrolls through the viewport.
function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}
