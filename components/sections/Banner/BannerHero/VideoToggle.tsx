"use client";

import { useEffect, useState } from "react";

type VideoToggleProps = {
  videoId: string;
};

/** Pause / play control for the hero's background video. */
export function VideoToggle({ videoId }: VideoToggleProps) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = document.getElementById(videoId) as HTMLVideoElement | null;
    if (!video) return;
    // React sets `muted` as a property only, so make sure autoplay isn't blocked.
    video.muted = true;
    if (video.paused) video.play().catch(() => setPaused(true));
    const sync = () => setPaused(video.paused);
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
    };
  }, [videoId]);

  const toggle = () => {
    const video = document.getElementById(videoId) as HTMLVideoElement | null;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={paused ? "Play background video" : "Pause background video"}
      className="mt-4 flex size-11 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[var(--c3-white)] hover:opacity-85 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c3-white)] lg:absolute lg:bottom-[clamp(0.75rem,0.5281rem+0.9864vw,1.25rem)] lg:left-[clamp(0.75rem,0.5281rem+0.9864vw,1.25rem)] lg:z-[6] lg:mt-0"
    >
      <span className="material-symbols-outlined text-[length:clamp(1.125rem,1.0146rem+0.4906vw,1.5rem)]! [font-variation-settings:'FILL'_1]">
        {paused ? "play_circle" : "pause_circle"}
      </span>
    </button>
  );
}
