import type { ContentCardsSection, MediaAsset } from "@/lib/sections/types";

export const P = "tracking-[-0.3%] text-pretty break-words [text-box:cap_alphabetic]";

/** Full-bleed background video/image (decorative). */
export function BackgroundMedia({ media }: { media: MediaAsset }) {
  const className = "block h-[inherit] w-[inherit] object-cover object-center";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full">
      {media.contentType?.startsWith("video/") ? (
        <video
          className={className}
          aria-hidden="true"
          src={media.url}
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={className} src={media.url} alt="" />
      )}
    </div>
  );
}

/** Eyebrow (gray) followed by one line per entry, kept on separate lines. */
export function Subheadline({
  section,
  className,
}: {
  section: ContentCardsSection;
  className: string;
}) {
  const { eyebrow, lines } = section;
  if (!eyebrow && !lines.length) return null;
  return (
    <p className={`whitespace-pre-line ${className}`}>
      {eyebrow ? <span className="text-[var(--c3-gray-151)]">{eyebrow}</span> : null}
      {lines.length ? `${eyebrow ? "\n" : ""}${lines.join("\n")}` : null}
    </p>
  );
}

export function Glyph({
  section,
  className,
}: {
  section: ContentCardsSection;
  className: string;
}) {
  if (!section.icon?.url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={section.icon.url} alt="" className={`h-auto w-[50px] ${className}`} />;
}
