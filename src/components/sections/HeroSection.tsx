import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import Magnet from "@/components/ui/Magnet";
import ContactButton from "@/components/ui/ContactButton";
import { avatar, heroText, heroTitle, navLinks } from "@/data/portfolio";

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: "clip" }}>
      <FadeIn delay={0} y={-20}>
        <nav aria-label="Primary">
          <ul className="flex justify-between px-6 pt-6 text-sm font-medium tracking-wider text-[#D7E2EA] uppercase md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-opacity duration-200 hover:opacity-70">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </FadeIn>

      <div className="mt-6 overflow-hidden sm:mt-4 md:-mt-5">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading w-full text-[14vw] leading-none font-black tracking-tight whitespace-nowrap uppercase sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
        >
          {heroTitle}
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-6 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] leading-snug font-light tracking-wide text-[#D7E2EA] uppercase sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
        >
          {heroText}
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Floating avatar: centred on mobile, standing on the bottom edge from sm up. */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute top-1/2 left-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]"
      >
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <div className="overflow-hidden rounded-[40px] border-2 border-[#D7E2EA]/40 sm:rounded-t-[50px] sm:rounded-b-none sm:border-b-0 md:rounded-t-[60px]">
            <Image
              src={avatar.src}
              alt={avatar.alt}
              width={avatar.width}
              height={avatar.height}
              priority
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 440px, (min-width: 640px) 360px, 280px"
              className="block h-auto max-h-[72vh] w-full object-cover object-top"
            />
          </div>
        </Magnet>
      </FadeIn>
    </section>
  );
}
