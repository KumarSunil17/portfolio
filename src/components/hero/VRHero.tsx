"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LuArrowDown, LuArrowUpRight, LuPhone } from "react-icons/lu";
import { actions, heroFeatures, profile, type HeroFeature } from "@/data/profile";
import { EASE_OUT } from "../ui/motion";

// Centre of the headset inside the source photo, as fractions of its width / height.
const HEADSET = { x: 0.54, y: 0.27 };
// Scroll progress where the zoom + HUD phase ends and the "dive into the visor" begins.
const DIVE = 0.78;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeIn = (t: number) => t * t * t;

export default function VRHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Viewport-dependent targets: how far to move the headset so it lands in the
  // middle of the screen, and how far to zoom before the dive.
  const focusX = useMotionValue(0);
  const focusY = useMotionValue(0);
  const zoom = useMotionValue(1.9);

  useEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const mobile = window.innerWidth < 768;
      // offset* ignore transforms, so this is the untransformed headset position.
      const hx = frame.offsetLeft + frame.offsetWidth * HEADSET.x;
      const hy = frame.offsetTop + frame.offsetHeight * HEADSET.y;
      focusX.set(window.innerWidth / 2 - hx);
      focusY.set(window.innerHeight * (mobile ? 0.3 : 0.42) - hy);
      zoom.set(mobile ? 1.4 : 1.9);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [focusX, focusY, zoom]);

  const scale = useTransform([p, zoom], ([v, z]: number[]) =>
    v < DIVE ? 1 + (z - 1) * easeInOut(v / DIVE) : z * (1 + 2.4 * easeIn((v - DIVE) / (1 - DIVE))),
  );
  const x = useTransform([p, focusX], ([v, f]: number[]) => f * easeInOut(clamp01(v / DIVE)));
  const y = useTransform([p, focusY], ([v, f]: number[]) => f * easeInOut(clamp01(v / DIVE)));

  const introOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const introY = useTransform(p, [0, 0.1], [0, 80]);
  const introBlur = useTransform(p, [0, 0.1], ["blur(0px)", "blur(8px)"]);
  // Faded-out CTAs must not swallow clicks.
  const introPointer = useTransform(introOpacity, (o) => (o < 0.2 ? "none" : "auto"));

  const chrome = useTransform(p, [0.06, 0.14, DIVE, DIVE + 0.06], [0, 1, 1, 0]);
  const scan = useTransform(p, [0.08, 0.35, 0.86, 0.95], [0, 0.7, 0.7, 0]);
  const glow = useTransform(p, [0, 0.6], [0.55, 1]);
  const floor = useTransform(p, [0, 0.25], [0.55, 0]);
  const scrim = useTransform(p, [0, 0.15], [1, 0.35]);

  const sync = useTransform(p, (v) => Math.round(clamp01(v / DIVE) * 100));
  const syncBar = useTransform(p, (v) => clamp01(v / DIVE));

  const reticle = useTransform(p, [0.56, 0.63, DIVE, DIVE + 0.06], [0, 1, 1, 0]);
  const reticleScale = useTransform(p, [0.56, 0.64], [1.8, 1]);

  const dive = useTransform(p, [0.84, 0.95], [0, 1]);
  const accessOpacity = useTransform(p, [0.9, 0.96], [0, 1]);
  const accessSpacing = useTransform(p, [0.9, 1], ["0.7em", "0.3em"]);

  return (
    <>
      <section
        ref={sectionRef}
        id="top"
        aria-label="Introduction"
        className={reduce ? "relative h-svh" : "relative h-[460vh] md:h-[520vh]"}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Backdrop: glows + moving grid floor */}
          <motion.div style={{ opacity: glow }} className="absolute inset-0" aria-hidden>
            <div className="absolute -left-[10%] top-[5%] size-[55vmax] rounded-full bg-neon/20 blur-[120px]" />
            <div className="absolute -right-[15%] -top-[10%] size-[60vmax] rounded-full bg-ultra/25 blur-[140px]" />
            <div className="absolute bottom-[-20%] left-[30%] size-[40vmax] rounded-full bg-flare/10 blur-[120px]" />
          </motion.div>
          <motion.div
            style={{ opacity: floor }}
            className="absolute inset-x-[-50%] top-[55%] h-[90%]"
            aria-hidden
          >
            <div className="grid-floor h-full w-full animate-floor" />
          </motion.div>

          {/* The VR photo */}
          <motion.div
            ref={frameRef}
            className="vr-frame will-change-transform"
            style={reduce ? undefined : { x, y, scale, originX: HEADSET.x, originY: HEADSET.y }}
          >
            <motion.div
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: EASE_OUT }}
            >
              <Image
                src="/images/vr-hero.png"
                alt={`${profile.name} wearing a VR headset and holding motion controllers`}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 150vh, 100vw"
                className="select-none object-cover"
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* Top scrim keeps the nav readable over the photo */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg/80 to-transparent"
            aria-hidden
          />

          {/* Bottom scrim so the intro copy stays readable over the photo */}
          <motion.div
            style={{ opacity: scrim }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-bg via-bg/80 to-transparent"
            aria-hidden
          />

          {/* HUD overlays */}
          <motion.div style={{ opacity: scan }} className="scanlines pointer-events-none absolute inset-0" aria-hidden />
          <motion.div
            style={{ opacity: scan }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(5_6_11/0.85)_100%)]"
            aria-hidden
          />
          <motion.div
            style={{ opacity: chrome }}
            className="hud-corners pointer-events-none absolute inset-4 [--s:28px] md:inset-8 md:[--s:44px]"
            aria-hidden
          />

          {/* Reticle locked onto the visor */}
          {!reduce && (
            <motion.div
              style={{ opacity: reticle, scale: reticleScale }}
              className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 md:top-[42%]"
              aria-hidden
            >
              <div className="relative size-[min(80vw,520px)] drop-shadow-[0_0_10px_rgb(45_226_255/0.9)]">
                <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-neon" />
                <div className="absolute inset-[10%] rounded-full border border-neon/60" />
                <div className="absolute -top-3 left-1/2 h-10 w-0.5 -translate-x-1/2 bg-neon" />
                <div className="absolute -bottom-3 left-1/2 h-10 w-0.5 -translate-x-1/2 bg-neon" />
                <div className="absolute -left-3 top-1/2 h-0.5 w-10 -translate-y-1/2 bg-neon" />
                <div className="absolute -right-3 top-1/2 h-0.5 w-10 -translate-y-1/2 bg-neon" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-bg/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
                  Tech partner located · {profile.firstName}
                </span>
              </div>
            </motion.div>
          )}

          {/* Feature panels: a 2-col dock on mobile, floating HUD cards on desktop */}
          {!reduce && (
            <div className="absolute inset-x-3 bottom-20 grid grid-cols-2 gap-2 md:inset-0 md:block">
              {heroFeatures.map((f, i) => (
                <HudPanel key={f.code} feature={f} index={i} p={p} />
              ))}
            </div>
          )}

          {/* Intro copy */}
          <motion.div
            style={reduce ? undefined : { opacity: introOpacity, y: introY, filter: introBlur, pointerEvents: introPointer }}
            className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-neon"
            >
              <span className="size-2 rounded-full bg-signal shadow-[0_0_12px] shadow-signal" />
              Co-founder · {profile.company}
            </motion.p>
            <h1 className="font-display font-black uppercase leading-[0.86] tracking-tight">
              <span className="mb-3 block overflow-hidden text-[6vw] leading-tight md:mb-4 md:text-[2.4vw]">
                <motion.span
                  className="inline-block text-ink/85"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT }}
                >
                  Meet {profile.shortName}
                  <span className="text-neon"> —</span>
                </motion.span>
              </span>
              <span className="block text-[11.5vw] md:text-[7.4vw]">
                <SplitLine text="Your next" delay={0.7} />
                <SplitLine text="Tech partner" delay={0.9} gradient />
              </span>
            </h1>
            <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="max-w-md text-sm leading-relaxed text-ink/80 md:text-base"
              >
                {profile.tagline}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex flex-wrap items-center gap-3"
              >
                <a
                  href={actions.startProject}
                  className="group flex items-center gap-2 rounded-full bg-neon px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-bg shadow-[0_0_30px_-6px] shadow-neon transition hover:shadow-[0_0_44px_-2px]"
                >
                  Start a project
                  <LuArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href={actions.call}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-bg/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition hover:border-neon hover:text-neon"
                >
                  <LuPhone /> Let&apos;s call
                </a>
                <span className="ml-2 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted lg:flex">
                  <span className="grid size-10 place-items-center rounded-full border border-white/15">
                    <motion.span
                      animate={reduce ? undefined : { y: [0, 6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <LuArrowDown className="text-neon" />
                    </motion.span>
                  </span>
                  Scroll
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Sync meter */}
          {!reduce && (
            <motion.div
              style={{ opacity: chrome }}
              className="absolute bottom-6 left-1/2 w-[min(88vw,360px)] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-neon md:bottom-10"
              aria-hidden
            >
              <div className="mb-2 flex justify-between">
                <span>Syncing experience</span>
                <span>
                  <motion.span>{sync}</motion.span>%
                </span>
              </div>
              <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  style={{ scaleX: syncBar }}
                  className="h-full origin-left bg-linear-to-r from-neon via-ultra to-flare"
                />
              </div>
            </motion.div>
          )}

          {/* Dive: fade to black, then "access granted" */}
          {!reduce && (
            <motion.div
              style={{ opacity: dive }}
              className="pointer-events-none absolute inset-0 grid place-items-center bg-bg"
              aria-hidden
            >
              <motion.div style={{ opacity: accessOpacity }} className="text-center">
                <motion.p
                  style={{ letterSpacing: accessSpacing }}
                  className="font-mono text-xs uppercase text-neon md:text-sm"
                >
                  Access granted
                </motion.p>
                <p className="mt-4 font-display text-3xl font-black uppercase md:text-6xl">
                  Let&apos;s build <span className="text-gradient">your world</span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {reduce && <StaticFeatures />}
    </>
  );
}

function SplitLine({
  text,
  delay,
  className = "",
  gradient = false,
}: {
  text: string;
  delay: number;
  className?: string;
  gradient?: boolean;
}) {
  const transition = { duration: 0.9, ease: EASE_OUT };
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <span className="sr-only">{text}</span>
      {gradient ? (
        // background-clip: text doesn't survive per-letter transforms, so the gradient word slides up as one.
        <motion.span
          aria-hidden
          className="text-gradient inline-block"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ ...transition, delay }}
        >
          {text}
        </motion.span>
      ) : (
        <span aria-hidden className="inline-block">
          {text.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ ...transition, delay: delay + i * 0.035 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </span>
      )}
    </span>
  );
}

