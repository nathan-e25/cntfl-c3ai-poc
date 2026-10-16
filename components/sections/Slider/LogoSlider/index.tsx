import type { SliderSection } from "@/lib/sections/types";

type LogoSliderProps = { section: SliderSection };

/**
 * Dark logo bar: a small heading above an endless, edge-faded marquee of
 * customer logos. Pure CSS — the track renders the logo set twice and the
 * `scroll-logos` keyframes (app/globals.css) slide it by -50% every 50s.
 */
export function LogoSlider({ section }: LogoSliderProps) {
  const { heading, items } = section;

  return (
    <section className="h-auto bg-[var(--c3-hero-bg)] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] antialiased">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between gap-y-[clamp(1.875rem,0.2104rem+7.3983vw,5.625rem)] px-2.5 pt-[25px] pb-[clamp(1.5625rem,1.3406rem+0.9864vw,2.0625rem)] sm:px-[15px]">
        {heading ? (
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/2">
              <p className="text-[length:clamp(0.75rem,0.6764rem+0.3271vw,1rem)] leading-none font-normal tracking-[-0.3%] text-pretty capitalize break-words text-[var(--c3-white)] [text-box:cap_alphabetic]">
                {heading}
              </p>
            </div>
          </div>
        ) : null}

        <div
          className="overflow-hidden [mask-image:linear-gradient(90deg,rgba(0,0,0,0),rgb(0,0,0)_10%,rgb(0,0,0)_90%,rgba(0,0,0,0))]"
          role="group"
          aria-label={heading ?? "Customer logos"}
        >
          <ul className="sr-only">
            {items.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
          <div
            className="flex w-max animate-[scroll-logos_50s_linear_infinite] items-center will-change-transform"
            aria-hidden="true"
          >
            {[0, 1].map((set) => (
              <div key={set} className="flex shrink-0 items-center gap-12 pr-12">
                {items.map((item) => (
                  <div key={item.id} className="flex shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image.url}
                      alt=""
                      className="block h-8 w-[84px] object-contain"
                      style={
                        item.imageHeight
                          ? { height: `${item.imageHeight}px`, width: "auto" }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
