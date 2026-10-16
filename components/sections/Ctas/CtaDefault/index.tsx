import type { CtasSection } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import { Button } from "@/components/common/Button";

type CtaDefaultProps = { section: CtasSection };

/**
 * Promo band over a full-bleed background video/image: heading on the left
 * half, a short line + buttons on the right. Text is white over the dimmed
 * media on mobile and ink over the full-strength media from `lg` up.
 * Cells use Foundation-style margin gutters (calc(% - 30px) + 15px margins),
 * and the card shrinks to its content, matching the live layout.
 */
export function CtaDefault({ section }: CtaDefaultProps) {
  const { heading, body, backgroundMedia, buttons } = section;
  const isVideo = backgroundMedia?.contentType?.startsWith("video/") ?? false;

  return (
    <section className="relative block h-auto bg-black pb-5 font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased">
      {backgroundMedia ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-70 lg:opacity-100"
        >
          {isVideo ? (
            <video
              className="pointer-events-none block h-[inherit] w-[inherit] object-cover object-center"
              aria-hidden="true"
              src={backgroundMedia.url}
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="block h-[inherit] w-[inherit] object-cover object-center"
              src={backgroundMedia.url}
              alt=""
            />
          )}
        </div>
      ) : null}

      <div className="mx-auto flex h-full w-full max-w-[1600px] items-start px-2.5 sm:px-[15px]">
        <div className="relative overflow-hidden rounded-[8px] pt-[clamp(1.875rem,1.0427rem+3.6991vw,3.75rem)]">
          <div className="relative z-[1] -mx-2.5 flex flex-wrap items-start justify-between sm:-mx-[15px]">
            <div className="mx-2.5 mb-6 w-[calc(100%-1.25rem)] min-w-0 shrink-0 grow-0 sm:mx-[15px] sm:w-[calc(100%-1.875rem)] lg:mb-0 lg:w-[calc(50%-1.875rem)]">
              {heading ? (
                <h3 className="m-0 pt-px text-[length:clamp(1.5rem,1.0217rem+2.1259vw,3.125rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic] lg:text-[var(--c3-ink)]">
                  {heading}
                </h3>
              ) : null}
            </div>
            <div className="mx-2.5 flex w-[calc(100%-1.25rem)] min-w-0 shrink-0 grow-0 flex-col items-start sm:mx-[15px] sm:w-[calc(100%-1.875rem)] lg:w-[calc(41.66667%-1.875rem)]">
              {renderRichText(body, {
                paragraphClassName:
                  "mb-[clamp(1.5625rem,0.1753rem+6.1652vw,4.6875rem)] text-left text-[length:clamp(1rem,0.7424rem+1.1447vw,1.875rem)] leading-[135%] font-normal tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic] lg:mb-[75px] lg:text-[var(--c3-ink)]",
              })}
              {buttons.map((button) => (
                <Button key={button.id} button={button} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
