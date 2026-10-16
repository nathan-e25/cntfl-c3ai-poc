"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { AccordionItem, AccordionSection } from "@/lib/sections/types";
import { renderRichText } from "@/lib/contentful/richText";
import { Button } from "@/components/common/Button";
import { VideoModal } from "@/components/common/VideoModal";

type CustomerStoriesProps = { section: AccordionSection };

const P = "tracking-[-0.3%] text-pretty break-words [text-box:cap_alphabetic]";

/** Wait for the panel's open/close transition before scrolling. */
const PANEL_MS = 350;
/** Gap left above the opened item after scrolling. */
const SCROLL_OFFSET = 40;

/**
 * Dark "customer stories" block: a title band (heading, intro, button) over an
 * exclusive, collapsible accordion. Each panel has a clickable portrait that
 * opens a video modal, a headline + body, a stats row (optionally led by a
 * button) and a 16:10 background video. The first item starts open.
 */
export function CustomerStories({ section }: CustomerStoriesProps) {
  const { heading, body, button, items } = section;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const closeVideo = useCallback(() => setVideoUrl(null), []);
  const baseId = useId();
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Set only by a user toggle, so mount (and StrictMode's double effect run) never scrolls.
  const userToggled = useRef(false);

  // After a user opens an item, smooth-scroll it to near the top of the
  // viewport once the panels have finished animating.
  useEffect(() => {
    if (!userToggled.current) return;
    userToggled.current = false;
    if (openIndex === null) return;
    const el = itemRefs.current[openIndex];
    if (!el) return;
    const timer = window.setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }, PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [openIndex]);

  return (
    <section className="font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased">
      <div className="bg-[var(--c3-light-bg)]">
        <div
          aria-hidden="true"
          className="block h-[clamp(2.5rem,1.1128rem+6.1652vw,5.625rem)] w-full bg-[var(--c3-ink)]"
        />
      </div>

      <div className="bg-[var(--c3-ink)] pb-[clamp(1.875rem,1.0427rem+3.6991vw,3.75rem)] text-[var(--c3-white)]">
        <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
          <div className="flex flex-wrap items-start justify-between">
            <div className="w-full pr-[50px] lg:w-3/4">
              {heading ? (
                <h2 className="mb-[clamp(0rem,-0.8323rem+3.6991vw,1.875rem)] text-[length:clamp(2.3125rem,0.9695rem+5.9689vw,6.875rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words [text-box:cap_alphabetic] lg:mb-0">
                  {heading}
                </h2>
              ) : null}
            </div>
            <div className="w-full pt-[19px] lg:w-1/4 lg:pt-[clamp(0rem,-0.1387rem+0.6165vw,0.3125rem)]">
              {renderRichText(body, {
                paragraphClassName: `text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] font-bold ${P}`,
              })}
              {button ? (
                <Button button={button} className="mt-[clamp(1.25rem,0.8893rem+1.603vw,2.0625rem)]" />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--c3-hero-bg)]">
        <div className="mx-auto w-full max-w-[1600px] px-2.5 sm:px-[15px]">
          {items.map((item, i) => (
            <Item
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              item={item}
              panelId={`${baseId}-panel-${i}`}
              open={openIndex === i}
              onToggle={() => {
                userToggled.current = true;
                setOpenIndex((cur) => (cur === i ? null : i));
              }}
              onPlay={setVideoUrl}
            />
          ))}
        </div>
      </div>

      <VideoModal url={videoUrl} onClose={closeVideo} />
    </section>
  );
}

type ItemProps = {
  ref: React.Ref<HTMLDivElement>;
  item: AccordionItem;
  panelId: string;
  open: boolean;
  onToggle: () => void;
  onPlay: (url: string) => void;
};

function Item({ ref, item, panelId, open, onToggle, onPlay }: ItemProps) {
  const playUrl = item.portraitVideoUrl;
  const play = () => {
    if (playUrl) onPlay(playUrl);
  };

  return (
    <div ref={ref} className="border-t border-solid border-[var(--c3-gray-151)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-[clamp(1rem,0.889rem+0.4932vw,1.25rem)] text-left text-[var(--c3-white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c3-hero-bg)]"
      >
        <span className="block text-[length:clamp(2rem,1.6137rem+1.7171vw,3.3125rem)] leading-[110%] font-bold tracking-[-0.3%] text-[var(--c3-white)]">
          {item.title}
        </span>
        <span aria-hidden="true" className="ml-6 shrink-0 text-[var(--c3-white)]">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="18"
              y1="9"
              x2="18"
              y2="27"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-opacity duration-[250ms] ease-[ease] ${open ? "opacity-0" : ""}`}
            />
            <line x1="9" y1="18" x2="27" y2="18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        className="grid transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0,0,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="bg-[var(--c3-hero-bg)] pt-[clamp(1.25rem,0.168rem+4.8089vw,3.6875rem)] pb-5 text-[var(--c3-white)] md:pb-0">
            <div className="flex flex-wrap items-start justify-between pb-[clamp(0.625rem,-0.6789rem+5.7953vw,3.5625rem)]">
              <div
                className={`relative flex w-7/12 flex-col gap-2.5 lg:order-2 lg:w-1/4 ${playUrl ? "group cursor-pointer" : ""}`}
                role={playUrl ? "button" : undefined}
                tabIndex={playUrl ? 0 : undefined}
                aria-label={playUrl ? `Play ${item.portraitLabel ?? item.title}` : undefined}
                onClick={playUrl ? play : undefined}
                onKeyDown={
                  playUrl
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          play();
                        }
                      }
                    : undefined
                }
              >
                {playUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/assets/icons/play-home.png"
                    alt=""
                    className="absolute top-1.5 right-[-16px] z-[100] w-[clamp(2.3125rem,1.6744rem+2.836vw,3.75rem)] md:right-1/2 md:translate-x-1/2 lg:left-[150px] lg:translate-x-0"
                  />
                ) : null}
                {item.portraitLabel ? (
                  <p className={`mb-0 text-[length:clamp(1rem,0.9632rem+0.1635vw,1.125rem)] leading-[135%] text-[var(--c3-white)] underline ${P} lg:text-[12px]`}>
                    {item.portraitLabel}
                  </p>
                ) : null}
                {item.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.portrait.url}
                    alt={item.portrait.alt ?? ""}
                    width={item.portrait.width ?? undefined}
                    height={item.portrait.height ?? undefined}
                    loading="lazy"
                    decoding="async"
                    className="block max-w-full rounded-[6px] group-hover:opacity-85 md:max-w-1/2 lg:max-w-[180px]"
                  />
                ) : null}
                <div className="flex flex-col gap-y-[5px] pb-[clamp(0.1875rem,-0.7003rem+3.9457vw,2.1875rem)] lg:block lg:pb-0">
                  {item.personName ? (
                    <p className={`mb-[5px] text-[length:clamp(1.125rem,0.3194rem+3.5806vw,2rem)] leading-[135%] font-bold text-[var(--c3-white)] ${P} lg:text-[12px]`}>
                      {item.personName}
                    </p>
                  ) : null}
                  {item.personTitle ? (
                    <p className={`mb-0 pb-[clamp(1.875rem,1.0427rem+3.6991vw,3.75rem)] text-[length:clamp(1rem,0.5396rem+2.046vw,1.5rem)] leading-[135%] text-[var(--c3-gray-151)] ${P} lg:text-[12px]`}>
                      {item.personTitle}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="w-full pb-[clamp(0rem,-1.3317rem+5.9186vw,3rem)] lg:order-1 lg:w-2/3 lg:pb-0">
                {item.heading ? (
                  <h4 className="mb-[clamp(1.5625rem,0.8967rem+2.9593vw,3.0625rem)] max-w-[564px] text-[length:clamp(1.625rem,1.441rem+0.8177vw,2.25rem)] leading-[110%] font-bold tracking-[-0.3%] text-balance break-words text-[var(--c3-white)] [text-box:cap_alphabetic]">
                    {item.heading}
                  </h4>
                ) : null}
                {renderRichText(item.body, {
                  paragraphClassName: `mb-0 max-w-[468px] text-[length:clamp(1.0625rem,1.0073rem+0.2453vw,1.25rem)] leading-[135%] text-[var(--c3-white)] ${P}`,
                })}
              </div>
            </div>

            <div className="mt-2.5 flex h-auto flex-col items-stretch justify-end gap-5 lg:h-[144px] lg:flex-row lg:gap-0">
              {item.button ? (
                <Stat>
                  <Button button={item.button} className="max-w-full min-w-0 whitespace-normal" />
                </Stat>
              ) : null}
              {item.stats.map((stat) => (
                <Stat key={stat.id}>
                  <p className={`mb-[17px] text-[length:clamp(1.875rem,1.6542rem+0.9812vw,2.625rem)] leading-[110%] font-bold text-[var(--c3-white)] ${P}`}>
                    {stat.value}
                  </p>
                  {stat.label ? (
                    <p className={`mb-0 text-[16px] leading-[135%] font-medium text-[var(--c3-white-70)] ${P}`}>
                      {stat.label}
                    </p>
                  ) : null}
                </Stat>
              ))}
            </div>
          </div>

          {item.backgroundVideo ? (
            <div className="aspect-[16/10] w-full overflow-hidden">
              <video
                className="block h-full w-full object-cover object-center"
                role={item.backgroundVideoAlt ? "img" : undefined}
                aria-label={item.backgroundVideoAlt ?? undefined}
                aria-hidden={item.backgroundVideoAlt ? undefined : true}
                src={item.backgroundVideo.url}
                preload="auto"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** One stats-row cell; dividers go between cells (bottom on mobile, right on desktop). */
function Stat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start px-[clamp(0rem,-0.3052rem+1.3564vw,0.6875rem)] pb-5 text-[40px] leading-none not-last:border-b not-last:border-solid not-last:border-[var(--c3-white-15)] lg:w-1/4 lg:pb-0 lg:not-last:border-r lg:not-last:border-b-0 lg:not-last:border-r-[var(--c3-white-20)]">
      {children}
    </div>
  );
}
