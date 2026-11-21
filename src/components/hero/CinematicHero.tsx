"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { LuArrowDown, LuArrowUpRight, LuPhone } from "react-icons/lu";
import { actions, profile } from "@/data/profile";
import AvatarReveal from "../ui/AvatarReveal";
import { usePrefersReducedMotion } from "../ui/usePrefersReducedMotion";
import { EASE_OUT } from "../ui/motion";
import CardRing from "./CardRing";

const SPIN = 5.5; // idle orbit speed, degrees per second
// Where on the avatar the touch autopilot wanders: around the face and collar.
const AUTOPILOT_AREA = { x: 0.32, y: 0.1, w: 0.36, h: 0.44 };

export default function CinematicHero() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  const { scrollY, scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const velocity = useVelocity(scrollY);

  // Pointer, normalised to -1..1 across the hero, for gentle parallax.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  // The solid cursor dot follows the pointer 1:1.
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const [cursor, setCursor] = useState(false);

  // --- orbit ------------------------------------------------------------------
  const spin = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    // Scrolling winds the orbit up, then it eases back to its idle drift.
    const boost = 1 + Math.min(8, Math.abs(velocity.get()) / 250);
    spin.set(spin.get() + (Math.min(delta, 64) / 1000) * SPIN * boost);
  });
  const angle = useTransform([spin, p, smx], ([s, v, x]: number[]) => s + v * 120 + x * 10);
  const tilt = useTransform([p, smy], ([v, y]: number[]) => -9 - v * 16 + y * 3);
  const ringScale = useTransform(p, [0, 1], [1, 1.55]);
  const ringY = useTransform(p, [0, 1], [0, -120]);
  const ringOpacity = useTransform(p, [0.55, 0.9], [1, 0]);
  // With reduced motion the hero doesn't scroll-pin, so its progress is meaningless: hold the orbit still.
  const still = { one: useMotionValue(1), zero: useMotionValue(0), tilt: useMotionValue(-9) };

  // --- scroll choreography -------------------------------------------------------
  const copyOpacity = useTransform(p, [0, 0.18], [1, 0]);
  const copyY = useTransform(p, [0, 0.18], [0, 60]);
  const copyBlur = useTransform(p, [0, 0.18], ["blur(0px)", "blur(10px)"]);
  const copyPointer = useTransform(copyOpacity, (o) => (o < 0.2 ? "none" : "auto"));

  const leftX = useTransform([p, smx], ([v, x]: number[]) => `calc(${-v * 22}vw + ${x * -10}px)`);
  const rightX = useTransform([p, smx], ([v, x]: number[]) => `calc(${v * 22}vw + ${x * -10}px)`);
  const mastY = useTransform(p, [0, 1], ["0svh", "-14svh"]);
  const mastOpacity = useTransform(p, [0.3, 0.7], [1, 0]);

  const avatarScale = useTransform(p, [0, 1], [1, 0.84]);
  const avatarY = useTransform(p, [0, 1], ["0svh", "8svh"]);
  const avatarOpacity = useTransform(p, [0.7, 0.95], [1, 0]);

  // Hand-off to the indigo stats section that follows.
  const flood = useTransform(p, [0.78, 1], [0, 1]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    if (e.pointerType === "mouse") {
      cx.set(e.clientX);
      cy.set(e.clientY);
      if (!cursor) setCursor(true);
    }
  };

  const intro = (delay: number) =>
    ({
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.9, ease: EASE_OUT },
    }) as const;

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        setCursor(false);
      }}
      className={reduce ? "relative h-svh" : "relative h-[230vh]"}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-bg">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[38%] size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(155_107_255/0.22),transparent_60%)]" />
          <div className="absolute left-1/2 top-[48%] size-[44vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(45_226_255/0.14),transparent_62%)]" />
          <div className="bg-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_40%,#000,transparent_70%)]" />
        </div>

        {/* Floating card orbit */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.8, ease: EASE_OUT }}
        >
          {reduce ? (
            <CardRing angle={still.zero} tilt={still.tilt} scale={still.one} y={still.zero} opacity={still.one} />
          ) : (
            <CardRing angle={angle} tilt={tilt} scale={ringScale} y={ringY} opacity={ringOpacity} />
          )}
        </motion.div>

        {/* Masthead — flanks the head on desktop, stacks above it on mobile */}
        <motion.div
          style={reduce ? undefined : { y: mastY, opacity: mastOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[12svh] flex select-none flex-col items-center font-serif leading-[0.8] tracking-[-0.02em] text-ink lg:top-[20svh] lg:flex-row lg:justify-center lg:gap-[min(29svh,15.5vw)]"
          aria-hidden
        >
          <motion.span style={reduce ? undefined : { x: leftX }} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block text-[min(24vw,13svh)] lg:text-[min(14vw,26svh)]"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.35, duration: 1.2, ease: EASE_OUT }}
            >
              Sunil
            </motion.span>
          </motion.span>
          <motion.span style={reduce ? undefined : { x: rightX }} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block italic text-[min(24vw,13svh)] lg:text-[min(14vw,26svh)]"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.5, duration: 1.2, ease: EASE_OUT }}
            >
              Kumar
            </motion.span>
          </motion.span>
        </motion.div>

        {/* Centre avatar — hover / drag to switch into XR mode */}
        <motion.div
          style={reduce ? undefined : { scale: avatarScale, y: avatarY, opacity: avatarOpacity }}
          className="absolute bottom-0 left-1/2 aspect-[11/10] h-[min(58svh,110vw)] origin-bottom -translate-x-1/2 lg:h-[min(86svh,46vw)]"
        >
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.15, duration: 1.4, ease: EASE_OUT }}
          >
            {/* Rim glow so the dark polo still separates from the background */}
            <div className="pointer-events-none absolute inset-x-[12%] bottom-0 top-[8%] rounded-t-full bg-[radial-gradient(ellipse_at_50%_35%,rgb(155_107_255/0.28),transparent_65%)] blur-2xl" />
            <AvatarReveal
              front="/images/avatar/front.webp"
              back="/images/avatar/back.webp"
              alt={`${profile.name} smiling in glasses; under the brush he appears wearing a Meta Quest VR headset`}
              trackRef={sectionRef}
              autopilotArea={AUTOPILOT_AREA}
              className="h-full w-full md:cursor-none"
            />
          </motion.div>
        </motion.div>

        {/* Bottom scrim keeps the copy readable where it overlaps the avatar */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-bg via-bg/75 to-transparent lg:h-[30%] lg:from-bg/90 lg:via-bg/30"
          aria-hidden
        />

        {/* Copy */}
        <motion.div
          style={reduce ? undefined : { opacity: copyOpacity, y: copyY, filter: copyBlur, pointerEvents: copyPointer }}
          className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-5 pb-7 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:pb-10"
        >
          <div className="max-w-[460px] lg:max-w-[min(27vw,420px)]">
            <motion.p
              {...intro(0.7)}
              className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neon md:mb-4 md:text-[11px]"
            >
              <span className="size-1.5 rounded-full bg-signal shadow-[0_0_12px] shadow-signal" />
              Co-founder · {profile.company}
            </motion.p>
            <motion.h1 {...intro(0.8)} className="leading-[0.9]">
              <span className="sr-only">{profile.name} — </span>
              <span className="block font-display text-[clamp(1.5rem,2.5vw,2.6rem)] font-black uppercase tracking-tight">
                Your next
              </span>
              <span className="text-gradient block pb-1 font-serif text-[clamp(2.6rem,4.4vw,4.6rem)] italic">
                tech partner
              </span>
            </motion.h1>
            <motion.p
              {...intro(0.95)}
              className="mt-4 hidden max-w-sm text-sm leading-relaxed text-ink/75 sm:block md:text-[15px]"
            >
              {profile.tagline}
            </motion.p>
            <motion.div {...intro(1.1)} className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3 lg:flex-nowrap">
              <a
                href={actions.startProject}
                className="group flex items-center gap-2 rounded-full bg-ink px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg transition hover:bg-neon sm:px-5 sm:tracking-[0.2em]"
              >
                Start a project
                <LuArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={actions.call}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-bg/40 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-md transition hover:border-neon hover:text-neon sm:px-5 sm:tracking-[0.2em]"
              >
                <LuPhone /> Let&apos;s call
              </a>
            </motion.div>
          </div>

          <motion.div
            {...intro(1.25)}
            className="hidden flex-col items-end gap-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted lg:flex"
          >
            <p className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-neon/70" />
                <span className="relative size-2 rounded-full bg-neon" />
              </span>
              <span className="[@media(pointer:coarse)]:hidden">Hover me — switch to XR mode</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Drag across me — XR mode</span>
            </p>
            <p className="flex items-center gap-3">
              Scroll
              <span className="grid size-9 place-items-center rounded-full border border-white/15">
                <motion.span
                  animate={reduce ? undefined : { y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LuArrowDown className="text-neon" />
                </motion.span>
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Mobile hint, tucked under the masthead */}
        <motion.p
          {...intro(1.3)}
          style={reduce ? undefined : { opacity: copyOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[calc(12svh+min(42vw,23svh))] text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted lg:hidden"
        >
          Drag across me — XR mode
        </motion.p>

        {/* Flood into the next section's colour */}
        {!reduce && <motion.div style={{ opacity: flood }} className="pointer-events-none absolute inset-0 bg-indigo" aria-hidden />}

        {/* Solid cursor dot (mouse only) */}
        <motion.div
          style={{ x: cx, y: cy }}
          className={`pointer-events-none fixed left-0 top-0 z-[60] -ml-2.5 -mt-2.5 size-5 rounded-full bg-white mix-blend-difference transition-opacity duration-300 ${
            cursor && inView ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      </div>
    </section>
  );
}
