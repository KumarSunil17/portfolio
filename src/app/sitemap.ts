import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { siteUrl } from "@/data/site";

// A one-page site: the home page (with its key images) and the downloadable CV.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/opengraph-image.jpg`, `${siteUrl}/images/portrait.png`, `${siteUrl}/images/avatar/front.webp`],
    },
    { url: `${siteUrl}${profile.cv}`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
