export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFields on Seo {
    sys {
      id
    }
    title
    metaTitle
    description
    keywords
    canonicalUrl
    noIndex
    noFollow
    ogTitle
    ogDescription
    ogImage {
      url
      width
      height
    }
    ogType
    twitterCard
    twitterTitle
    twitterDescription
    twitterImage {
      url
      width
      height
    }
    shortAnswer
    keyTakeaways
    primaryEntity
    aiSummary
    speakableSelectors
    faqs
    schemaMarkup
  }
`;
