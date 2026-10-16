import type { ButtonItem } from "@/lib/sections/types";
import { ButtonContent, buttonClassName, type ButtonLayout } from "./parts";
import { ModalButton } from "./ModalButton";

type ButtonProps = ButtonLayout & {
  button: ButtonItem;
  tabIndex?: number;
};

/**
 * C3-style "md" button: 60px tall, label bottom-left, arrow top-right that
 * nudges on hover. Links by default; with `openInModal` it opens `url` in the
 * video modal instead.
 */
export function Button({ button, tabIndex, ...layout }: ButtonProps) {
  if (button.openInModal) {
    return <ModalButton button={button} tabIndex={tabIndex} {...layout} />;
  }
  return (
    <a
      href={button.url}
      target={button.openInNewTab ? "_blank" : undefined}
      rel={button.openInNewTab ? "noopener noreferrer" : undefined}
      tabIndex={tabIndex}
      className={buttonClassName(button.style, layout)}
    >
      <ButtonContent label={button.label} />
    </a>
  );
}
