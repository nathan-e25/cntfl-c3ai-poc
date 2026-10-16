"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type VideoModalProps = {
  /** Embed URL (e.g. a Vimeo player URL with autoplay=1). `null` = closed. */
  url: string | null;
  onClose: () => void;
};

/**
 * Full-screen video lightbox: dark backdrop, a 95vw × 95vh embed and a close
 * icon. Closes on backdrop click, the close button, or Escape; locks page
 * scroll while open. Unmounting the iframe stops playback.
 */
export function VideoModal({ url, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [url, onClose]);

  if (!url) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--c3-modal-backdrop)] p-[2.5%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[95vh] w-[95vw] items-center justify-center">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-0 right-0 flex cursor-pointer items-center border-none bg-transparent p-1 text-[var(--c3-white)] hover:opacity-70"
        >
          <span className="material-symbols-outlined text-[28px]!">close</span>
        </button>
        <iframe
          src={url}
          title="Video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="block h-full w-full rounded-[12px] border-none bg-black object-contain"
        />
      </div>
    </div>,
    document.body
  );
}
