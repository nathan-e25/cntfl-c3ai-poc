"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ContentCardsSection } from "@/lib/sections/types";
import { BackgroundMedia, Glyph, P, Subheadline } from "./parts";

const DISMISS_DAYS = 7;

/**
 * Desktop-only (`lg`+) promotion popup, bottom-right. Mounts client-side
 * after hydration; the whole card is a link and the close button hides it
 * for this page view. Like the live site, closing records a 7-day dismissal
 * in localStorage but the popup is shown again on the next page load.
 */
export function PromotionPopup({ section }: { section: ContentCardsSection }) {
  const { heading, button, popupMedia } = section;
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount after hydration only (no SSR markup), re-shown on route change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, [pathname]);

  const close = () => {
    try {
      window.localStorage.setItem(
        `promotion-popup-dismissed:${pathname}`,
        String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000)
      );
    } catch {
      // Storage can be unavailable (private mode); closing still works.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Promotion"
      className="fixed right-[clamp(0.75rem,0.4171rem+1.4797vw,1.5rem)] bottom-5 z-[400] hidden w-[276px] overflow-hidden rounded-[8px] bg-black font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased shadow-[var(--c3-popup-shadow)] lg:block"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute top-3 right-3 z-[3] flex size-7 cursor-pointer items-center justify-center rounded-full border border-solid border-[var(--c3-white-40)] bg-transparent p-0 text-[var(--c3-white)] hover:border-[var(--c3-white)]"
      >
        <span className="material-symbols-outlined text-[length:clamp(0.75rem,0.6764rem+0.3271vw,1rem)]!">
          close
        </span>
      </button>
      {popupMedia ? <BackgroundMedia media={popupMedia} /> : null}
      <div className="relative z-[1] flex h-full flex-col justify-between p-6">
        <div>
          {heading ? (
            <p className={`mb-[26px] pr-6 text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[110%] font-bold text-[var(--c3-white)] ${P}`}>
              {heading}
            </p>
          ) : null}
          <Subheadline
            section={section}
            className={`mb-4 text-[16px] leading-[135%] font-bold text-[var(--c3-white)] ${P}`}
          />
        </div>
        <div className="flex w-full items-end justify-between">
          {button ? (
            <span className="inline-block font-[family-name:var(--font-c3-mono)] text-[12px] leading-[110%] font-medium tracking-[-0.3%] text-[var(--c3-white)] no-underline">
              {button.label}
            </span>
          ) : null}
          <Glyph section={section} className="block" />
        </div>
      </div>
      {button ? (
        <a
          href={button.url}
          target={button.openInNewTab ? "_blank" : undefined}
          rel={button.openInNewTab ? "noopener noreferrer" : undefined}
          aria-label={button.label}
          className="absolute inset-0 z-[2]"
        />
      ) : null}
    </aside>
  );
}
