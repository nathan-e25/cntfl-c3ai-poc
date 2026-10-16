import { contentfulFetch } from "@/lib/contentful/client";
import { ACCORDION_BY_ID } from "@/lib/contentful/graphql/queries/accordion";
import { mapButton, type RawButton } from "@/lib/contentful/button";
import type { RichTextDocument } from "@/lib/contentful/richText";
import type { SectionDefinition } from "@/lib/sections/config";
import type {
  AccordionFrontEndComponent,
  AccordionItem,
  AccordionSection,
} from "@/lib/sections/types";
import { Accordion } from "@/components/sections/Accordion";

type RawItem = {
  sys: { id: string };
  title?: string | null;
  heading?: string | null;
  body?: { json: RichTextDocument } | null;
  portrait?: {
    url: string;
    width?: number | null;
    height?: number | null;
    description?: string | null;
  } | null;
  portraitLabel?: string | null;
  portraitVideoUrl?: string | null;
  personName?: string | null;
  personTitle?: string | null;
  button?: RawButton;
  statsCollection?: {
    items: Array<{ sys: { id: string }; value?: string | null; label?: string | null } | null>;
  } | null;
  backgroundVideo?: { url: string; contentType?: string | null } | null;
  backgroundVideoAlt?: string | null;
} | null;

type AccordionResponse = {
  accordion: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    body?: { json: RichTextDocument } | null;
    button?: RawButton;
    itemsCollection?: { items: RawItem[] } | null;
  } | null;
};

const FRONT_END_COMPONENTS: AccordionFrontEndComponent[] = ["Customer stories"];

const mapItem = (raw: RawItem): AccordionItem | null => {
  if (!raw) return null;
  return {
    id: raw.sys.id,
    title: raw.title ?? "",
    heading: raw.heading ?? null,
    body: raw.body?.json ?? null,
    portrait: raw.portrait?.url
      ? {
          url: raw.portrait.url,
          width: raw.portrait.width ?? null,
          height: raw.portrait.height ?? null,
          alt: raw.portrait.description ?? null,
        }
      : null,
    portraitLabel: raw.portraitLabel ?? null,
    portraitVideoUrl: raw.portraitVideoUrl ?? null,
    personName: raw.personName ?? null,
    personTitle: raw.personTitle ?? null,
    button: raw.button ? mapButton(raw.button) : null,
    stats: (raw.statsCollection?.items ?? []).flatMap((s) =>
      s?.value ? [{ id: s.sys.id, value: s.value, label: s.label ?? null }] : []
    ),
    backgroundVideo: raw.backgroundVideo?.url
      ? {
          url: raw.backgroundVideo.url,
          contentType: raw.backgroundVideo.contentType ?? null,
        }
      : null,
    backgroundVideoAlt: raw.backgroundVideoAlt ?? null,
  };
};

export const accordionDefinition: SectionDefinition = {
  contentfulTypename: "Accordion",
  type: "accordion",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<AccordionResponse>(
      ACCORDION_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.accordion;
    if (!raw) return null;
    return {
      id: raw.sys.id,
      type: "accordion",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      body: raw.body?.json ?? null,
      button: raw.button ? mapButton(raw.button) : null,
      items: (raw.itemsCollection?.items ?? [])
        .map(mapItem)
        .filter((i): i is AccordionItem => i !== null),
    } satisfies AccordionSection;
  },
  render: (section) =>
    section.type === "accordion" ? <Accordion section={section} /> : null,
};
