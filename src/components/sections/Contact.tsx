"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { LuArrowUpRight, LuCheck, LuCopy, LuDownload, LuMail, LuPhone } from "react-icons/lu";
import { SiGithub, SiGitlab } from "react-icons/si";
import { actions, profile } from "@/data/profile";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const channels: { label: string; action: string; href: string; Icon: IconType; download?: boolean }[] = [
  { label: "LinkedIn", action: "Connect with me", href: profile.socials.linkedin, Icon: FaLinkedinIn },
  { label: "GitHub", action: "Explore my code", href: profile.socials.github, Icon: SiGithub },
  { label: "GitLab", action: "More repositories", href: profile.socials.gitlab, Icon: SiGitlab },
  { label: "Résumé", action: "Download CV", href: profile.cv, Icon: LuDownload, download: true },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = actions.startProject;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] overflow-hidden" aria-hidden>
        <div className="grid-floor absolute inset-x-[-50%] top-0 h-full animate-floor opacity-40" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[50vmax] -translate-x-1/2 rounded-full bg-ultra/15 blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeading index="05" kicker="Multiplayer" title="Got an idea? Let's build it." />
        <Reveal className="mt-8 max-w-xl text-lg text-ink/75 md:text-xl">
          Bring the idea — I&apos;ll bring the strategy, the team and the tech to turn it into a product people love.
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-[1.35fr_1fr]">
          <Reveal delay={0.05}>
            <Magnetic>
              <ActionTile
                href={actions.startProject}
                kicker="Tell me about your idea"
                title="Start a project"
                Icon={LuMail}
                primary
              />
            </Magnetic>
          </Reveal>
          <Reveal delay={0.12}>
            <Magnetic>
              <ActionTile href={actions.call} kicker="Talk it through, voice to voice" title="Let's call" Icon={LuPhone} />
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-5">
          <button
            type="button"
            onClick={copyEmail}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition hover:text-neon"
          >
            {copied ? <LuCheck className="text-signal" /> : <LuCopy />}
            <span aria-live="polite">{copied ? "Email address copied" : "Prefer to write later? Copy my email"}</span>
          </button>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ label, action, href, Icon, download }, i) => {
            const external = href.startsWith("http");
            return (
              <Reveal as="li" key={label} delay={i * 0.06} className="bg-bg">
                <a
                  href={href}
                  download={download || undefined}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-xl border border-white/10 text-lg text-neon transition-colors group-hover:border-neon/50">
                      <Icon />
                    </span>
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
                      <span className="mt-0.5 block text-sm">{action}</span>
                    </span>
                  </span>
                  <LuArrowUpRight
                    className={`text-muted transition-transform duration-300 group-hover:text-neon ${
                      download ? "rotate-90 group-hover:translate-y-0.5" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    }`}
                  />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ActionTile({
  href,
  kicker,
  title,
  Icon,
  primary = false,
}: {
  href: string;
  kicker: string;
  title: string;
  Icon: IconType;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl p-7 md:min-h-[260px] md:p-10 ${
        primary
          ? "bg-neon text-bg shadow-[0_0_60px_-12px] shadow-neon"
          : "border border-white/15 bg-surface/70 backdrop-blur-md hover:border-neon/60"
      }`}
    >
      {/* Sweep that fills the tile on hover */}
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 ${
          primary ? "bg-white" : "bg-neon/10"
        }`}
      />
      <span className="relative flex items-start justify-between">
        <span
          className={`grid size-14 place-items-center rounded-2xl text-2xl transition-transform duration-500 group-hover:-rotate-12 ${
            primary ? "bg-bg text-neon" : "border border-neon/40 text-neon"
          }`}
        >
          <Icon />
        </span>
        <LuArrowUpRight className="text-3xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-45" />
      </span>
      <span className="relative">
        <span
          className={`block font-mono text-[11px] uppercase tracking-[0.25em] ${primary ? "text-bg/70" : "text-muted"}`}
        >
          {kicker}
        </span>
        <span className="mt-2 block font-display text-4xl font-black uppercase leading-none md:text-6xl">{title}</span>
      </span>
    </a>
  );
}

// Pulls its child slightly toward the pointer.
function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.06);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.1);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