function HudPanel({ feature, index, p }: { feature: HeroFeature; index: number; p: MotionValue<number> }) {
  const start = 0.13 + index * 0.085;
  const left = feature.side === "left";
  const dir = left ? -1 : 1;

  const opacity = useTransform(p, [start, start + 0.05, DIVE, DIVE + 0.05], [0, 1, 1, 0]);
  const x = useTransform(p, [start, start + 0.07, DIVE, DIVE + 0.06], [36 * dir, 0, 0, 160 * dir]);
  const clipPath = useTransform(
    p,
    [start, start + 0.07],
    left ? ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"],
  );
  const line = useTransform(p, [start + 0.05, start + 0.1], [0, 1]);

  return (
    <motion.div style={{ opacity, x }} className={`relative md:absolute md:w-[clamp(220px,21vw,300px)] ${feature.position}`}>
      <motion.div
        style={{ clipPath }}
        className="hud-corners relative rounded-sm border border-white/10 bg-bg/60 p-3 backdrop-blur-md md:p-4"
      >
        <div className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-neon md:text-[10px]">
          <span>
            [{String(index + 1).padStart(2, "0")}] {feature.code}
          </span>
          <span className="hidden items-center gap-1.5 text-signal md:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-signal" /> Live
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted md:text-xs">{feature.label}</p>
        <p className="font-display text-sm font-semibold leading-tight md:text-xl">{feature.value}</p>
        <p className="mt-1.5 hidden text-sm leading-snug text-muted md:block">{feature.detail}</p>
      </motion.div>
      <motion.span
        style={{ scaleX: line }}
        className={`absolute top-1/2 hidden h-px w-[6vw] md:block ${
          left ? "left-full origin-left bg-linear-to-r" : "right-full origin-right bg-linear-to-l"
        } from-neon to-transparent`}
        aria-hidden
      />
    </motion.div>
  );
}

// Shown instead of the scroll animation when the visitor prefers reduced motion.
function StaticFeatures() {
  return (
    <section aria-label="Highlights" className="mx-auto grid max-w-6xl gap-3 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
      {heroFeatures.map((f, i) => (
        <div key={f.code} className="hud-corners rounded-sm border border-white/10 bg-surface p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
            [{String(i + 1).padStart(2, "0")}] {f.code}
          </p>
          <p className="mt-2 text-xs text-muted">{f.label}</p>
          <p className="font-display text-xl font-semibold">{f.value}</p>
          <p className="mt-1.5 text-sm text-muted">{f.detail}</p>
        </div>
      ))}
    </section>
  );
}
