import { contactHref } from "@/data/portfolio";

export default function ContactButton({ href = contactHref }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-block rounded-full px-8 whitespace-nowrap py-3 text-xs font-medium tracking-widest text-white uppercase transition duration-200 hover:brightness-125 focus-visible:brightness-125 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
        outline: "2px solid white",
        outlineOffset: "-3px",
      }}
    >
      Contact Me
    </a>
  );
}
