import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
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
      className={`${geistSans.variable} ${unbounded.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
