import { BUTTON_FRAGMENT } from "../fragments/button";
import { LINK_GROUP_FRAGMENT } from "../fragments/linkGroup";

/** The site footer: the first published `footer` entry. */
export const FOOTER_QUERY = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  ${LINK_GROUP_FRAGMENT}
  query Footer($preview: Boolean, $locale: String) {
    footerCollection(limit: 1, preview: $preview, locale: $locale) {
      items {
        sys {
          id
        }
        frontEndComponent
        logo {
          url
          width
          height
          description
          title
        }
        logoUrl
        primaryGroupsCollection(limit: 6) {
          items {
            ...LinkGroupFields
          }
        }
        secondaryGroupsCollection(limit: 6) {
          items {
            ...LinkGroupFields
          }
        }
        socialLinksCollection(limit: 10) {
          items {
            sys {
              id
            }
            title
            url
            icon {
              url
            }
          }
        }
        legalLinksCollection(limit: 10) {
          items {
            ...ButtonFields
          }
        }
        copyright
      }
    }
  }
`;
