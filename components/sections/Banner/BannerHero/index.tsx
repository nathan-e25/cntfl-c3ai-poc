import type { BannerSection } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import { Button } from "@/components/common/Button";
import { VideoToggle } from "./VideoToggle";

type BannerHeroProps = { section: BannerSection };

/**
 * Full-bleed hero: background video (or image), a large heading on the left
 * 2/3, a bold intro on the right 1/4, CTAs bottom-right and a video
 * pause/play toggle pinned bottom-left (desktop) / stacked under the CTAs (mobile).
 */
export function BannerHero({ section }: BannerHeroProps) {
  const { heading, subheading, body, backgroundVideo, backgroundImage, backgroundAlt, ctas } =
    section;
  const videoId = `banner-hero-video-${section.id}`;

  return (
    <section className="relative flex flex-col bg-[var(--c3-hero-bg)] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] antialiased">
      <div
        className="pointer-events-none absolute inset-0 h-full"
        role={backgroundAlt ? "img" : undefined}
        aria-label={backgroundAlt ?? undefined}
      >
        {backgroundVideo ? (
          <video
            id={videoId}
            className="pointer-events-none block size-full object-cover object-center"
            aria-hidden="true"
            src={backgroundVideo.url}
            poster={backgroundImage?.url ?? undefined}
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : backgroundImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="block size-full object-cover object-center"
            src={backgroundImage.url}
            alt=""
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="z-[5] mx-auto flex w-full max-w-[1600px] flex-col px-2.5 pt-[clamp(6.0625rem,1.7623rem+19.1122vw,15.75rem)] pb-5 sm:px-[15px]">
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full flex-col lg:mb-[98px] lg:w-2/3">
            {heading ? (
              <h1 className="mb-[clamp(0rem,-0.9433rem+4.1924vw,2.125rem)] text-[length:clamp(2.3125rem,0.9695rem+5.9689vw,6.875rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic]">
                {heading}
              </h1>
            ) : null}
            <h3 className="pt-px text-[length:clamp(1.5rem,1.0217rem+2.1259vw,3.125rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic]">
              {subheading}
            </h3>
          </div>
          <div className="flex w-full flex-col lg:w-1/4">
            {renderRichText(body, {
              paragraphClassName:
                "mt-5 mb-[37px] pt-2.5 text-[length:clamp(1.25rem,1.1396rem+0.4906vw,1.625rem)] leading-[135%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic] lg:my-0",
            })}
          </div>
        </div>

        <div className="flex justify-start lg:h-[60px] lg:justify-end">
          <div className="flex flex-col lg:mt-auto lg:flex-row lg:gap-3">
            {ctas.map((cta) => (
              <Button key={cta.id} button={cta} />
            ))}
            {backgroundVideo ? <VideoToggle videoId={videoId} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
