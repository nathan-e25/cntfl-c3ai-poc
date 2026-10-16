import type { FooterData } from "@/lib/sections/types";
import { FooterDefault } from "./FooterDefault";

type FooterProps = { footer: FooterData };

export function Footer({ footer }: FooterProps) {
  switch (footer.frontEndComponent) {
    case "Footer Default":
      return <FooterDefault footer={footer} />;
    default:
      return <FooterDefault footer={footer} />;
  }
}
