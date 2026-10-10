# Sunil Kumar Muduli — Portfolio

A motion-driven portfolio built with Next.js 16, Tailwind CSS 4, [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling.

The hero pins the VR photo full-screen. As you scroll it zooms toward the headset, HUD panels with highlights appear one by one, a reticle locks onto the visor, and the view dives into the visor before the rest of the site.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

All text, links, skills and projects live in [`src/data/profile.ts`](src/data/profile.ts). Images are in `public/images/`, and the downloadable CV is `public/Sunil-Kumar-Muduli-CV.pdf`.

| Section | File |
| --- | --- |
| VR scroll hero | `src/components/hero/VRHero.tsx` |
| About / stats | `src/components/sections/About.tsx` |
| Skills | `src/components/sections/Skills.tsx` |
| Experience timeline | `src/components/sections/Experience.tsx` |
| Projects (horizontal scroll on desktop) | `src/components/sections/Projects.tsx` |
| Contact | `src/components/sections/Contact.tsx` |

To tune the hero, change `DIVE` (where the zoom ends and the dive begins) and the `zoom` values in `VRHero.tsx`. Each HUD panel's position comes from `heroFeatures` in `profile.ts`.

Visitors who set "reduce motion" get a static hero, with the highlights shown as a grid and no smooth scrolling.

## Deploy

```bash
npm run build
```

The page is fully static, so it deploys as-is to Vercel, Netlify or any Node host.
