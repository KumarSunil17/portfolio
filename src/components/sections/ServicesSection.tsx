import FadeIn from "@/components/ui/FadeIn";
import { services } from "@/data/portfolio";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2
        className="mb-16 text-center leading-none font-black tracking-tight uppercase sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Services
      </h2>

      <ul className="mx-auto max-w-5xl">
        {services.map((service, i) => (
          <FadeIn
            as="li"
            key={service.number}
            delay={i * 0.1}
            className="flex items-start gap-4 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:gap-8 sm:py-10 md:gap-12 md:py-12"
          >
            <span
              className="min-w-[1.5em] shrink-0 leading-none font-black"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {service.number}
            </span>
            <div className="min-w-0 flex-1">
              <h3
                className="font-medium uppercase"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {service.name}
              </h3>
              <p
                className="mt-3 max-w-2xl leading-relaxed font-light opacity-60"
                style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
              >
                {service.description}
              </p>
              <p className="mt-4 max-w-2xl text-xs leading-relaxed font-light tracking-widest uppercase opacity-40 sm:text-sm">
                {service.tags.join(" · ")}
              </p>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
