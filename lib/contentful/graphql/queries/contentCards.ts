import { BUTTON_FRAGMENT } from "../fragments/button";

export const CONTENT_CARDS_BY_ID = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  query ContentCardsById($id: String!, $preview: Boolean, $locale: String) {
    contentCards(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      heading
      eyebrow
      lines
      button {
        ...ButtonFields
      }
      icon {
        url
        width
        height
      }
      backgroundMedia {
        url
        contentType
      }
      popupMedia {
        url
        contentType
      }
      showPopup
    }
  }
`;
