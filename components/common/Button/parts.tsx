import type { ButtonStyle } from "@/lib/sections/types";

const styleClasses = (style: ButtonStyle): string => {
  switch (style) {
    case "Secondary":
    case "Primary Inverse":
      return "border-[var(--c3-white)] bg-[var(--c3-white)] text-[var(--c3-ink)] hover:border-[var(--c3-white)] hover:bg-[var(--c3-ink)] hover:text-[var(--c3-white)]";
    case "Ghost Inverse":
      return "border-[var(--c3-white)] bg-transparent text-[var(--c3-white)] hover:bg-[var(--c3-white-12)]";
    case "Product":
      return "border-[var(--c3-ink)] bg-transparent text-[var(--c3-ink)] hover:bg-[var(--c3-ink)] hover:text-[var(--c3-white)]";
    case "Primary":
    default:
      return "border-[var(--c3-white)] bg-[var(--c3-ink)] text-[var(--c3-white)] hover:border-[var(--c3-ink)] hover:bg-[var(--c3-white)] hover:text-[var(--c3-ink)]";
  }
};

export type ButtonLayout = {
  /** "md" = fixed 180px; "fit" = shrink to the label with room for the arrow. */
  width?: "md" | "fit";
  /** Display utilities, e.g. "hidden lg:inline-flex" to show per breakpoint. */
  display?: string;
  className?: string;
};

export const buttonClassName = (
  style: ButtonStyle,
  { width = "md", display = "inline-flex", className = "" }: ButtonLayout
) => {
  const widthClasses = width === "fit" ? "w-fit py-3 pr-10 pl-3" : "w-[180px] p-3";
  return `group relative ${display} h-[60px] min-h-[54px] ${widthClasses} cursor-pointer appearance-none items-end justify-start overflow-hidden rounded-[6px] border border-solid no-underline outline-none transition-[background,border-color,box-shadow] duration-100 ease-[cubic-bezier(0,0,0.2,1)] focus-visible:outline-none ${styleClasses(style)} ${className}`;
};

/** Label bottom-left + arrow top-right that nudges on hover. */
export function ButtonContent({ label }: { label: string }) {
  return (
    <>
      <span className="relative z-[1] text-left font-[family-name:var(--font-c3-mono)] text-[12px] leading-[110%] font-medium tracking-[-0.3%] text-balance">
        {label}
      </span>
      <span className="pointer-events-none absolute top-2 right-0 size-6 transition-transform duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1.5 11.5L11.5 1.5M11.5 1.5H4.5M11.5 1.5V8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );
}
