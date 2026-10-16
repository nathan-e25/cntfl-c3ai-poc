import type { ContentCardsSection } from "@/lib/sections/types";
import { BackgroundMedia, Glyph, P, Subheadline } from "./parts";
import { PromotionPopup } from "./PromotionPopup";

type PromotionProps = { section: ContentCardsSection };

/**
 * Event promotion. Below `lg` it renders inline as a linked card over a
 * background video; from `lg` up the inline card is hidden and the same
 * content shows as a dismissible popup pinned to the bottom-right corner.
 */
export function Promotion({ section }: PromotionProps) {
  const { heading, button, backgroundMedia, showPopup } = section;

  return (
    <>
      <section className="block bg-black font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased lg:hidden">
        <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
          <div className="relative rounded-[8px] bg-black">
            {backgroundMedia ? <BackgroundMedia media={backgroundMedia} /> : null}
            {/* Foundation `grid-margin-x` row: the link deliberately overhangs the card by the gutter. */}
            <div className="-mx-2.5 flex flex-wrap justify-between sm:-mx-[15px]">
              <a
                href={button?.url}
                target={button?.openInNewTab ? "_blank" : undefined}
                rel={button?.openInNewTab ? "noopener noreferrer" : undefined}
                className="relative z-[1] flex h-full w-full flex-col justify-between p-6 leading-[110%] font-medium text-[var(--c3-link)] no-underline"
              >
                <div>
                  {heading ? (
                    <p className={`mb-5 pr-6 text-[length:clamp(1.125rem,1.033rem+0.4088vw,1.4375rem)] leading-[135%] font-bold text-[var(--c3-white)] ${P}`}>
                      {heading}
                    </p>
                  ) : null}
                  <Subheadline
                    section={section}
                    className={`mb-4 text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] font-bold text-[var(--c3-white)] ${P}`}
                  />
                </div>
                <div className="flex w-full items-end justify-between">
                  {button ? (
                    <span className="inline-block font-[family-name:var(--font-c3-mono)] text-[length:clamp(1rem,0.9264rem+0.3271vw,1.25rem)] leading-[110%] font-medium tracking-[-0.3%] text-[var(--c3-white)] no-underline">
                      {button.label}
                    </span>
                  ) : null}
                  <Glyph section={section} className="inline-block" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {showPopup ? <PromotionPopup section={section} /> : null}
    </>
  );
}
