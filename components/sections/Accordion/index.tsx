import type { AccordionSection } from "@/lib/sections/types";
import { CustomerStories } from "./CustomerStories";

type AccordionProps = { section: AccordionSection };

export function Accordion({ section }: AccordionProps) {
  switch (section.frontEndComponent) {
    case "Customer stories":
      return <CustomerStories section={section} />;
    default:
      return <CustomerStories section={section} />;
  }
}
