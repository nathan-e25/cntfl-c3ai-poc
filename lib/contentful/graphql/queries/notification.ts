/** The site privacy notice: the first published `notification` entry. */
export const NOTIFICATION_QUERY = /* GraphQL */ `
  query Notification($preview: Boolean, $locale: String) {
    notificationCollection(limit: 1, preview: $preview, locale: $locale) {
      items {
        sys {
          id
        }
        frontEndComponent
        heading
        body {
          json
        }
        optOutLabel
        modalTitle
        modalBody {
          json
        }
        checkboxLabel
        cancelLabel
        saveLabel
        successText
        successSubtext
        countdownSeconds
        poweredByLabel
        poweredByLogo {
          url
        }
        poweredByUrl
      }
    }
  }
`;
