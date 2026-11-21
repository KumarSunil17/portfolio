"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import { LuArrowRight, LuArrowUpRight, LuLock, LuX } from "react-icons/lu";
import { SiApple, SiGithub, SiGitlab, SiGoogleplay } from "react-icons/si";
import { profile, projects, type Project } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import { usePrefersReducedMotion } from "../ui/usePrefersReducedMotion";
import { EASE_OUT } from "../ui/motion";

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

function useViewportWidth() {
  const vw = useMotionValue(1440);
  useEffect(() => {
    const set = () => vw.set(window.innerWidth);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [vw]);
  return vw;
}

export default function Projects() {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP);
  const horizontal = isDesktop && !reduce;
  const [open, setOpen] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const dist = useMotionValue(0);
  const vw = useViewportWidth();

  // How far the track travels sideways = its overflow past the viewport.
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
  const rawX = useTransform([scrollYProgress, dist], ([v, d]: number[]) => -v * d);
  // A touch of inertia on top of Lenis so the cards glide rather than track the wheel 1:1.
  const x = useSpring(rawX, { stiffness: 160, damping: 32, mass: 0.6 });
  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.min(projects.length, Math.max(1, Math.round(v * (projects.length - 1)) + 1))).padStart(2, "0"),
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={horizontal ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div
        className={
          horizontal
            ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden [perspective:1600px]"
            : "py-28 md:py-36"
        }
      >
        {!horizontal && (
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <SectionHeading index="01" kicker="Selected work" title="Products I've built" accent="built" />
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
              ? // Cards sit behind the track's own plane in 3D, so the track must not catch their clicks.
                "pointer-events-none flex h-[min(70svh,600px)] w-max items-stretch gap-10 px-10 [transform-style:preserve-3d] will-change-transform [&>*]:pointer-events-auto"
              : "mx-auto mt-14 grid max-w-[1400px] gap-6 px-5 md:grid-cols-2 md:px-10"
          }
        >
          {horizontal && (
            <div className="flex w-[34vw] max-w-[540px] shrink-0 flex-col justify-between pr-6">
              <div>
                <SectionHeading index="01" kicker="Selected work" title="Products I've built" accent="built" size="md" />
                <p className="mt-6 max-w-sm text-muted">
                  Ideas I&apos;ve partnered on and taken all the way to Google Play and the App Store. Keep scrolling
                  — pick any card to dive in.
                </p>
              </div>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                <span className="font-serif text-5xl normal-case tracking-normal text-ink">
                  <motion.span>{counter}</motion.span>
                </span>
                / {String(projects.length).padStart(2, "0")} shipped
              </p>
            </div>
          )}

          {projects.map((project, i) =>
            horizontal ? (
              <FloatingCard key={project.name} index={i} x={x} vw={vw}>
                <ProjectCard project={project} index={i} onOpen={() => setOpen(project)} />
              </FloatingCard>
            ) : (
              // Trigger on the unclipped wrapper; the clipped child animates via variants.
              <motion.div
                key={project.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="aspect-[4/5] sm:aspect-[5/4]"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 50, clipPath: "inset(18% 6% 0% 6% round 28px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      clipPath: "inset(0% 0% 0% 0% round 28px)",
                      transition: { duration: 1, delay: (i % 2) * 0.1, ease: EASE_OUT },
                    },
                  }}
                  className="h-full"
                >
                  <ProjectCard project={project} index={i} onOpen={() => setOpen(project)} />
                </motion.div>
              </motion.div>
            ),
          )}

          <MoreCard horizontal={horizontal} />
        </motion.div>

        {horizontal && (
          <div className="mx-10 mt-10 h-px bg-line">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left bg-linear-to-r from-neon via-ultra to-flare"
            />
          </div>
        )}
      </div>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/**
 * Wraps a card on the horizontal track: the further it is from the centre of the screen,
 * the more it turns away and sinks back, and its artwork is revealed as it slides in.
 */
