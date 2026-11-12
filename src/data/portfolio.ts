// Content for the landing page. Everything about *you* (name, bio, skills, products) is derived from
// profile.ts, so edit that file to change the text. This file only shapes it for the layout.

import {
  actions,
  marquee,
  marqueeAura,
  profile,
  projects as profileProjects,
  skillGroups,
} from "./profile";

const pad = (n: number) => String(n).padStart(2, "0");

// "Contact" has no section of its own, so it opens the mail link.
export const contactHref = actions.startProject;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: contactHref },
] as const;

// ── Hero ────────────────────────────────────────────────────────────────────

export const heroTitle = `Hi, i’m ${profile.firstName.toLowerCase()}`;
// The corner text is only ~260px wide, so use the first clause of the tagline
// ("I turn your ideas into products people love"); the full line stays in the metadata.
export const heroText = profile.tagline.split(" — ")[0];

/** The floating avatar. Swap the file in public/images to change it. */
export const avatar = {
  src: "/images/portrait.png",
  width: 896,
  height: 1065,
  alt: `Portrait of ${profile.name}`,
};

// ── Marquee ─────────────────────────────────────────────────────────────────

export type MarqueeTile = { label: string; kind: "tech" | "phrase" };

// Tech names with a catch-phrase every third tile, so both rows get a mix.
function buildTiles(): MarqueeTile[] {
  const techs = [...marquee];
  const phrases = [...marqueeAura];
  const tiles: MarqueeTile[] = [];

  while (techs.length > 0 || phrases.length > 0) {
    const takePhrase = phrases.length > 0 && (techs.length === 0 || tiles.length % 3 === 2);
    const label = takePhrase ? phrases.shift()! : techs.shift()!;
    tiles.push({ label, kind: takePhrase ? "phrase" : "tech" });
  }
  return tiles;
}

export const marqueeTiles = buildTiles();

// ── About ───────────────────────────────────────────────────────────────────

export const aboutText = profile.summary;

// Decorative 3D artwork in the corners of the About section.
const decorBase =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7";

export const aboutDecor = {
  moon: `${decorBase}/moon_icon.11395d36.png`,
  object: `${decorBase}/p59_1.4659672e.png`,
  lego: `${decorBase}/lego_icon-1.703bb594.png`,
  group: `${decorBase}/Group_134-1.2e04f3ce.png`,
};

// ── Services (your skill groups) ────────────────────────────────────────────

export const services = skillGroups.map((group, i) => ({
  number: pad(i + 1),
  name: group.title,
  description: group.blurb,
  tags: group.items,
}));

// ── Projects (your shipped products) ────────────────────────────────────────

// App screenshots, keyed by the product's name in profile.ts. A product is shown on the page
// once it has a screenshot here — add one to bring SmartCGD or Smartters HRMS onto the page.
const screenshots: Record<string, string> = {
  Fiole: "/images/projects/fiole.webp",
  Fitrivo: "/images/projects/fitrivo.webp",
  PGfy: "/images/projects/pgfy.webp",
  "Ruchi Store": "/images/projects/ruchi-store.webp",
};

export type ShowcaseProject = {
  number: string;
  /** Your role on the project. */
  category: string;
  name: string;
  tagline: string;
  /** Target of the "Live Project" button: the first store link. */
  href?: string;
  /** Any further store links, shown as small text links. */
  moreLinks: { label: string; href: string }[];
  screenshot: string;
};

export const showcaseProjects: ShowcaseProject[] = profileProjects
  .filter((project) => project.name in screenshots)
  .map((project, i) => ({
    number: pad(i + 1),
    category: project.role,
    name: project.name,
    tagline: project.tagline,
    href: project.links[0]?.href,
    moreLinks: project.links.slice(1).map(({ label, href }) => ({ label, href })),
    screenshot: screenshots[project.name],
  }));
