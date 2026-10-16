import { contentfulFetch } from "./client";
import { HEADER_QUERY } from "./graphql/queries/header";
import { mapButton, type RawButton } from "./button";
import { mapGroups, type RawGroup } from "./footer";
import type {
  HeaderData,
  HeaderFrontEndComponent,
  HeaderNavItem,
} from "@/lib/sections/types";

type RawNavItem = {
  sys: { id: string };
  label?: string | null;
  url?: string | null;
  dropdownHeading?: string | null;
  centerSectionsCollection?: { items: RawGroup[] } | null;
  rightSectionsCollection?: { items: RawGroup[] } | null;
  rightImage?: { url: string } | null;
  rightImageAlt?: string | null;
  captionLabel?: string | null;
  captionLink?: RawButton;
} | null;

type HeaderResponse = {
  headerCollection?: {
    items: Array<{
      sys: { id: string };
      frontEndComponent?: string | null;
      logo?: { url: string; title?: string | null; description?: string | null } | null;
      logoUrl?: string | null;
      navItemsCollection?: { items: RawNavItem[] } | null;
      contactLabel?: string | null;
      mobileContactLabel?: string | null;
      contactUrl?: string | null;
      searchLabel?: string | null;
      searchFieldLabel?: string | null;
      searchAction?: string | null;
    } | null>;
  } | null;
};

const FRONT_END_COMPONENTS: HeaderFrontEndComponent[] = ["Header Default"];

const mapNavItem = (raw: RawNavItem): HeaderNavItem | null => {
  if (!raw?.label) return null;
  const center = mapGroups(raw.centerSectionsCollection?.items);
  const rightSections = mapGroups(raw.rightSectionsCollection?.items);
  const hasDropdown = center.length > 0 || rightSections.length > 0 || !!raw.rightImage?.url;
  return {
    id: raw.sys.id,
    label: raw.label,
    url: raw.url ?? null,
    dropdown: hasDropdown
      ? {
          heading: raw.dropdownHeading ?? null,
          centerSections: center,
          right: raw.rightImage?.url
            ? {
                type: "image",
                src: raw.rightImage.url,
                alt: raw.rightImageAlt ?? "",
                captionLabel: raw.captionLabel ?? null,
                captionLink: raw.captionLink ? mapButton(raw.captionLink) : null,
              }
            : { type: "links", sections: rightSections },
        }
      : null,
  };
};

type FetchOptions = { preview?: boolean; locale?: string };

/** Site-wide header (first published entry); `null` when none exists or the fetch fails. */
export async function getHeader({ preview, locale }: FetchOptions = {}): Promise<HeaderData | null> {
  try {
    const data = await contentfulFetch<HeaderResponse>(
      HEADER_QUERY,
      { preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.headerCollection?.items?.[0];
    if (!raw) return null;
    return {
      id: raw.sys.id,
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      logo: raw.logo?.url
        ? { url: raw.logo.url, alt: raw.logo.description || `${raw.logo.title ?? ""} Logo`.trim() }
        : null,
      logoUrl: raw.logoUrl ?? "/",
      navItems: (raw.navItemsCollection?.items ?? [])
        .map(mapNavItem)
        .filter((n): n is HeaderNavItem => n !== null),
      contactLabel: raw.contactLabel ?? "Contact Us",
      mobileContactLabel: raw.mobileContactLabel ?? raw.contactLabel ?? "Contact",
      contactUrl: raw.contactUrl ?? "/contact-us",
      searchLabel: raw.searchLabel ?? "Search",
      searchFieldLabel: raw.searchFieldLabel ?? "Search",
      searchAction: raw.searchAction ?? "/search",
    };
  } catch (error) {
    console.error("Failed to fetch header:", error);
    return null;
  }
}
