import { contentfulFetch } from "./client";
import { FOOTER_QUERY } from "./graphql/queries/footer";
import { mapButtons, type RawButton } from "./button";
import type {
  FooterData,
  FooterFrontEndComponent,
  FooterLinkGroup,
  SocialLink,
} from "@/lib/sections/types";

export type RawGroup = {
  sys: { id: string };
  heading?: string | null;
  linksCollection?: { items: RawButton[] } | null;
} | null;

type FooterResponse = {
  footerCollection?: {
    items: Array<{
      sys: { id: string };
      frontEndComponent?: string | null;
      logo?: {
        url: string;
        width?: number | null;
        height?: number | null;
        description?: string | null;
        title?: string | null;
      } | null;
      logoUrl?: string | null;
      primaryGroupsCollection?: { items: RawGroup[] } | null;
      secondaryGroupsCollection?: { items: RawGroup[] } | null;
      socialLinksCollection?: {
        items: Array<{
          sys: { id: string };
          title?: string | null;
          url?: string | null;
          icon?: { url: string } | null;
        } | null>;
      } | null;
      legalLinksCollection?: { items: RawButton[] } | null;
      copyright?: string | null;
    } | null>;
  } | null;
};

const FRONT_END_COMPONENTS: FooterFrontEndComponent[] = ["Footer Default"];

export const mapGroups = (items: RawGroup[] | undefined): FooterLinkGroup[] =>
  (items ?? []).flatMap((g) =>
    g ? [{ id: g.sys.id, heading: g.heading ?? null, links: mapButtons(g.linksCollection?.items) }] : []
  );

type FetchOptions = { preview?: boolean; locale?: string };

/** Site-wide footer (first published entry); `null` when none exists or the fetch fails. */
export async function getFooter({ preview, locale }: FetchOptions = {}): Promise<FooterData | null> {
  try {
    const data = await contentfulFetch<FooterResponse>(
      FOOTER_QUERY,
      { preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.footerCollection?.items?.[0];
    if (!raw) return null;
    return {
      id: raw.sys.id,
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      logo: raw.logo?.url
        ? {
            url: raw.logo.url,
            width: raw.logo.width ?? null,
            height: raw.logo.height ?? null,
            alt: raw.logo.description || raw.logo.title || "",
          }
        : null,
      logoUrl: raw.logoUrl ?? "/",
      primaryGroups: mapGroups(raw.primaryGroupsCollection?.items),
      secondaryGroups: mapGroups(raw.secondaryGroupsCollection?.items),
      socialLinks: (raw.socialLinksCollection?.items ?? []).flatMap((s): SocialLink[] =>
        s?.url && s.icon?.url
          ? [{ id: s.sys.id, title: s.title ?? "", url: s.url, iconUrl: s.icon.url }]
          : []
      ),
      legalLinks: mapButtons(raw.legalLinksCollection?.items),
      copyright: raw.copyright ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch footer:", error);
    return null;
  }
}
