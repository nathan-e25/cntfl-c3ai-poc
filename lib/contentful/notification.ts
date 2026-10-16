import { contentfulFetch } from "./client";
import { NOTIFICATION_QUERY } from "./graphql/queries/notification";
import type { RichTextDocument } from "./richText";
import type {
  NotificationData,
  NotificationFrontEndComponent,
} from "@/lib/sections/types";

type NotificationResponse = {
  notificationCollection?: {
    items: Array<{
      sys: { id: string };
      frontEndComponent?: string | null;
      heading?: string | null;
      body?: { json: RichTextDocument } | null;
      optOutLabel?: string | null;
      modalTitle?: string | null;
      modalBody?: { json: RichTextDocument } | null;
      checkboxLabel?: string | null;
      cancelLabel?: string | null;
      saveLabel?: string | null;
      successText?: string | null;
      successSubtext?: string | null;
      countdownSeconds?: number | null;
      poweredByLabel?: string | null;
      poweredByLogo?: { url: string } | null;
      poweredByUrl?: string | null;
    } | null>;
  } | null;
};

const FRONT_END_COMPONENTS: NotificationFrontEndComponent[] = ["Notification Default"];

type FetchOptions = { preview?: boolean; locale?: string };

/** Site-wide privacy notice (first published entry); `null` when none exists or the fetch fails. */
export async function getNotification({
  preview,
  locale,
}: FetchOptions = {}): Promise<NotificationData | null> {
  try {
    const data = await contentfulFetch<NotificationResponse>(
      NOTIFICATION_QUERY,
      { preview: preview ?? false, locale },
      { preview }
    );
    const raw = data.notificationCollection?.items?.[0];
    if (!raw) return null;
    const optOutLabel = raw.optOutLabel ?? "Do Not Sell or Share My Personal Information";
    return {
      id: raw.sys.id,
      frontEndComponent:
        FRONT_END_COMPONENTS.find((c) => c === raw.frontEndComponent) ?? null,
      heading: raw.heading ?? null,
      body: raw.body?.json ?? null,
      optOutLabel,
      modalTitle: raw.modalTitle ?? "Opt-out Preferences",
      modalBody: raw.modalBody?.json ?? null,
      checkboxLabel: raw.checkboxLabel ?? optOutLabel,
      cancelLabel: raw.cancelLabel ?? "Cancel",
      saveLabel: raw.saveLabel ?? "Save My Preferences",
      successText: raw.successText ?? "Your opt-out preference has been honored.",
      successSubtext: raw.successSubtext ?? "Banner closes automatically in {seconds} s...",
      countdownSeconds: raw.countdownSeconds ?? 15,
      poweredBy: raw.poweredByLabel
        ? {
            label: raw.poweredByLabel,
            logoUrl: raw.poweredByLogo?.url ?? null,
            url: raw.poweredByUrl ?? null,
          }
        : null,
    };
  } catch (error) {
    console.error("Failed to fetch notification:", error);
    return null;
  }
}
