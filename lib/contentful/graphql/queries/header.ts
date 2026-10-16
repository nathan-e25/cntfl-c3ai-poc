import { BUTTON_FRAGMENT } from "../fragments/button";
import { LINK_GROUP_FRAGMENT } from "../fragments/linkGroup";

/** The site header: the first published `header` entry. */
export const HEADER_QUERY = /* GraphQL */ `
  ${BUTTON_FRAGMENT}
  ${LINK_GROUP_FRAGMENT}
  query Header($preview: Boolean, $locale: String) {
    headerCollection(limit: 1, preview: $preview, locale: $locale) {
      items {
        sys {
          id
        }
        frontEndComponent
        logo {
          url
          title
          description
        }
        logoUrl
        navItemsCollection(limit: 8) {
          items {
            sys {
              id
            }
            label
            url
            dropdownHeading
            centerSectionsCollection(limit: 6) {
              items {
                ...LinkGroupFields
              }
            }
            rightSectionsCollection(limit: 6) {
              items {
                ...LinkGroupFields
              }
            }
            rightImage {
              url
            }
            rightImageAlt
            captionLabel
            captionLink {
              ...ButtonFields
            }
          }
        }
        contactLabel
        mobileContactLabel
        contactUrl
        searchLabel
        searchFieldLabel
        searchAction
      }
    }
  }
`;
