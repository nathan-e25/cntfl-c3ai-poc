import type { ButtonItem, ButtonStyle } from "@/lib/sections/types";

export type RawButton = {
  sys: { id: string };
  label?: string | null;
  url?: string | null;
  style?: string | null;
  openInNewTab?: boolean | null;
  openInModal?: boolean | null;
} | null;

const BUTTON_STYLES: ButtonStyle[] = [
  "Primary",
  "Secondary",
  "Primary Inverse",
  "Ghost Inverse",
  "Product",
];

export const mapButton = (raw: RawButton): ButtonItem | null => {
  if (!raw?.label || !raw.url) return null;
  const style = BUTTON_STYLES.find((s) => s === raw.style) ?? "Primary";
  return {
    id: raw.sys.id,
    label: raw.label,
    url: raw.url,
    style,
    openInNewTab: raw.openInNewTab ?? false,
    openInModal: raw.openInModal ?? false,
  };
};

export const mapButtons = (items: RawButton[] | null | undefined): ButtonItem[] =>
  (items ?? []).map(mapButton).filter((c): c is ButtonItem => c !== null);
