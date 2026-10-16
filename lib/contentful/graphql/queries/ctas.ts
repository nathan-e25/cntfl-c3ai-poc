import { BUTTON_FRAGMENT } from "../fragments/button";

export const CTAS_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  query CtasById($id: String!, $preview: Boolean, $locale: String) {
    ctas(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      heading
      body {
        json
      }
      backgroundMedia {
        url
        contentType
      }
      buttonsCollection(limit: 3) {
        items {
          ...ButtonFields
        }
      }
    }
  }
`;
