/** A "Link Group" (content type id `footerLinkGroup`): heading + button links. Needs BUTTON_FRAGMENT. */
export const LINK_GROUP_FRAGMENT = /* GraphQL */ `
  fragment LinkGroupFields on FooterLinkGroup {
    sys {
      id
    }
    heading
    linksCollection(limit: 20) {
      items {
        ...ButtonFields
      }
    }
  }
`;
