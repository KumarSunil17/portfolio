import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.shortName} — ${profile.headline}`,
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
  themeColor: "#041121",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kanit.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
