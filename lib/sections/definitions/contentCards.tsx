import { contentfulFetch } from "@/lib/contentful/client";
import { CONTENT_CARDS_BY_ID } from "@/lib/contentful/graphql/queries/contentCards";
import { mapButton, type RawButton } from "@/lib/contentful/button";
import type { SectionDefinition } from "@/lib/sections/config";
import type {
  ContentCardsFrontEndComponent,
  ContentCardsSection,
  MediaAsset,
} from "@/lib/sections/types";
import { ContentCards } from "@/components/sections/ContentCards";

type RawMedia = { url: string; contentType?: string | null } | null | undefined;

type ContentCardsResponse = {
  contentCards: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    eyebrow?: string | null;
    lines?: string[] | null;
    button?: RawButton;
    icon?: { url: string; width?: number | null; height?: number | null } | null;
    backgroundMedia?: RawMedia;
    popupMedia?: RawMedia;
    showPopup?: boolean | null;
  } | null;
};

const FRONT_END_COMPONENTS: ContentCardsFrontEndComponent[] = ["Promotion"];

const mapMedia = (raw: RawMedia): MediaAsset | null =>
  raw?.url ? { url: raw.url, contentType: raw.contentType ?? null } : null;

export const contentCardsDefinition: SectionDefinition = {
  contentfulTypename: "ContentCards",
  type: "contentCards",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<ContentCardsResponse>(
      CONTENT_CARDS_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.contentCards;
    if (!raw) return null;
    return {
      id: raw.sys.id,
      type: "contentCards",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      eyebrow: raw.eyebrow ?? null,
      lines: raw.lines ?? [],
      button: raw.button ? mapButton(raw.button) : null,
      icon: raw.icon?.url
        ? { url: raw.icon.url, width: raw.icon.width ?? null, height: raw.icon.height ?? null }
        : null,
      backgroundMedia: mapMedia(raw.backgroundMedia),
      popupMedia: mapMedia(raw.popupMedia),
      showPopup: raw.showPopup ?? false,
    } satisfies ContentCardsSection;
  },
  render: (section) =>
    section.type === "contentCards" ? <ContentCards section={section} /> : null,
};
