import { contentfulFetch } from "@/lib/contentful/client";
import { SLIDER_BY_ID } from "@/lib/contentful/graphql/queries/slider";
import { mapButton, mapButtons, type RawButton } from "@/lib/contentful/button";
import type { RichTextDocument } from "@/lib/contentful/richText";
import type { SectionDefinition } from "@/lib/sections/config";
import type {
  SliderFrontEndComponent,
  SliderItem,
  SliderSection,
} from "@/lib/sections/types";
import { Slider } from "@/components/sections/Slider";

type RawSliderItem = {
  sys: { id: string };
  title?: string | null;
  imageHeight?: number | null;
  image?: {
    url: string;
    width?: number | null;
    height?: number | null;
  } | null;
  tabLabel?: string | null;
  heading?: string | null;
  body?: { json: RichTextDocument } | null;
  listLabel?: string | null;
  cta?: RawButton;
  linksCollection?: { items: RawButton[] } | null;
} | null;

type SliderResponse = {
  slider: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    intro?: { json: RichTextDocument } | null;
    itemsCollection?: { items: RawSliderItem[] } | null;
  } | null;
};

const FRONT_END_COMPONENTS: SliderFrontEndComponent[] = [
  "Logo Slider",
  "Tab Slider",
];

const mapItem = (raw: RawSliderItem): SliderItem | null => {
  if (!raw?.image?.url) return null;
  return {
    id: raw.sys.id,
    title: raw.title ?? "",
    image: {
      url: raw.image.url,
      width: raw.image.width ?? null,
      height: raw.image.height ?? null,
    },
    imageHeight: raw.imageHeight ?? null,
    tabLabel: raw.tabLabel ?? null,
    heading: raw.heading ?? null,
    body: raw.body?.json ?? null,
    listLabel: raw.listLabel ?? null,
    cta: raw.cta ? mapButton(raw.cta) : null,
    links: mapButtons(raw.linksCollection?.items),
  };
};

export const sliderDefinition: SectionDefinition = {
  contentfulTypename: "Slider",
  type: "slider",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<SliderResponse>(
      SLIDER_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.slider;
    if (!raw) return null;
    return {
      id: raw.sys.id,
      type: "slider",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      intro: raw.intro?.json ?? null,
      items: (raw.itemsCollection?.items ?? [])
        .map(mapItem)
        .filter((i): i is SliderItem => i !== null),
    } satisfies SliderSection;
  },
  render: (section) =>
    section.type === "slider" ? <Slider section={section} /> : null,
};
