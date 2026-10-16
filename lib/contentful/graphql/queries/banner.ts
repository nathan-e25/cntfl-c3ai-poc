import { BUTTON_FRAGMENT } from "../fragments/button";

export const BANNER_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  query BannerById($id: String!, $preview: Boolean, $locale: String) {
    banner(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      heading
      subheading
      body {
        json
      }
      backgroundVideo {
        url
        contentType
      }
      backgroundImage {
        url
        width
        height
      }
      backgroundAlt
      ctasCollection(limit: 3) {
        items {
          ...ButtonFields
        }
      }
    }
  }
`;