function FloatingCard({
  children,
  index,
  x,
  vw,
}: {
  children: React.ReactNode;
  index: number;
  x: MotionValue<number>;
  vw: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const centre = useMotionValue(0); // card centre within the track, px

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => centre.set(el.offsetLeft + el.offsetWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [centre]);

  // -1 (far left) … 0 (centre) … 1 (far right)
  const offset = useTransform([x, centre, vw], ([tx, c, w]: number[]) =>
    Math.max(-1.4, Math.min(1.4, (c + tx - w / 2) / (w / 2))),
  );
  const rotateY = useTransform(offset, (o) => o * -16);
  const z = useTransform(offset, (o) => -Math.abs(o) * 160);
  const y = useTransform(offset, (o) => Math.sin(o * 1.6 + index) * 14);
  const dim = useTransform(offset, (o) => Math.min(0.55, Math.max(0, Math.abs(o) - 0.35) * 0.6));
  const reveal = useTransform(offset, [1.25, 0.55], [0, 1], { clamp: true });

  return (
    <motion.div
      ref={ref}
      style={{ rotateY, z, y }}
      className="relative w-[clamp(440px,40vw,640px)] shrink-0 [transform-style:preserve-3d]"
    >
      <RevealContext.Provider value={reveal}>{children}</RevealContext.Provider>
      {/* Cards far from centre sink into the dark (visual only). */}
      <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-[28px] bg-bg" aria-hidden />
    </motion.div>
  );
}

// Lets the card's artwork read its reveal progress without threading props through.
const RevealContext = createContext<MotionValue<number> | null>(null);

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const [c1, c2] = project.colors;
  const reveal = useContext(RevealContext);
  const fallback = useMotionValue(1);
  const r = reveal ?? fallback;
  const clipPath = useTransform(r, (v) => `inset(0% ${(1 - v) * 100}% 0% 0%)`);
  const artScale = useTransform(r, [0, 1], [1.25, 1]);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-2.5 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_70px_110px_-40px_rgb(0_0_0/1)]">
      {/* Artwork */}
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <motion.div
          style={{
            scale: artScale,
            background: `radial-gradient(120% 120% at 0% 0%, ${c1}70, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${c2}66, transparent 55%), #0b0e18`,
          }}
          className="absolute inset-0"
        >
          <div className="bg-dots absolute inset-0 opacity-60" />
          <span className="text-outline absolute -right-2 -top-6 font-serif text-[12rem] leading-none opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Phone project={project} />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/70 to-transparent" />

      {/* Copy */}
      <div className="relative mt-auto flex flex-col p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">{project.role}</p>
        <h3 className="mt-3 font-serif text-5xl leading-[0.9] md:text-6xl">{project.name}</h3>
        <p className="mt-3 max-w-[34ch] text-ink/75">{project.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="group/btn flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-bg transition hover:bg-neon"
          >
            Explore project
            <LuArrowRight className="transition-transform group-hover/btn:translate-x-0.5" />
          </button>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/15 bg-bg/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-ink/75 backdrop-blur-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Phone({ project }: { project: Project }) {
  const [c1, c2] = project.colors;
  return (
    <div className="absolute right-[7%] top-[6%] aspect-[9/19] w-[26%] max-w-[190px] rotate-[-8deg] sm:right-[8%] sm:top-[8%] sm:w-[34%] rounded-[26px] border border-white/25 bg-bg/80 p-1.5 shadow-[0_40px_70px_-20px_rgb(0_0_0/0.85)] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:rotate-[-3deg]">
      {project.screenshot ? (
        <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-black">
          <Image
            src={project.screenshot}
            alt={`${project.name} app screenshot`}
            fill
            sizes="190px"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-[20px] p-3"
          style={{ background: `linear-gradient(160deg, ${c1}, ${c2})` }}
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-black/40" />
          <div className="mt-4 grid size-9 place-items-center rounded-xl bg-white/90 font-display text-sm font-black text-bg">
            {project.name[0]}
          </div>
          <p className="mt-2 font-display text-[11px] font-black uppercase leading-tight text-bg">{project.name}</p>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-black/25" />
            <div className="h-1.5 w-3/4 rounded-full bg-black/20" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <div className="h-8 rounded-lg bg-white/30" />
            <div className="h-8 rounded-lg bg-white/20" />
          </div>
        </div>
      )}
    </div>
  );
}

function StoreLinks({ project }: { project: Project }) {
  if (!project.links.length) {
    return (
      <span className="flex items-center gap-2 rounded-full border border-dashed border-white/15 px-3.5 py-2 text-xs text-muted">
        <LuLock /> Enterprise / private build
      </span>
    );
  }
  return (
    <>
      {project.links.map((link) => (
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
      ))}
    </>
  );
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      prev?.focus?.();
    };
  }, [project, lenis, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-bg/80 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            data-lenis-prevent
            initial={{ opacity: 0, y: 60, scale: 0.96, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            style={{ transformPerspective: 1200 }}
            className="relative grid max-h-[88svh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/10 bg-surface md:grid-cols-[0.9fr_1.1fr]"
          >
            <div
              className="relative min-h-[320px] overflow-hidden"
              style={{
                background: `radial-gradient(120% 120% at 0% 0%, ${project.colors[0]}70, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${project.colors[1]}66, transparent 55%), #0b0e18`,
              }}
            >
              <div className="bg-dots absolute inset-0 opacity-60" />
              <div className="absolute left-1/2 top-1/2 aspect-[9/19] w-[min(46%,220px)] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-[28px] border border-white/25 bg-bg/80 p-1.5 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)]">
                {project.screenshot ? (
                  <div className="relative h-full w-full overflow-hidden rounded-[22px]">
                    <Image src={project.screenshot} alt={`${project.name} app screenshot`} fill sizes="220px" className="object-cover object-top" />
                  </div>
                ) : (
                  <div
                    className="grid h-full place-items-center rounded-[22px] font-serif text-6xl text-bg"
                    style={{ background: `linear-gradient(160deg, ${project.colors[0]}, ${project.colors[1]})` }}
                  >
                    {project.name[0]}
                  </div>
                )}
              </div>
            </div>

            <div className="p-7 md:p-10">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project"
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-bg/60 backdrop-blur-md transition hover:border-neon hover:text-neon"
              >
                <LuX />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">{project.role}</p>
              <h3 id="project-dialog-title" className="mt-3 font-serif text-6xl leading-[0.9] md:text-7xl">
                {project.name}
              </h3>
              <p className="mt-4 text-lg text-ink/80">{project.tagline}</p>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">What I did</p>
              <ul className="mt-3 space-y-3">
                {project.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: EASE_OUT }}
                    className="flex gap-3 border-b border-white/5 pb-3 text-ink/85"
                  >
                    <span className="font-mono text-xs text-neon">0{i + 1}</span>
                    {h}
                  </motion.li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink/70">
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                <StoreLinks project={project} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MoreCard({ horizontal }: { horizontal: boolean }) {
  return (
    <div
      className={`flex flex-col justify-center gap-6 rounded-[28px] border border-dashed border-white/15 p-8 ${
        horizontal ? "w-[clamp(300px,24vw,360px)] shrink-0" : "md:col-span-2"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">Side quests</p>
      <p className="font-serif text-4xl leading-[0.95]">
        More code on <em>GitHub</em> &amp; <em>GitLab</em>
      </p>
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
