// Site-wide SEO settings. Page content lives in profile.ts.
import { profile } from "./profile";

/**
 * Public origin of the site, used for canonical URLs, Open Graph, the sitemap and structured data.
 * Override with NEXT_PUBLIC_SITE_URL (e.g. after moving to a custom domain).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kumarsunil.vercel.app").replace(/\/+$/, "");

export const seo = {
  /** ≤ 60 characters so it isn't truncated in results. */
  title: `${profile.name} — Mobile App Developer & Tech Partner`,
  /** ≤ 160 characters. */
  description:
    "Sunil Kumar Muduli, co-founder of Smartters Software in Bhubaneswar, builds Flutter & React Native mobile apps, web and AR/VR products from idea to launch.",
  keywords: [
    "Sunil Kumar Muduli",
    "Sunil Kumar",
    "mobile app developer",
    "Flutter developer",
    "React Native developer",
    "app developer Bhubaneswar",
    "app development Odisha",
    "tech partner for startups",
    "MVP development",
    "Smartters Software",
    "co-founder",
    "AR VR developer",
    "Unity developer",
    "Android and iOS apps",
  ],
  locale: "en_IN",
};
