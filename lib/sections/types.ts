import type { RichTextDocument } from "@/lib/contentful/richText";

export type ImageAsset = {
  url: string | null;
  width?: number | null;
  height?: number | null;
};

export type SeoFaq = {
  question: string | null;
  answer: string | null;
};

export type SeoEntry = {
  sys: { id: string };
  /** Internal title of the SEO entry (Contentful displayField). */
  title?: string | null;

  // Core meta
  /** The <title> tag; falls back to the page title when null. */
  metaTitle?: string | null;
  description?: string | null;
  /** Comma-separated keywords / focus terms. */
  keywords?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;

  // Open Graph
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: ImageAsset | null;
  /** website | article | product | profile */
  ogType?: string | null;

  // Twitter / X
  /** summary | summary_large_image */
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: ImageAsset | null;

  // AEO (Answer Engine Optimization)
  /** Concise direct answer to the page's core question. */
  shortAnswer?: string | null;
  /** Newline-separated summary points. */
  keyTakeaways?: string | null;
  /** Primary entity/topic the page is about. */
  primaryEntity?: string | null;
  /** LLM-optimized page summary. */
  aiSummary?: string | null;
  /** Comma-separated CSS selectors for schema.org SpeakableSpecification. */
  speakableSelectors?: string | null;
  /** JSON array of Q&A pairs, rendered as FAQPage JSON-LD. */
  faqs?: SeoFaq[] | null;

  /** Raw JSON-LD (Object field), injected verbatim. */
  schemaMarkup?: unknown | null;
};

/**
 * Every concrete section extends BaseSection and sets a unique `type` literal.
 * Add your section types to the `Section` union below as you build them out.
 * See `components/ARCHITECTURE.md` for the full pattern.
 */
export type BaseSection = {
  id: string;
  type: string;
};

export type UnknownSection = BaseSection & {
  type: "unknown";
  raw: unknown;
};

export type ButtonStyle =
  | "Primary"
  | "Secondary"
  | "Primary Inverse"
  | "Ghost Inverse"
  | "Product";

export type ButtonItem = {
  id: string;
  label: string;
  url: string;
  style: ButtonStyle;
  openInNewTab: boolean;
  /** Open `url` (a video embed) in the video modal instead of navigating. */
  openInModal: boolean;
};

export type BannerFrontEndComponent = "Banner Hero";

export type BannerSection = BaseSection & {
  type: "banner";
  frontEndComponent: BannerFrontEndComponent | null;
  heading: string | null;
  subheading: string | null;
  body: RichTextDocument | null;
  backgroundVideo: { url: string; contentType: string | null } | null;
  backgroundImage: ImageAsset | null;
  backgroundAlt: string | null;
  ctas: ButtonItem[];
};

export type SliderFrontEndComponent = "Logo Slider" | "Tab Slider";

export type SliderItem = {
  id: string;
  title: string;
  image: ImageAsset & { url: string };
  /** Display height in px; width follows the image's aspect ratio. */
  imageHeight: number | null;
  /** Tab Slider fields. */
  tabLabel: string | null;
  heading: string | null;
  body: RichTextDocument | null;
  listLabel: string | null;
  cta: ButtonItem | null;
  links: ButtonItem[];
};

export type SliderSection = BaseSection & {
  type: "slider";
  frontEndComponent: SliderFrontEndComponent | null;
  heading: string | null;
  intro: RichTextDocument | null;
  items: SliderItem[];
};

export type SideBySideFrontEndComponent = "Left content right image";

export type SideBySideRow = {
  id: string;
  heading: string | null;
  body: RichTextDocument | null;
  /** Image or video asset; `contentType` decides which element renders. */
  media: (ImageAsset & { url: string; contentType: string | null }) | null;
  mediaAlt: string | null;
  link: ButtonItem | null;
};

/**
 * Without `items` the entry renders as a single row. With `items` its own
 * heading / body / link become a section header (title, intro, button) and
 * each item renders as a row below it.
 */
