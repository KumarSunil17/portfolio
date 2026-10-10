"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { IconType } from "react-icons";
import { LuLightbulb, LuServer, LuSmartphone, LuUsers, LuWallet } from "react-icons/lu";
import { TbCardboards } from "react-icons/tb";
import { marquee, marqueeAura, skillGroups, type SkillGroup } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import { EASE_OUT } from "../ui/motion";

const icons: Record<SkillGroup["icon"], IconType> = {
  xr: TbCardboards,
  strategy: LuLightbulb,
  mobile: LuSmartphone,
  backend: LuServer,
  growth: LuWallet,
  leadership: LuUsers,
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute right-0 top-1/4 size-[40vmax] rounded-full bg-ultra/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading index="03" kicker="Loadout" title="What I bring" />
          <p className="max-w-sm text-muted">
            One partner from idea to launch — product thinking, immersive AR/VR, and the engineering to ship it on
            every screen.
          </p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) =>
            group.featured ? (
              <FeaturedCard key={group.title} group={group} />
            ) : (
              <SkillCard key={group.title} group={group} index={i} last={i === skillGroups.length - 1} />
            ),
          )}
        </ul>
      </div>

      <div className="relative mt-24 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <MarqueeRow items={marquee} />
        <MarqueeRow items={marqueeAura} reverse outlined />
      </div>
    </section>
  );
}

const cardMotion = (delay: number) => ({
  initial: { opacity: 0, y: 50, rotateX: -12 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.9, delay, ease: EASE_OUT },
  style: { transformPerspective: 800 },
  onPointerMove: (e: React.PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
});

const spotlight =
  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx)_var(--my),rgb(45_226_255/0.12),transparent_40%)]";

// The AR/VR tile: twice the size, with the headset photo bleeding in from the right.
function FeaturedCard({ group }: { group: SkillGroup }) {
  const Icon = icons[group.icon];
  return (
    <motion.li
      {...cardMotion(0)}
      className="group relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-2xl border border-neon/30 bg-surface p-6 sm:col-span-2 md:p-10 lg:row-span-2"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/vr-hero.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover object-[60%_18%] opacity-70 transition-transform duration-[1.6s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/85 to-surface/10" />
        <div className="absolute inset-0 bg-linear-to-r from-surface/90 via-surface/30 to-transparent" />
        <div className="scanlines absolute inset-0 opacity-50" />
      </div>
      <div className={spotlight} />

      <div className="absolute left-6 right-6 top-6 flex items-center justify-between md:left-10 md:right-10 md:top-10">
        <span className="flex items-center gap-2 rounded-full border border-neon/40 bg-bg/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-neon backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-neon" /> Featured focus
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">Slot 01</span>
      </div>

      <div className="relative">
        <span className="grid size-14 place-items-center rounded-xl border border-neon/40 bg-neon/15 text-3xl text-neon shadow-[0_0_30px_-8px] shadow-neon transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon />
        </span>
        <h3 className="mt-6 font-display text-3xl font-black uppercase leading-none md:text-5xl">
          <span className="text-gradient">{group.title}</span>
        </h3>
        <p className="mt-4 max-w-lg text-ink/80 md:text-lg">{group.blurb}</p>
        <ul className="mt-6 flex max-w-xl flex-wrap gap-2">
          {group.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-neon/25 bg-bg/50 px-3 py-1.5 text-sm text-ink/90 backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

function SkillCard({ group, index, last }: { group: SkillGroup; index: number; last: boolean }) {
  const Icon = icons[group.icon];
  return (
    <motion.li
      {...cardMotion((index % 3) * 0.1)}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-neon/40 md:p-8 ${
        last ? "sm:max-lg:col-span-2" : ""
      }`}
    >
      <div className={spotlight} />
      <div className="relative flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl border border-neon/30 bg-neon/10 text-xl text-neon transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          Slot {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="relative mt-8 font-display text-lg font-semibold uppercase tracking-wide">{group.title}</h3>
      <p className="relative mt-2 text-sm text-muted">{group.blurb}</p>
      <ul className="relative mt-5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-ink/85 transition-colors group-hover:border-white/20"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

function MarqueeRow({ items, reverse = false, outlined = false }: { items: string[]; reverse?: boolean; outlined?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div className={`flex shrink-0 gap-8 pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {row.map((item, i) => (
          <span
            key={i}
            className={`flex items-center gap-8 whitespace-nowrap font-display text-3xl font-black uppercase md:text-5xl ${
              outlined ? "text-outline" : i % 2 ? "text-ink/90" : "text-gradient"
            }`}
          >
            {item}
            <span className="text-xl text-neon [-webkit-text-stroke:0] md:text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
