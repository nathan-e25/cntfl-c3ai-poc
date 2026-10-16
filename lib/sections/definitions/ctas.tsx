import { contentfulFetch } from "@/lib/contentful/client";
import { CTAS_BY_ID } from "@/lib/contentful/graphql/queries/ctas";
import { mapButtons, type RawButton } from "@/lib/contentful/button";
import type { RichTextDocument } from "@/lib/contentful/richText";
import type { SectionDefinition } from "@/lib/sections/config";
import type { CtasFrontEndComponent, CtasSection } from "@/lib/sections/types";
import { Ctas } from "@/components/sections/Ctas";

type CtasResponse = {
  ctas: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    body?: { json: RichTextDocument } | null;
    backgroundMedia?: { url: string; contentType?: string | null } | null;
    buttonsCollection?: { items: RawButton[] } | null;
  } | null;
};

const FRONT_END_COMPONENTS: CtasFrontEndComponent[] = ["CTA Default"];

export const ctasDefinition: SectionDefinition = {
  contentfulTypename: "Ctas",
  type: "ctas",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<CtasResponse>(
      CTAS_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.ctas;
    if (!raw) return null;
    return {
      id: raw.sys.id,
      type: "ctas",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      body: raw.body?.json ?? null,
      backgroundMedia: raw.backgroundMedia?.url
        ? {
            url: raw.backgroundMedia.url,
            contentType: raw.backgroundMedia.contentType ?? null,
          }
        : null,
      buttons: mapButtons(raw.buttonsCollection?.items),
    } satisfies CtasSection;
  },
  render: (section) =>
    section.type === "ctas" ? <Ctas section={section} /> : null,
};