export type SideBySideSection = BaseSection &
  SideBySideRow & {
    type: "sideBySide";
    frontEndComponent: SideBySideFrontEndComponent | null;
    items: SideBySideRow[];
  };

export type CtasFrontEndComponent = "CTA Default";

export type CtasSection = BaseSection & {
  type: "ctas";
  frontEndComponent: CtasFrontEndComponent | null;
  heading: string | null;
  body: RichTextDocument | null;
  /** Image or video; `contentType` decides which element renders. */
  backgroundMedia: { url: string; contentType: string | null } | null;
  buttons: ButtonItem[];
};

export type AccordionFrontEndComponent = "Customer stories";

export type AccordionStat = { id: string; value: string; label: string | null };

export type AccordionItem = {
  id: string;
  title: string;
  heading: string | null;
  body: RichTextDocument | null;
  portrait: (ImageAsset & { url: string; alt: string | null }) | null;
  portraitLabel: string | null;
  /** Embed URL opened in the video modal when the portrait is clicked. */
  portraitVideoUrl: string | null;
  personName: string | null;
  personTitle: string | null;
  button: ButtonItem | null;
  stats: AccordionStat[];
  backgroundVideo: { url: string; contentType: string | null } | null;
  backgroundVideoAlt: string | null;
};

export type AccordionSection = BaseSection & {
  type: "accordion";
  frontEndComponent: AccordionFrontEndComponent | null;
  heading: string | null;
  body: RichTextDocument | null;
  button: ButtonItem | null;
  items: AccordionItem[];
};

export type ContentCardsFrontEndComponent = "Promotion";

/** Image or video asset; `contentType` decides which element renders. */
export type MediaAsset = { url: string; contentType: string | null };

export type ContentCardsSection = BaseSection & {
  type: "contentCards";
  frontEndComponent: ContentCardsFrontEndComponent | null;
  heading: string | null;
  eyebrow: string | null;
  lines: string[];
  button: ButtonItem | null;
  icon: ImageAsset | null;
  backgroundMedia: MediaAsset | null;
  popupMedia: MediaAsset | null;
  showPopup: boolean;
};

/* ---- Global chrome (not page sections) ---- */

export type FooterFrontEndComponent = "Footer Default";

export type FooterLinkGroup = { id: string; heading: string | null; links: ButtonItem[] };

export type SocialLink = { id: string; title: string; url: string; iconUrl: string };

export type FooterData = {
  id: string;
  frontEndComponent: FooterFrontEndComponent | null;
  logo: (ImageAsset & { url: string; alt: string }) | null;
  logoUrl: string;
  primaryGroups: FooterLinkGroup[];
  secondaryGroups: FooterLinkGroup[];
  socialLinks: SocialLink[];
  legalLinks: ButtonItem[];
  copyright: string | null;
};

export type HeaderFrontEndComponent = "Header Default";

export type HeaderNavItem = {
  id: string;
  label: string;
  /** Used only when the item has no dropdown. */
  url: string | null;
  dropdown: {
    heading: string | null;
    centerSections: FooterLinkGroup[];
    /** Right column: an image + caption link, or link groups. */
    right:
      | { type: "image"; src: string; alt: string; captionLabel: string | null; captionLink: ButtonItem | null }
      | { type: "links"; sections: FooterLinkGroup[] };
  } | null;
};

export type HeaderData = {
  id: string;
  frontEndComponent: HeaderFrontEndComponent | null;
  logo: { url: string; alt: string } | null;
  logoUrl: string;
  navItems: HeaderNavItem[];
  contactLabel: string;
  mobileContactLabel: string;
  contactUrl: string;
  searchLabel: string;
  searchFieldLabel: string;
  searchAction: string;
};

export type Section =
  | UnknownSection
  | BannerSection
  | SliderSection
  | SideBySideSection
  | CtasSection
  | AccordionSection
  | ContentCardsSection;
