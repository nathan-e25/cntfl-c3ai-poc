import { BUTTON_FRAGMENT } from "../fragments/button";

export const ACCORDION_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  query AccordionById($id: String!, $preview: Boolean, $locale: String) {
    accordion(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      heading
      body {
        json
      }
      button {
        ...ButtonFields
      }
      itemsCollection(limit: 20) {
        items {
          sys {
            id
          }
          title
          heading
          body {
            json
          }
          portrait {
            url
            width
            height
            description
          }
          portraitLabel
          portraitVideoUrl
          personName
          personTitle
          button {
            ...ButtonFields
          }
          statsCollection(limit: 4) {
            items {
              sys {
                id
              }
              value
              label
            }
          }
          backgroundVideo {
            url
            contentType
          }
          backgroundVideoAlt
        }
      }
    }
  }
`;
