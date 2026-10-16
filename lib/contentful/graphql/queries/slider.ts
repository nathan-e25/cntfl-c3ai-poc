import { BUTTON_FRAGMENT } from "../fragments/button";

export const SLIDER_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  query SliderById($id: String!, $preview: Boolean, $locale: String) {
    slider(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      heading
      intro {
        json
      }
      itemsCollection(limit: 40) {
        items {
          sys {
            id
          }
          title
          imageHeight
          image {
            url
            width
            height
            description
          }
          tabLabel
          heading
          body {
            json
          }
          listLabel
          cta {
            ...ButtonFields
          }
          linksCollection(limit: 10) {
            items {
              ...ButtonFields
            }
          }
        }
      }
    }
  }
`;
