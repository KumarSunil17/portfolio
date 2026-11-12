const classes =
  "inline-block rounded-full border-2 whitespace-nowrap border-[#D7E2EA] px-8 py-3 text-sm font-medium tracking-widest text-[#D7E2EA] uppercase transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base";

/** Ghost pill. Renders a link when `href` is given, otherwise a plain button. */
export default function LiveProjectButton({ href }: { href?: string }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        Live Project
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      Live Project
    </button>
  );
}
