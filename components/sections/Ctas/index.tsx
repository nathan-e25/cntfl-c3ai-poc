import type { CtasSection } from "@/lib/sections/types";
import { CtaDefault } from "./CtaDefault";

type CtasProps = { section: CtasSection };

export function Ctas({ section }: CtasProps) {
  switch (section.frontEndComponent) {
    case "CTA Default":
      return <CtaDefault section={section} />;
    default:
      return <CtaDefault section={section} />;
  }
}
