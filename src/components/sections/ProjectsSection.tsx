"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import LiveProjectButton from "@/components/ui/LiveProjectButton";
import { showcaseProjects, type ShowcaseProject } from "@/data/portfolio";

const radius = "rounded-[40px] sm:rounded-[50px] md:rounded-[60px]";

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-16 text-center leading-none font-black tracking-tight uppercase sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Project
      </FadeIn>

      <div ref={container} className="mx-auto max-w-[1400px]">
        {showcaseProjects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
            total={showcaseProjects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: ShowcaseProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each card shrinks a little further the more cards have stacked on top of it.
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 h-[85vh] md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px`, transformOrigin: "top" }}
        // Top padding stays >= the 28px stack offset so a covered card only peeks out as an empty border.
        className={`relative border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 pt-8 sm:p-6 sm:pt-8 md:p-8 ${radius}`}
      >
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="shrink-0 leading-none font-black text-[#D7E2EA]"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {project.number}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-light tracking-widest text-[#D7E2EA]/60 uppercase sm:text-sm">
                {project.category}
              </p>
              <h3
                className="font-medium text-[#D7E2EA] uppercase"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {project.name}
              </h3>
              <p className="mt-1 max-w-xl text-sm font-light text-[#D7E2EA]/70 sm:text-base">
                {project.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <LiveProjectButton href={project.href} />
            {project.moreLinks.length > 0 && (
              // Capped so a long list of stores wraps instead of pushing the button onto its own row.
              <ul className="flex max-w-[15rem] flex-wrap gap-x-4 gap-y-1 sm:justify-end">
                {project.moreLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs tracking-widest text-[#D7E2EA]/70 uppercase transition-colors hover:text-[#D7E2EA]"
                    >
                      {link.label}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/*
          One phone screenshot fills three differently-shaped slots, so each slot shows a
          different band of it: the header (tall slot), the middle and the lower part.
        */}
        <div className="mt-4 grid grid-cols-[2fr_3fr] gap-3 sm:mt-6 sm:gap-4 md:mt-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Shot
              src={project.screenshot}
              position="50% 50%"
              sizes="(min-width: 1400px) 560px, 40vw"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            />
            <Shot
              src={project.screenshot}
              position="50% 88%"
              sizes="(min-width: 1400px) 560px, 40vw"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            />
          </div>
          <Shot
            src={project.screenshot}
            alt={`${project.name} app screenshot`}
            position="50% 0%"
            sizes="(min-width: 1400px) 840px, 60vw"
          />
        </div>
      </motion.article>
    </div>
  );
}

function Shot({
  src,
  alt = "",
  position,
  sizes,
  style,
}: {
  src: string;
  alt?: string;
  position: string;
  sizes: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#161616] ${radius}`} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
