import type { SectionDefinition } from "./config";
import { accordionDefinition } from "./definitions/accordion";
import { bannerDefinition } from "./definitions/banner";
import { contentCardsDefinition } from "./definitions/contentCards";
import { ctasDefinition } from "./definitions/ctas";
import { sideBySideDefinition } from "./definitions/sideBySide";
import { sliderDefinition } from "./definitions/slider";

/**
 * Central section registry.
 *
 * To add a section, create:
 *   - components/sections/YourSection/index.tsx
 *   - lib/sections/definitions/yourSection.tsx (hydrate + render)
 * …then import and append the definition here.
 *
 * See `components/ARCHITECTURE.md` for the full walkthrough and the
 * switch-case mental model used inside variant routers.
 */
export const sectionRegistry: SectionDefinition[] = [
  bannerDefinition,
  sliderDefinition,
  sideBySideDefinition,
  ctasDefinition,
  accordionDefinition,
  contentCardsDefinition,
];
