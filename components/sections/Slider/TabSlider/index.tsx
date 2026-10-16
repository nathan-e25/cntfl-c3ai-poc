"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SliderItem, SliderSection } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import { Button } from "@/components/common/Button";

type TabSliderProps = { section: SliderSection };

/** Autoplay interval — keep in sync with the `tab-progress` fill duration below. */
const AUTOPLAY_MS = 7000;
/** Slide transition duration (track transform). */
const SLIDE_MS = 350;

const H3_CLASSES =
  "pt-px text-[length:clamp(1.5rem,1.0217rem+2.1259vw,3.125rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words [text-box:cap_alphabetic]";

const withLineBreaks = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </span>
  ));

/**
 * Industry-style tab carousel: a header, a row of tabs with a progress
 * indicator, and full-width image slides that each carry a dark card.
 * Autoplays every 7s and loops forward through a cloned first slide;
 * clicking a tab jumps there and restarts the timer.
 */
export function TabSlider({ section }: TabSliderProps) {
  const { heading, intro, items } = section;
  const count = items.length;

  // `position` can be `count` (the clone of slide 0) while wrapping around.
  const [position, setPosition] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [cycle, setCycle] = useState(0);
  const active = count ? position % count : 0;

  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const tab = tabRefs.current[active];
    if (!nav || !tab) return;
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setIndicator({ left: tabRect.left - navRect.left, width: tabRect.width });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Autoplay: restart whenever the active tab changes or a tab is clicked.
  useEffect(() => {
    if (count < 2) return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setPosition((p) => (p >= count ? 1 : p + 1));
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, cycle, count]);

  // After snapping back from the clone without a transition, re-enable it.
  useEffect(() => {
    if (animate) return;
    // Flush the transition-less snap to the DOM before turning transitions back on.
    void trackRef.current?.offsetWidth;
    const timer = window.setTimeout(() => setAnimate(true), 16);
    return () => window.clearTimeout(timer);
  }, [animate]);

  // Landed on the clone of slide 0: once the slide transition is over, jump
  // back to the real slide 0 without animating so the loop is seamless.
  useEffect(() => {
    if (position !== count) return;
    const timer = window.setTimeout(() => {
      setAnimate(false);
      setPosition(0);
    }, SLIDE_MS + 30);
    return () => window.clearTimeout(timer);
  }, [position, count]);

  const goTo = (index: number) => {
    setAnimate(true);
    setPosition(index);
    setCycle((c) => c + 1);
  };

  if (!count) return null;

  const slides: Array<{ item: SliderItem; key: string; index: number }> = [
    ...items.map((item, index) => ({ item, key: item.id, index })),
    { item: items[0], key: `${items[0].id}-clone`, index: count },
  ];

  return (
    <section className="bg-[var(--c3-light-bg)] pt-[clamp(2.5rem,2.4661vw+1.9451rem,3.75rem)] pb-[clamp(2.5rem,8.1381vw+0.6689rem,6.625rem)] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased">
      <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
        <div className="mb-[clamp(2rem,0.7238rem+5.672vw,4.875rem)] flex flex-wrap items-start">
          <div className="w-full lg:w-3/4">
            {heading ? (
              <h3
                className={`${H3_CLASSES} mb-[clamp(1.25rem,-0.5533rem+8.0148vw,5.3125rem)] text-[var(--c3-hero-bg)]`}
              >
                {heading}
              </h3>
            ) : null}
          </div>
          <div className="w-full lg:w-1/4">
            {renderRichText(intro, {
              paragraphClassName:
                "text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] font-bold tracking-[-0.3%] text-pretty break-words text-[var(--c3-hero-bg)] [text-box:cap_alphabetic]",
            })}
          </div>
        </div>

        <nav ref={navRef} className="relative pb-2" aria-label={heading ?? "Slides"}>
          <ul
            role="list"
            className="m-0 flex list-none flex-wrap gap-[clamp(0.75rem,0.1951rem+2.4661vw,2rem)] overflow-x-auto p-0 leading-[110%] [scrollbar-width:none] lg:flex-nowrap [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, i) => (
              <li key={item.id} className="shrink-0">
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => goTo(i)}
                  className={`block cursor-pointer border-0 border-b-2 border-solid bg-transparent p-0 text-[length:clamp(0.75rem,0.6764rem+0.3271vw,1rem)] font-bold tracking-[-0.3%] whitespace-nowrap text-[var(--c3-gray-64)] no-underline transition-[color] duration-100 ease-[cubic-bezier(0,0,0.2,1)] lg:border-b-0 ${
                    i === active ? "border-b-[color:var(--c3-ink)]" : "border-b-transparent"
                  }`}
                >
                  {item.tabLabel ?? item.title}
                </button>
              </li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 hidden h-[2px] overflow-hidden bg-[var(--c3-tab-track)] [transition:left_0.35s_cubic-bezier(0.4,0,0.2,1),width_0.2s_cubic-bezier(0.4,0,0.2,1)] lg:block"
            style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
          >
            <span
              key={`${active}-${cycle}`}
              className="absolute top-0 left-0 h-full w-0 animate-[tab-progress_7s_linear_forwards] bg-[var(--c3-hero-bg)]"
            />
          </div>
        </nav>
      </div>

      <div className="mt-3.5 overflow-hidden" role="region" aria-label={`${heading ?? ""} slides`.trim()}>
        <div
          ref={trackRef}
          className="flex flex-nowrap"
          style={{
            transform: `translateX(-${position * 100}%)`,
            transition: animate
              ? `transform ${SLIDE_MS / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
          }}
        >
          {slides.map(({ item, key, index }) => {
            const isCurrent = index === position;
            const focusable = isCurrent ? undefined : -1;
            return (
              <div
                key={key}
                role="tabpanel"
                aria-hidden={!isCurrent}
                className="relative w-full flex-[0_0_100%] content-end bg-[var(--c3-light-bg)] py-[clamp(1.25rem,-0.8585rem+9.3711vw,6rem)] lg:h-[660px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.url}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-[1600px] object-cover object-[center_top] select-none"
                />
                <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-3/4">
                      <div className="relative rounded-[6px] bg-[var(--c3-hero-bg)] p-[clamp(1.25rem,1.0835rem+0.7398vw,1.625rem)]">
                        <div className="flex flex-wrap items-stretch justify-between">
                          <div className="mb-6 flex w-full flex-col justify-between gap-8 lg:mb-0 lg:w-1/2 lg:gap-y-[90px]">
                            <h3 className={`${H3_CLASSES} mb-0 capitalize text-[var(--c3-white)]`}>
                              {item.heading ? withLineBreaks(item.heading) : null}
                            </h3>
                            {item.cta ? (
                              <Button
                                button={item.cta}
                                display="hidden lg:inline-flex"
                                className="mt-auto self-start"
                                tabIndex={focusable}
                              />
                            ) : null}
                          </div>
                          <div className="flex w-full flex-col justify-between gap-4 lg:w-5/12 lg:gap-0">
                            {renderRichText(item.body, {
                              paragraphClassName:
                                "text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic]",
                            })}
                            <span className="block pt-5 font-[family-name:var(--font-c3-mono)] text-[12px] leading-[110%] font-medium tracking-[-0.3%] text-[var(--c3-gray-151)] lg:mt-auto lg:mb-3.5 lg:pt-0">
                              {item.listLabel}
                            </span>
                            {item.links.length ? (
                              <ul className="m-0 list-none p-0">
                                {item.links.map((link) => (
                                  <li key={link.id}>
                                    <a
                                      href={link.url}
                                      tabIndex={focusable}
                                      className="flex items-start gap-1.5 text-[length:clamp(0.75rem,0.6764rem+0.3271vw,1rem)] leading-[110%] font-bold tracking-[-0.3%] capitalize text-[var(--c3-white)] no-underline"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="shrink-0 text-[length:clamp(1rem,0.9632rem+0.1635vw,1.125rem)] font-light"
                                      >
                                        ›
                                      </span>
                                      {link.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {item.cta ? (
                              <Button
                                button={item.cta}
                                width="fit"
                                display="inline-flex lg:hidden"
                                tabIndex={focusable}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
