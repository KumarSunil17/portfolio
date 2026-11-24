"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/*
 * Pointer-reveal avatar.
 *
 * Two registered images: FRONT is what you see; BACK is painted in wherever the pointer's
 * organic brush trail currently is. Each stamp lives ~1.1s, then shrinks away and the
 * FRONT image returns.
 *
 * Layers (all canvases share the same pixel size):
 *   mask  (offscreen) — every live brush lobe, filled solid
 *   back  (offscreen) — BACK image clipped to the mask ("source-in")
 *   main  (on screen) — FRONT image, mask punched out ("destination-out"), then `back` on top
 *
 * Punching the mask out of FRONT before laying BACK over it means FRONT can never show
 * through transparent parts of BACK (e.g. where the two cut-out silhouettes differ).
 */

const LIFETIME = 1100; // ms a stamp stays alive
const HOLD = 0.32; // fraction of the lifetime a stamp keeps full size before shrinking
const GROW = 90; // ms for a fresh stamp to swell to full size
const SIZE_DESKTOP = 0.09; // brush radius, as a fraction of the avatar's width (a wide bust: ~12% of the head-and-shoulders span)
const SIZE_MOBILE = 0.11;
const STEP = 0.03; // interpolation spacing, fraction of avatar width
const MAX_STEPS = 40; // interpolated stamps per pointer move
const IDLE_AUTOPILOT = 2500; // ms without input before touch devices get an automatic sweep
const AUTOPILOT_RUN = 3600; // ms per sweep; then it rests for another idle period
const MAX_DPR = 2;

type Lobe = { dx: number; dy: number; r: number };
type Stamp = { x: number; y: number; r: number; born: number; lobes: Lobe[] };
type Point = { x: number; y: number };

/** One registered FRONT/BACK pair at a given pixel width. */
export type AvatarSource = { width: number; front: string; back: string };

type Props = {
  /** The same pair at several sizes; the smallest that covers the box at the device's pixel ratio is used. */
  sources: AvatarSource[];
  /** `sizes` for the static fallback image, describing the box's rendered width. */
  sizes: string;
  /** Accessible description of the avatar. */
  alt: string;
  /** Element whose pointer movement drives the brush (defaults to the avatar itself). */
  trackRef?: RefObject<HTMLElement | null>;
  className?: string;
  /** Rect (fractions of the avatar box) the touch autopilot wanders inside. */
  autopilotArea?: { x: number; y: number; w: number; h: number };
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Cover-fit, bottom-aligned, horizontally centred — identical for both images so they stay registered. */
function coverBottom(iw: number, ih: number, cw: number, ch: number) {
  const s = Math.max(cw / iw, ch / ih);
  const w = iw * s;
  const h = ih * s;
  return { x: (cw - w) / 2, y: ch - h, w, h };
}

/** A brush stamp made of a few overlapping circles, so its edge is irregular rather than a clean disc. */
function makeStamp(x: number, y: number, r: number, born: number): Stamp {
  const lobes: Lobe[] = [{ dx: 0, dy: 0, r: r * (0.78 + Math.random() * 0.2) }];
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = r * (0.25 + Math.random() * 0.45);
    lobes.push({ dx: Math.cos(a) * d, dy: Math.sin(a) * d, r: r * (0.38 + Math.random() * 0.36) });
  }
  return { x, y, r, born, lobes };
}

const bySize = (sources: AvatarSource[]) => [...sources].sort((a, b) => a.width - b.width);

