"use client";

import { useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { LuArrowUp } from "react-icons/lu";
import { profile } from "@/data/profile";

export default function Footer() {
  const lenis = useLenis();
  // Read on the client so the static page never shows a stale build-time year.
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null,
  );

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-5 py-10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:flex-row md:items-center md:px-10">
        <p>
          © {year} {profile.name}
        </p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal" /> Built with Next.js &amp; Motion
        </p>
        <button
          type="button"
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="group flex items-center gap-2 transition-colors hover:text-neon"
        >
          Back to top
          <LuArrowUp className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
      <p
        aria-hidden
        className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center font-display text-[17vw] font-black uppercase leading-[0.8] text-white/[0.03]"
      >
        {profile.firstName}
      </p>
    </footer>
  );
}
