import type { ContentCardsSection } from "@/lib/sections/types";
import { Promotion } from "./Promotion";

type ContentCardsProps = { section: ContentCardsSection };

export function ContentCards({ section }: ContentCardsProps) {
  switch (section.frontEndComponent) {
    case "Promotion":
      return <Promotion section={section} />;
    default:
      return <Promotion section={section} />;
  }
}
