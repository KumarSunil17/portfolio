"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/data/profile";

type Card =
  | { kind: "project"; name: string; tagline: string; colors: [string, string]; screenshot?: string }
  | { kind: "image"; src: string; label: string; caption: string; position?: string }
  | { kind: "text"; code: string; value: string; detail: string };

const project = (name: string): Card => {
  const p = projects.find((x) => x.name === name)!;
  return { kind: "project", name: p.name, tagline: p.tagline, colors: p.colors, screenshot: p.screenshot };
};

// Twelve faces around the orbit: shipped products, the process, and what I bring.
const CARDS: Card[] = [
  project("Fiole"),
  { kind: "image", src: "/images/process/02.webp", label: "02 · Design", caption: "Every screen, mapped" },
  { kind: "text", code: "Vision", value: "Idea → Product", detail: "Sketch to store" },
  project("Fitrivo"),
  { kind: "image", src: "/images/vr-hero.png", label: "XR", caption: "Unity · Meta Quest", position: "60% 30%" },
  project("PGfy"),
  { kind: "text", code: "Track record", value: "5+ years", detail: "Shipping since 2019" },
  { kind: "image", src: "/images/process/03.webp", label: "03 · Build", caption: "Flutter · RN · Unity" },
  project("Ruchi Store"),
  { kind: "text", code: "Under one roof", value: "Mobile · Web · XR", detail: "One partner" },
  { kind: "image", src: "/images/process/01.webp", label: "01 · Discover", caption: "Scope the MVP" },
  { kind: "image", src: "/images/process/04.webp", label: "04 · Launch", caption: "Live on the stores" },
];

const STEP = 360 / CARDS.length;

/** Card width and orbit radius for the current viewport. */
function useRingSize() {
  const [size, setSize] = useState({ w: 230, r: 700 });
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const w = Math.round(Math.min(280, Math.max(128, vw * (vw < 768 ? 0.34 : 0.16))));
      // Spread the cards further than they'd need edge-to-edge so the orbit reads as airy.
      const r = Math.round(((w * CARDS.length) / (2 * Math.PI)) * (vw < 768 ? 1.35 : 1.65));
      setSize({ w, r });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return size;
}

type Props = {
  /** Continuous spin, degrees. */
  angle: MotionValue<number>;
  /** Forward tilt of the orbit, degrees (negative = seen from above). */
  tilt: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
};

export default function CardRing({ angle, tilt, scale, y, opacity }: Props) {
  const { w, r } = useRingSize();
  const h = Math.round(w * 0.68);

  const transform = useTransform([angle, tilt, scale, y], ([a, t, s, ty]: number[]) =>
    `translate3d(0, ${ty}px, ${-r}px) scale(${s}) rotateX(${t}deg) rotateY(${a}deg)`,
  );

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 [perspective:1300px] [perspective-origin:50%_38%]"
      aria-hidden
    >
      <motion.div
        style={{ transform }}
        className="absolute left-1/2 top-[40%] size-0 [transform-style:preserve-3d] will-change-transform md:top-[44%]"
      >
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="absolute [transform-style:preserve-3d]"
            style={{
              width: w,
              height: h,
              left: -w / 2,
              top: -h / 2,
              transform: `rotateY(${i * STEP}deg) translateZ(${r}px)`,
            }}
          >
            <Face card={card} />
            <Back index={i} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

const face =
  "absolute inset-0 overflow-hidden rounded-[14px] border border-white/10 [backface-visibility:hidden] shadow-[0_30px_60px_-25px_rgb(0_0_0/0.9)]";

function Face({ card }: { card: Card }) {
  if (card.kind === "project") {
    const [c1, c2] = card.colors;
    return (
      <div
        className={face}
        style={{
          background: `radial-gradient(120% 140% at 0% 0%, ${c1}88, transparent 60%), radial-gradient(120% 140% at 100% 100%, ${c2}77, transparent 60%), #0b0d16`,
        }}
      >
        <div className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.25em] text-white/70 md:text-[9px]">
          Shipped
        </div>
        <p className="absolute bottom-3 left-3 max-w-[52%] font-serif text-lg leading-none text-white md:text-2xl">
          {card.name}
        </p>
        {card.screenshot && (
          <div className="absolute -bottom-[38%] right-[8%] aspect-[9/19] w-[34%] rotate-[-10deg] overflow-hidden rounded-[10px] border border-white/30 bg-black p-[3px] shadow-[0_20px_40px_-10px_rgb(0_0_0/0.8)]">
            <div className="relative h-full w-full overflow-hidden rounded-[7px]">
              <Image src={card.screenshot} alt="" fill sizes="110px" className="object-cover object-top" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (card.kind === "image") {
    return (
      <div className={`${face} bg-surface`}>
        <Image
          src={card.src}
          alt=""
          fill
          sizes="280px"
          className="object-cover"
          style={card.position ? { objectPosition: card.position } : undefined}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-neon md:text-[9px]">{card.label}</span>
          <span className="text-right text-[9px] text-white/75 md:text-[11px]">{card.caption}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${face} flex flex-col justify-between bg-[#0c0f1a]/95 p-3 md:p-4`}>
      <div className="bg-dots absolute inset-0 opacity-60" />
      <span className="relative flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.25em] text-neon md:text-[9px]">
        <span className="size-1 rounded-full bg-signal" /> {card.code}
      </span>
      <div className="relative">
        <p className="font-serif text-xl italic leading-none text-white md:text-3xl">{card.value}</p>
        <p className="mt-1.5 text-[9px] text-muted md:text-[11px]">{card.detail}</p>
      </div>
    </div>
  );
}

// What you see of a card while it travels round the far side of the orbit.
function Back({ index }: { index: number }) {
  return (
    <div
      className={`${face} grid place-items-center bg-[#0a0c14] [transform:rotateY(180deg)]`}
      style={{ boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.04)" }}
    >
      <div className="bg-dots absolute inset-0 opacity-50" />
      <span className="relative font-mono text-[9px] tracking-[0.3em] text-white/35">
        [SKM]·{String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
