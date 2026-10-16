import type { ReactNode } from "react";
import type { SideBySideRow, SideBySideSection } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import { Button } from "@/components/common/Button";

type LeftContentRightImageProps = { section: SideBySideSection };

/**
 * With rows (`items`): a light header — big title left, bold intro + button
 * right — followed by one row per item. Without rows the entry itself renders
 * as a single row.
 */
export function LeftContentRightImage({ section }: LeftContentRightImageProps) {
  if (!section.items.length) return <Row row={section} />;
  return (
    <>
      <Header section={section} />
      {section.items.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </>
  );
}

function Header({ section }: { section: SideBySideSection }) {
  const { heading, body, link } = section;
  return (
    <section className="bg-[var(--c3-light-bg)] pb-[clamp(0rem,-1.5536rem+6.9051vw,3.5rem)] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased">
      <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
        <div className="flex flex-wrap items-start justify-between">
          <div className="w-full pr-[50px] lg:w-2/3">
            {heading ? (
              <h2 className="mb-[clamp(0rem,-0.8323rem+3.6991vw,1.875rem)] text-[length:clamp(2.3125rem,0.9695rem+5.9689vw,6.875rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words [text-box:cap_alphabetic] lg:mb-0">
                {heading}
              </h2>
            ) : null}
          </div>
          <div className="w-full pt-[19px] lg:w-1/4 lg:pt-[clamp(0rem,-0.1387rem+0.6165vw,0.3125rem)]">
            {renderRichText(body, {
              paragraphClassName:
                "text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] font-normal tracking-[-0.3%] text-pretty break-words [text-box:cap_alphabetic] sm:font-bold",
            })}
            {link ? (
              <Button button={link} className="mt-[clamp(1.25rem,0.8893rem+1.603vw,2.0625rem)]" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Light row: heading + body on the left half, media (autoplaying muted video
 * or image) on the right half, pinned to the right edge on desktop. When a
 * link is set the whole row is the link and darkens on hover.
 */
function Row({ row }: { row: SideBySideRow }) {
  const { heading, body, media, mediaAlt, link } = row;
  const isVideo = media?.contentType?.startsWith("video/") ?? false;

  const content = (
    <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
      <div className="flex flex-wrap items-start justify-between">
        <div className="flex w-full flex-col pr-[clamp(0rem,-2.4969rem+11.0974vw,5.625rem)] pb-[clamp(1.25rem,0.6951rem+2.4661vw,2.5rem)] lg:w-1/2 lg:pb-0">
          {heading ? (
            <h3 className="mb-[clamp(0.625rem,0.3198rem+1.3564vw,1.3125rem)] pt-px text-[length:clamp(1.5rem,1.0217rem+2.1259vw,3.125rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-hero-bg)] [text-box:cap_alphabetic]">
              {heading}
            </h3>
          ) : null}
          {body ? (
            <div className="mt-[clamp(0.6875rem,0.4933rem+0.8631vw,1.125rem)] mb-0 max-w-[566px] text-[length:clamp(1.25rem,1.1764rem+0.3271vw,1.5rem)] leading-[130%] tracking-[-0.3%] text-[var(--c3-hero-bg)]">
              {renderRichText(body, {
                listClassName: "ml-5 py-5",
                listItemClassName: "list-disc",
              })}
            </div>
          ) : null}
        </div>
        <div className="flex w-full lg:w-1/2 lg:justify-end">
          {media && isVideo ? (
            <video
              className="block h-full w-full object-cover lg:w-[662px]"
              role="img"
              aria-label={mediaAlt ?? undefined}
              src={media.url}
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : media ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="block h-full w-full object-cover lg:w-[662px]"
              src={media.url}
              alt={mediaAlt ?? ""}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  const rowClasses =
    "block bg-[var(--c3-light-bg)] py-[2.1875rem] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[110%] font-medium no-underline antialiased";

  const wrap = (children: ReactNode) =>
    link ? (
      <a
        href={link.url}
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        className={`${rowClasses} cursor-pointer text-[var(--c3-link)] transition-[color] duration-100 ease-[cubic-bezier(0,0,0.2,1)] hover:bg-[var(--c3-light-bg-hover)]`}
      >
        {children}
      </a>
    ) : (
      <section className={rowClasses}>{children}</section>
    );

  return wrap(content);
}
