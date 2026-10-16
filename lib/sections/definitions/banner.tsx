import { contentfulFetch } from "@/lib/contentful/client";
import { BANNER_BY_ID } from "@/lib/contentful/graphql/queries/banner";
import { mapButtons, type RawButton } from "@/lib/contentful/button";
import type { RichTextDocument } from "@/lib/contentful/richText";
import type { SectionDefinition } from "@/lib/sections/config";
import type { BannerFrontEndComponent, BannerSection } from "@/lib/sections/types";
import { Banner } from "@/components/sections/Banner";

type BannerResponse = {
  banner: {
    sys: { id: string };
    frontEndComponent?: string | null;
    heading?: string | null;
    subheading?: string | null;
    body?: { json: RichTextDocument } | null;
    backgroundVideo?: { url: string; contentType?: string | null } | null;
    backgroundImage?: { url: string; width?: number | null; height?: number | null } | null;
    backgroundAlt?: string | null;
    ctasCollection?: { items: RawButton[] } | null;
  } | null;
};

const FRONT_END_COMPONENTS: BannerFrontEndComponent[] = ["Banner Hero"];

export const bannerDefinition: SectionDefinition = {
  contentfulTypename: "Banner",
  type: "banner",
  hydrate: async (id, { preview, locale }) => {
    const data = await contentfulFetch<BannerResponse>(
      BANNER_BY_ID,
      { id, preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.banner;
    if (!raw) return null;
    return {
      id: raw.sys.id,
      type: "banner",
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      subheading: raw.subheading ?? null,
      body: raw.body?.json ?? null,
      backgroundVideo: raw.backgroundVideo?.url
        ? {
            url: raw.backgroundVideo.url,
            contentType: raw.backgroundVideo.contentType ?? null,
          }
        : null,
      backgroundImage: raw.backgroundImage?.url
        ? {
            url: raw.backgroundImage.url,
            width: raw.backgroundImage.width ?? null,
            height: raw.backgroundImage.height ?? null,
          }
        : null,
      backgroundAlt: raw.backgroundAlt ?? null,
      ctas: mapButtons(raw.ctasCollection?.items),
    } satisfies BannerSection;
  },
  render: (section) =>
    section.type === "banner" ? <Banner section={section} /> : null,
};
