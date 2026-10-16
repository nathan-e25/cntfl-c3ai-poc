import type { BannerSection } from "@/lib/sections/types";
import { BannerHero } from "./BannerHero";

type BannerProps = { section: BannerSection };

export function Banner({ section }: BannerProps) {
  switch (section.frontEndComponent) {
    case "Banner Hero":
      return <BannerHero section={section} />;
    default:
      return <BannerHero section={section} />;
  }
}
