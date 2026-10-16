import type { SideBySideSection } from "@/lib/sections/types";
import { LeftContentRightImage } from "./LeftContentRightImage";

type SideBySideProps = { section: SideBySideSection };

export function SideBySide({ section }: SideBySideProps) {
  switch (section.frontEndComponent) {
    case "Left content right image":
      return <LeftContentRightImage section={section} />;
    default:
      return <LeftContentRightImage section={section} />;
  }
}
