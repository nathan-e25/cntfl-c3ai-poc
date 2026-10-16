"use client";

import { useCallback, useState } from "react";
import type { ButtonItem } from "@/lib/sections/types";
import { VideoModal } from "@/components/common/VideoModal";
import { ButtonContent, buttonClassName, type ButtonLayout } from "./parts";

type ModalButtonProps = ButtonLayout & {
  button: ButtonItem;
  tabIndex?: number;
};

/** A Button whose `url` is a video embed: opens it in the video modal. */
export function ModalButton({ button, tabIndex, ...layout }: ModalButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        tabIndex={tabIndex}
        onClick={() => setOpen(true)}
        className={buttonClassName(button.style, layout)}
      >
        <ButtonContent label={button.label} />
      </button>
      <VideoModal url={open ? button.url : null} onClose={close} />
    </>
  );
}
