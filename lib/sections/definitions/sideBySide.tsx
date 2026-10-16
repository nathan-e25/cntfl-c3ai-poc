import { contentfulFetch } from "@/lib/contentful/client";
import { SIDE_BY_SIDE_BY_ID } from "@/lib/contentful/graphql/queries/sideBySide";
import { mapButton, type RawButton } from "@/lib/contentful/button";
import type { RichTextDocument } from "@/lib/contentful/richText";
import type { SectionDefinition } from "@/lib/sections/config";
import type {
  SideBySideFrontEndComponent,
  SideBySideRow,
  SideBySideSection,
} from "@/lib/sections/types";
import { SideBySide } from "@/components/sections/SideBySide";

type RawRow = {
  sys: { id: string };
  heading?: string | null;
  body?: { json: RichTextDocument } | null;
  media?: {
    url: string;
    contentType?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  mediaAlt?: string | null;
  link?: RawButton;
};

type SideBySideResponse = {
  sideBySide:
    | (RawRow & {
        frontEndComponent?: string | null;
        itemsCollection?: { items: Array<RawRow | null> } | null;
      })
    | null;
};

const FRONT_END_COMPONENTS: SideBySideFrontEndComponent[] = [
  "Left content right image",
];

const mapRow = (raw: RawRow): SideBySideRow => ({
  id: raw.sys.id,
  heading: raw.heading ?? null,
  body: raw.body?.json ?? null,
  media: raw.media?.url
    ? {
        url: raw.media.url,
        contentType: raw.media.contentType ?? null,
        width: raw.media.width ?? null,
        height: raw.media.height ?? null,
      }
    : null,
  mediaAlt: raw.mediaAlt ?? null,
  link: raw.link ? mapButton(raw.link) : null,
});

export const sideBySideDefinition: SectionDefinition = {
  contentfulTypename: "SideBySide",
  type: "sideBySide",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<SideBySideResponse>(
      SIDE_BY_SIDE_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.sideBySide;
    if (!raw) return null;
    return {
      ...mapRow(raw),
      type: "sideBySide",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      items: (raw.itemsCollection?.items ?? [])
        .filter((r): r is RawRow => r !== null)
        .map(mapRow),
    } satisfies SideBySideSection;
  },
  render: (section) =>
    section.type === "sideBySide" ? <SideBySide section={section} /> : null,
};
