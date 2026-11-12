import MotionProvider from "@/components/MotionProvider";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
  return (
    <MotionProvider>
      <main id="root" className="bg-[#041121]" style={{ overflowX: "clip" }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
      </main>
    </MotionProvider>
  );
}
