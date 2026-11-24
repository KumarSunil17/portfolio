# Sunil Kumar Muduli — Portfolio

A cinematic, motion-driven portfolio built with Next.js 16, Tailwind CSS 4, [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling. Live at **https://kumarsunil.vercel.app**.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

All text, links, skills, stats, process steps and projects live in [`src/data/profile.ts`](src/data/profile.ts). Site-wide SEO settings (URL, title, description, keywords) live in [`src/data/site.ts`](src/data/site.ts). Images are in `public/images/`, and the downloadable CV is `public/Sunil-Kumar-Muduli-CV.pdf`.

| Section | File |
| --- | --- |
| Hero: avatar brush-reveal, 3D card orbit, masthead | `src/components/hero/CinematicHero.tsx`, `CardRing.tsx` |
| Avatar pointer-reveal canvas | `src/components/ui/AvatarReveal.tsx` |
| Stats ("By the numbers") | `src/components/sections/Impact.tsx` |
| Projects (3D horizontal gallery + detail dialog) | `src/components/sections/Projects.tsx` |
| How I work (storytelling) | `src/components/sections/Process.tsx` |
| About | `src/components/sections/About.tsx` |
| Skills ("What I bring") | `src/components/sections/Skills.tsx` |
| Experience timeline | `src/components/sections/Experience.tsx` |
| Contact | `src/components/sections/Contact.tsx` |

### Avatar images

The hero avatar is two pixel-registered cut-outs: `public/images/avatar/front.webp` (default) and `back.webp` (revealed under the brush), plus 1400px-wide versions for phones. Both pairs must keep identical size and framing. Full-resolution masters are in `resources/generated/`.

Visitors who set "reduce motion" get a static hero (the brush still works on pointer move), no smooth scrolling, and a vertical projects grid.

## SEO

- **Metadata** (title, description, canonical URL, Open Graph, X/Twitter card, robots) is set in `src/app/layout.tsx` from `src/data/site.ts`.
- **Structured data**: `src/components/StructuredData.tsx` renders schema.org JSON-LD (WebSite, ProfilePage, Person, Organization and the list of products).
- **Crawling**: `src/app/sitemap.ts` → `/sitemap.xml`, `src/app/robots.ts` → `/robots.txt`, `src/app/manifest.ts` → `/manifest.webmanifest`.
- **Share image**: `src/app/opengraph-image.jpg` and `twitter-image.jpg` (1200×630) with `.alt.txt` captions; `src/app/apple-icon.png` for home-screen icons.
- **Search Console**: `public/google2f3aeabc35d2d8ce.html` verifies the site with Google.

If the site moves to a custom domain, set `NEXT_PUBLIC_SITE_URL` (for example in the Vercel project settings) so canonical URLs, the sitemap and structured data point to it.

## Deploy

```bash
npm run build
```

The page is fully static, so it deploys as-is to Vercel, Netlify or any Node host. Pushing `main` deploys to Vercel.
