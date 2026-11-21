import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Unbounded is a variable font, so no `weight` list: that would make Google return the same
// file once per listed weight, while the variable form (like Geist and JetBrains Mono below)
// returns each file once and covers every weight the site uses.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

// Editorial serif for accents and oversized numbers. Static font: only weight 400 exists.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${profile.shortName} — ${profile.headline} | ${profile.title}`,
  description: `Meet ${profile.shortName}, ${profile.title} and your next tech partner. ${profile.tagline}`,
  keywords: [
    "Sunil Kumar Muduli",
    "Tech partner",
    "Co-founder",
    "Smartters Software",
    "AR VR developer",
    "Unity",
    "Flutter",
    "React Native",
    "MVP development",
    "Bhubaneswar",
  ],
  authors: [{ name: profile.name }],
};

export const viewport: Viewport = {
  themeColor: "#05060b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${unbounded.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
