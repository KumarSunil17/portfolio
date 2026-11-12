"use client";

import { useEffect, useRef } from "react";
import { marqueeTiles, type MarqueeTile } from "@/data/portfolio";

const TILE_WIDTH = 420;
const GAP = 12; // Tailwind gap-3

// Numbered once across both rows so the tiles keep a stable index.
const numbered = marqueeTiles.map((tile, i) => ({ ...tile, index: i + 1 }));
const rowOne = numbered.slice(0, 11);
const rowTwo = numbered.slice(11);

type NumberedTile = MarqueeTile & { index: number };

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const first = rowOneRef.current;
    const second = rowTwoRef.current;
    if (!section || !first || !second) return;

    let frame = 0;

    // Rows are driven straight from the scroll position, so write transforms
    // to the DOM instead of re-rendering on every scroll event.
    const update = () => {
      frame = 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      first.style.transform = `translateX(${offset - 200}px)`;
      second.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // Purely decorative (the same words appear elsewhere on the page), so hide it from assistive tech.
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="overflow-hidden bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <Row rowRef={rowOneRef} tiles={rowOne} />
        <Row rowRef={rowTwoRef} tiles={rowTwo} />
      </div>
    </section>
  );
}

function Row({
  rowRef,
  tiles,
}: {
  rowRef: React.RefObject<HTMLDivElement | null>;
  tiles: NumberedTile[];
}) {
  // Three copies, shifted left by one copy, so the middle copy fills the screen
  // and there is always a tile on both sides as the row slides either way.
  const tiled = [...tiles, ...tiles, ...tiles];
  const copyWidth = tiles.length * (TILE_WIDTH + GAP);

  return (
    <div
      ref={rowRef}
      className="flex w-max gap-3"
      style={{ marginLeft: -copyWidth, willChange: "transform" }}
    >
      {tiled.map((tile, i) => (
        <Tile key={i} tile={tile} />
      ))}
    </div>
  );
}

function Tile({ tile }: { tile: NumberedTile }) {
  const phrase = tile.kind === "phrase";

  return (
    <div
      className={`flex h-[270px] w-[420px] shrink-0 flex-col justify-between rounded-2xl p-6 sm:p-7 ${
        phrase ? "text-white" : "border border-[#D7E2EA]/15"
      }`}
      style={{
        background: phrase
          ? "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)"
          : "linear-gradient(160deg, #0a1a2e 0%, #0C0C0C 85%)",
      }}
    >
      <span className="text-sm font-light tracking-widest uppercase opacity-50">
        {String(tile.index).padStart(2, "0")}
      </span>
      <span
        className={`text-[2.6rem] leading-[0.95] font-black tracking-tight uppercase ${
          phrase ? "" : "hero-heading"
        }`}
      >
        {tile.label}
      </span>
    </div>
  );
}