export default function AvatarReveal({ sources, sizes, alt, trackRef, className = "", autopilotArea }: Props) {
  const fallback = bySize(sources);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  // Read through a ref so a new object literal each render doesn't restart the effect.
  const areaRef = useRef(autopilotArea);
  useEffect(() => {
    areaRef.current = autopilotArea;
  }, [autopilotArea]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    let disposed = false;
    let frontImg: HTMLImageElement | null = null;
    let backImg: HTMLImageElement | null = null;

    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d")!;
    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d")!;

    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let stamps: Stamp[] = [];
    let last: Point | null = null; // last brush point, avatar-local CSS px
    let raf = 0;
    let visible = true;
    let lastInput = performance.now();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const touchCapable = navigator.maxTouchPoints > 0 || coarse.matches;
    const brushSize = () => (coarse.matches || cssW < 520 ? SIZE_MOBILE : SIZE_DESKTOP) * cssW;

    const resize = () => {
      const r = box.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      for (const c of [canvas, mask, buffer]) {
        if (c.width !== w || c.height !== h) {
          c.width = w;
          c.height = h;
        }
      }
      draw(performance.now());
    };

    // --- rendering -------------------------------------------------------------
    const draw = (now: number) => {
      if (!frontImg || !backImg) return;
      const W = canvas.width;
      const H = canvas.height;
      const f = coverBottom(frontImg.naturalWidth, frontImg.naturalHeight, W, H);
      const b = coverBottom(backImg.naturalWidth, backImg.naturalHeight, W, H);

      stamps = stamps.filter((s) => now - s.born < LIFETIME);

      // High-quality resampling for the large source images (resizing a canvas resets this, so set it per draw).
      ctx.imageSmoothingQuality = "high";
      bctx.imageSmoothingQuality = "high";
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(frontImg, f.x, f.y, f.w, f.h);
      if (!stamps.length) return;

      // 1. Mask: every live lobe, hard-edged.
      mctx.clearRect(0, 0, W, H);
      mctx.fillStyle = "#000";
      mctx.beginPath();
      for (const s of stamps) {
        const age = now - s.born;
        const t = age / LIFETIME;
        const grow = Math.min(1, age / GROW);
        const shrink = t < HOLD ? 1 : 1 - easeInOut((t - HOLD) / (1 - HOLD));
        const k = (0.55 + 0.45 * grow) * shrink * dpr;
        if (k <= 0.01) continue;
        for (const l of s.lobes) {
          const cx = (s.x + l.dx * shrink) * dpr;
          const cy = (s.y + l.dy * shrink) * dpr;
          const r = l.r * k;
          mctx.moveTo(cx + r, cy);
          mctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
      }
      mctx.fill();

      // 2. Erase FRONT inside the mask.
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(mask, 0, 0);

      // 3. BACK, clipped to the same mask.
      bctx.globalCompositeOperation = "source-over";
      bctx.clearRect(0, 0, W, H);
      bctx.drawImage(mask, 0, 0);
      bctx.globalCompositeOperation = "source-in";
      bctx.drawImage(backImg, b.x, b.y, b.w, b.h);

      // 4. Composite.
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(buffer, 0, 0);
    };

    // --- input -------------------------------------------------------------------
    const local = (clientX: number, clientY: number): Point => {
      const r = box.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const inside = (p: Point, pad: number) => p.x > -pad && p.y > -pad && p.x < cssW + pad && p.y < cssH + pad;

    const brushTo = (p: Point, now: number) => {
      const size = brushSize();
      const pad = size * 1.5;
      if (!inside(p, pad)) {
        last = null;
        return;
      }
      if (last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const dist = Math.hypot(dx, dy);
        const step = Math.max(2, STEP * cssW);
        const n = Math.min(MAX_STEPS, Math.floor(dist / step));
        for (let i = 1; i <= n; i++) {
          const t = i / (n + 1);
          const jitter = size * 0.12;
          stamps.push(
            makeStamp(
              last.x + dx * t + (Math.random() - 0.5) * jitter,
              last.y + dy * t + (Math.random() - 0.5) * jitter,
              size * (0.85 + Math.random() * 0.3),
              now,
            ),
          );
        }
      }
      stamps.push(makeStamp(p.x, p.y, size * (0.9 + Math.random() * 0.25), now));
      last = p;
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (!frontImg) return;
      const now = performance.now();
      lastInput = now;
      brushTo(local(e.clientX, e.clientY), now);
    };

    const onLeave = () => {
      last = null;
    };

    // A vertical swipe hands the gesture to the browser (pointercancel), but touchmove keeps
    // firing passively while the page scrolls, so the brush can follow the finger without
    // ever blocking the scroll.
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || !frontImg) return;
      const now = performance.now();
      lastInput = now;
      brushTo(local(t.clientX, t.clientY), now);
    };
    const onTouchEnd = () => {
      last = null;
    };

    // --- touch autopilot -------------------------------------------------------------
    let autoStart = 0;
    let autoPhase = 0; // seconds of wander already travelled, so each sweep continues the path
    let autoLast: Point | null = null;
    const autopilot = (now: number) => {
      if (!touchCapable || reduceMotion.matches || !visible) return false;
      if (now - lastInput < IDLE_AUTOPILOT) {
        autoLast = null;
        return false;
      }
      if (!autoLast) autoStart = now;
      if (now - autoStart > AUTOPILOT_RUN) {
        // Rest: treat the end of a sweep like fresh input so the next one waits its turn.
        autoPhase += (now - autoStart) / 1000;
        autoLast = null;
        lastInput = now;
        return false;
      }
      const a = areaRef.current ?? { x: 0.22, y: 0.12, w: 0.56, h: 0.5 };
      const t = autoPhase + (now - autoStart) / 1000;
      // Lissajous wander: stays inside the area, never repeats exactly.
      const u = 0.5 + 0.5 * Math.sin(t * 1.1);
      const v = 0.5 + 0.5 * Math.sin(t * 0.73 + 1.2);
      const p = { x: (a.x + a.w * u) * cssW, y: (a.y + a.h * v) * cssH };
      // Reuse the brush, but keep the autopilot's own "last" so it never joins a real touch.
      const prev = last;
      last = autoLast;
      brushTo(p, now);
      autoLast = last;
      last = prev;
      return true;
    };

    // --- loop ----------------------------------------------------------------------
    const tick = (now: number) => {
      raf = 0;
      const auto = autopilot(now);
      draw(now);
      // The autopilot's brush may already have kicked a frame; never queue two, or the loop multiplies.
      if ((stamps.length || auto) && !raf) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    // Wake periodically on touch devices so the autopilot can begin after the idle delay.
    const idleTimer = touchCapable ? window.setInterval(kick, 600) : 0;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(box);

    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const target = trackRef?.current ?? box;
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerdown", onMove);
    target.addEventListener("pointerleave", onLeave);
    target.addEventListener("pointercancel", onTouchEnd);
    target.addEventListener("touchmove", onTouchMove, { passive: true });
    target.addEventListener("touchend", onTouchEnd, { passive: true });

    // Reuse whichever size the fallback <img> already fetched (no second download of FRONT);
    // otherwise take the smallest pair that covers the box at the canvas' pixel ratio.
    const sized = bySize(sources);
    const current = imgRef.current?.currentSrc;
    const need = box.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const pair =
      (current ? sized.find((s) => current.endsWith(s.front)) : undefined) ??
      sized.find((s) => s.width >= need) ??
      sized[sized.length - 1];

    Promise.all([loadImage(pair.front), loadImage(pair.back)])
      .then(async ([f, b]) => {
        await Promise.all([f.decode?.().catch(() => {}), b.decode?.().catch(() => {})]);
        if (disposed) return;
        frontImg = f;
        backImg = b;
        resize();
        setReady(true);
      })
      .catch(() => {
        // Leave the static <img> fallback in place.
      });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (idleTimer) window.clearInterval(idleTimer);
      io.disconnect();
      ro.disconnect();
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onMove);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener("pointercancel", onTouchEnd);
      target.removeEventListener("touchmove", onTouchMove);
      target.removeEventListener("touchend", onTouchEnd);
    };
    // Callers pass a stable (module-level) `sources` array, so this runs once.
  }, [sources, trackRef]);

  return (
    <div ref={boxRef} role="img" aria-label={alt} className={`relative touch-pan-y select-none ${className}`}>
      {/* Static FRONT until both images are decoded (and for no-JS). Same cover/bottom fit as the canvas. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- must match the canvas' raw pixels exactly */}
      <img
        ref={imgRef}
        src={fallback[0].front}
        srcSet={fallback.map((s) => `${s.front} ${s.width}w`).join(", ")}
        sizes={sizes}
        alt=""
        aria-hidden
        draggable={false}
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full object-cover object-bottom transition-opacity duration-300 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
