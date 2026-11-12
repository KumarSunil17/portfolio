"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { LuArrowUpRight, LuMenu, LuPhone, LuX } from "react-icons/lu";
import { actions, navLinks } from "@/data/profile";
import { EASE_OUT } from "./ui/motion";

export default function Navbar() {
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > prev && y > 200 && !open);
  });

  // Highlight the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navLinks) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const target = `#${id}`;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
          <a href="#top" onClick={go("top")} className="group flex items-center gap-2 font-mono text-sm tracking-[0.2em]">
            <span className="text-neon transition-transform group-hover:-translate-x-0.5">[</span>
            <span className="font-semibold">SKM</span>
            <span className="text-neon transition-transform group-hover:translate-x-0.5">]</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    active === l.id ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full border border-neon/30 bg-neon/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={actions.startProject}
              className="group hidden items-center gap-2 rounded-full border border-neon/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neon transition hover:bg-neon hover:text-bg sm:flex"
            >
              Start a project
              <LuArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-lg md:hidden"
            >
              {open ? <LuX /> : <LuMenu />}
            </button>
          </div>
        </nav>
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-neon via-ultra to-flare"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-28 md:hidden"
          >
            <div className="pointer-events-none absolute -right-20 top-10 size-80 rounded-full bg-ultra/25 blur-[100px]" />
            <ul className="relative space-y-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE_OUT }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="flex items-baseline gap-4 py-2 font-display text-4xl font-black uppercase"
                  >
                    <span className="font-mono text-xs text-neon">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT }}
              className="relative grid gap-3"
            >
              <a
                href={actions.startProject}
                className="flex items-center justify-center gap-2 rounded-full bg-neon py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-bg"
              >
                Start a project <LuArrowUpRight />
              </a>
              <a
                href={actions.call}
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-4 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <LuPhone /> Let&apos;s call
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
