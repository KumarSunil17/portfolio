import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { seo } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Portfolio`,
    short_name: profile.shortName,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#05060b",
    theme_color: "#05060b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
