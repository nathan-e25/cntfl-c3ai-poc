import type { SliderSection } from "@/lib/sections/types";
import { LogoSlider } from "./LogoSlider";
import { TabSlider } from "./TabSlider";

type SliderProps = { section: SliderSection };

export function Slider({ section }: SliderProps) {
  switch (section.frontEndComponent) {
    case "Logo Slider":
      return <LogoSlider section={section} />;
    case "Tab Slider":
      return <TabSlider section={section} />;
    default:
      return <LogoSlider section={section} />;
  }
}
