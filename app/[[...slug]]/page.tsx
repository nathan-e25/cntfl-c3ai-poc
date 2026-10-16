import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFlexiblePageBySlug } from "@/lib/contentful/pages";
import { getFooter } from "@/lib/contentful/footer";
import { getHeader } from "@/lib/contentful/header";
import { Footer } from "@/components/global/Footer";
import { Header } from "@/components/global/Header";
import { SectionsRenderer } from "@/lib/sections/SectionsRenderer";
import { splitLocaleFromSlug } from "@/lib/i18n/locale";
import type { SeoEntry } from "@/lib/sections/types";

// Cache Components (Next 16) replacement for `dynamic = "force-dynamic"`:
// render on each request so Contentful edits show up without a rebuild.
export const instant = false;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const slugPathFrom = (segments: string[]) =>
  segments.length ? `/${segments.join("/")}` : "/";

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { locale, rest } = splitLocaleFromSlug(slug);
  const page = await getFlexiblePageBySlug(slugPathFrom(rest), {
    locale: locale.contentfulCode,
  });
  if (!page) return {};

  const seo = page.seo;
  const title = seo?.metaTitle ?? seo?.title ?? page.pageTitle ?? undefined;
  const description = seo?.description ?? undefined;
  const ogTitle = seo?.ogTitle ?? title;
  const ogDescription = seo?.ogDescription ?? description;
  const ogImage = seo?.ogImage ?? null;
  const twitterImage = seo?.twitterImage ?? seo?.ogImage ?? null;

  const keywords = seo?.keywords
    ? seo.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph:
      ogTitle || ogDescription || ogImage?.url
        ? {
            title: ogTitle,
            description: ogDescription,
            type:
              (seo?.ogType as "website" | "article" | "profile") ?? "website",
            images: ogImage?.url
              ? [
                  {
                    url: ogImage.url,
                    width: ogImage.width ?? undefined,
                    height: ogImage.height ?? undefined,
                  },
                ]
              : undefined,
          }
        : undefined,
    twitter:
      seo?.twitterCard || seo?.twitterTitle || twitterImage?.url
        ? {
            card:
              (seo?.twitterCard as "summary" | "summary_large_image") ??
              "summary_large_image",
            title: seo?.twitterTitle ?? ogTitle,
            description: seo?.twitterDescription ?? ogDescription,
            images: twitterImage?.url ? [twitterImage.url] : undefined,
          }
        : undefined,
    robots:
      seo?.noIndex || seo?.noFollow
        ? { index: !seo.noIndex, follow: !seo.noFollow }
        : undefined,
  };
};

/**
 * Builds the JSON-LD graph for AEO: a WebPage (+ SpeakableSpecification when
 * selectors are set), a FAQPage from the `faqs` JSON field, and any raw
 * `schemaMarkup` (Object field) injected verbatim. One script string per node.
 */
const buildJsonLd = (seo: SeoEntry | null): string[] => {
  if (!seo) return [];
  const scripts: string[] = [];

  const speakable = seo.speakableSelectors
    ? seo.speakableSelectors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  if (speakable.length || seo.primaryEntity || seo.shortAnswer) {
    scripts.push(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        ...(seo.metaTitle || seo.title
          ? { name: seo.metaTitle ?? seo.title }
          : {}),
        ...(seo.description ? { description: seo.description } : {}),
        ...(seo.primaryEntity ? { about: seo.primaryEntity } : {}),
        ...(seo.shortAnswer ? { abstract: seo.shortAnswer } : {}),
        ...(speakable.length
          ? {
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: speakable,
              },
            }
          : {}),
      })
    );
  }

  const faqs = (seo.faqs ?? []).filter((f) => f?.question && f?.answer);
  if (faqs.length) {
    scripts.push(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      })
    );
  }

  if (seo.schemaMarkup) {
    const raw =
      typeof seo.schemaMarkup === "string"
        ? seo.schemaMarkup.trim()
        : JSON.stringify(seo.schemaMarkup);
    if (raw && raw !== "null" && raw !== "{}" && raw !== "[]") {
      scripts.push(raw);
    }
  }

  return scripts;
};

export default async function FlexiblePageRoute({ params }: PageProps) {
  const { slug } = await params;
  const { locale, rest } = splitLocaleFromSlug(slug);
  const slugPath = slugPathFrom(rest);
  const [page, header, footer] = await Promise.all([
    getFlexiblePageBySlug(slugPath, { locale: locale.contentfulCode }),
    getHeader({ locale: locale.contentfulCode }),
    getFooter({ locale: locale.contentfulCode }),
  ]);
  if (!page) notFound();

  const jsonLd = buildJsonLd(page.seo);

  return (
    <>
      {header ? <Header header={header} /> : null}
      <main id="main-content" lang={locale.htmlLang}>
        {jsonLd.map((script, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ))}
        <SectionsRenderer sections={page.sections} />
      </main>
      {footer ? <Footer footer={footer} /> : null}
    </>
  );
}
