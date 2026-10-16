import { BUTTON_FRAGMENT } from "../fragments/button";

const SIDE_BY_SIDE_ROW_FRAGMENT = /* GraphQL */ `
  fragment SideBySideRowFields on SideBySide {
    sys {
      id
    }
    heading
    body {
      json
    }
    media {
      url
      contentType
      width
      height
    }
    mediaAlt
    link {
      ...ButtonFields
    }
  }
`;

export const SIDE_BY_SIDE_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  ${SIDE_BY_SIDE_ROW_FRAGMENT}
  query SideBySideById($id: String!, $preview: Boolean, $locale: String) {
    sideBySide(id: $id, preview: $preview, locale: $locale) {
      frontEndComponent
      ...SideBySideRowFields
      itemsCollection(limit: 20) {
        items {
          ...SideBySideRowFields
        }
      }
    }
  }
`;
