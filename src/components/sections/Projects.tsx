"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LuArrowUpRight, LuLock } from "react-icons/lu";
import { SiApple, SiGithub, SiGitlab, SiGoogleplay } from "react-icons/si";
import { profile, projects, type Project } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../ui/TiltCard";
import Reveal from "../ui/Reveal";

const DESKTOP = "(min-width: 1024px)";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP);
  const horizontal = isDesktop && !reduce;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const dist = useMotionValue(0);

  // How far the track has to travel sideways = its overflow past the viewport.
  useEffect(() => {
    const track = trackRef.current;
    if (!horizontal || !track) return;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      setDistance(d);
      dist.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [horizontal, dist]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, dist], ([v, d]: number[]) => -v * d);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={horizontal ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={horizontal ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-28 md:py-40"}>
        {!horizontal && (
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <SectionHeading index="01" kicker="Missions" title="Products I've built" />
            <p className="mt-6 max-w-md text-muted">
              Ideas I&apos;ve partnered on and taken all the way to Google Play and the App Store.
            </p>
          </div>
        )}

        <motion.div
          ref={trackRef}
          style={horizontal ? { x } : undefined}
          className={
            horizontal
              ? "flex h-[min(78svh,660px)] w-max items-stretch gap-6 px-10 will-change-transform"
              : "mx-auto mt-14 grid max-w-[1400px] gap-5 px-5 md:grid-cols-2 md:px-10"
          }
        >
          {horizontal && (
            <div className="flex w-[40vw] max-w-[620px] shrink-0 flex-col justify-between pr-10">
              <div>
                <SectionHeading index="01" kicker="Missions" title="Products I've built" size="md" />
                <p className="mt-6 max-w-sm text-muted">
                  Ideas I&apos;ve partnered on and taken all the way to Google Play and the App Store. Keep scrolling
                  to fly through them.
                </p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                {String(projects.length).padStart(2, "0")} products shipped
              </p>
            </div>
          )}

          {projects.map((project, i) =>
            horizontal ? (
              <div key={project.name} className="w-[clamp(340px,29vw,430px)] shrink-0">
                <ProjectCard project={project} index={i} />
              </div>
            ) : (
              <Reveal key={project.name} delay={(i % 2) * 0.1}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ),
          )}

          <MoreCard horizontal={horizontal} />
        </motion.div>

        {horizontal && (
          <div className="mx-10 mt-8 h-px bg-line">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left bg-linear-to-r from-neon via-ultra to-flare"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [c1, c2] = project.colors;
  return (
    <TiltCard max={5} className="h-full rounded-3xl">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-colors duration-500 hover:border-white/20">
        {/* Generated cover art */}
        <div
          className="relative h-48 shrink-0 overflow-hidden md:h-56"
          style={{
            background: `radial-gradient(120% 120% at 0% 0%, ${c1}66, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${c2}66, transparent 55%), #0b0e18`,
          }}
        >
          <div className="bg-dots absolute inset-0 opacity-60" />
          <span className="text-outline absolute -bottom-6 left-4 font-display text-[7rem] font-black leading-none opacity-60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <PhoneMock name={project.name} colors={project.colors} />
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">{project.role}</p>
          <h3 className="mt-3 font-display text-2xl font-black uppercase">{project.name}</h3>
          <p className="mt-2 text-ink/75">{project.tagline}</p>

          <ul className="mt-5 space-y-2 text-sm text-muted">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-[7px] size-1 shrink-0 rounded-full" style={{ background: c1 }} />
                {h}
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink/70"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {project.links.length ? (
              project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs transition hover:border-neon hover:bg-neon hover:text-bg"
                >
                  {link.store === "play" ? <SiGoogleplay /> : <SiApple />}
                  {link.label}
                  <LuArrowUpRight className="opacity-60" />
                </a>
              ))
            ) : (
              <span className="flex items-center gap-2 rounded-full border border-dashed border-white/15 px-3.5 py-2 text-xs text-muted">
                <LuLock /> Enterprise / private build
              </span>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function PhoneMock({ name, colors: [c1, c2] }: { name: string; colors: [string, string] }) {
  return (
    <div className="absolute -bottom-24 right-6 h-64 w-32 rotate-[-12deg] rounded-[26px] border border-white/25 bg-bg/80 p-1.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] transition-all duration-700 ease-out group-hover:-translate-y-6 group-hover:rotate-[-4deg] md:w-36">
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[20px] p-3"
        style={{ background: `linear-gradient(160deg, ${c1}, ${c2})` }}
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-black/40" />
        <div className="mt-4 grid size-9 place-items-center rounded-xl bg-white/90 font-display text-sm font-black text-bg">
          {name[0]}
        </div>
        <p className="mt-2 font-display text-[11px] font-black uppercase leading-tight text-bg">{name}</p>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-black/25" />
          <div className="h-1.5 w-3/4 rounded-full bg-black/20" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded-lg bg-white/30" />
          <div className="h-8 rounded-lg bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function MoreCard({ horizontal }: { horizontal: boolean }) {
  return (
    <div
      className={`flex flex-col justify-center gap-6 rounded-3xl border border-dashed border-white/15 p-8 ${
        horizontal ? "w-[clamp(300px,24vw,360px)] shrink-0" : "md:col-span-2"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">Side quests</p>
      <p className="font-display text-2xl font-black uppercase leading-tight">More code on GitHub &amp; GitLab</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
        >
          <SiGithub /> GitHub
        </a>
        <a
          href={profile.socials.gitlab}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
        >
          <SiGitlab /> GitLab
        </a>
      </div>
    </div>
  );
}
