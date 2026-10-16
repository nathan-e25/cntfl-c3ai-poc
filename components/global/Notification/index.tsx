import type { NotificationData } from "@/lib/sections/types";
import { NotificationDefault } from "./NotificationDefault";

type NotificationProps = { notification: NotificationData };

export function Notification({ notification }: NotificationProps) {
  switch (notification.frontEndComponent) {
    case "Notification Default":
      return <NotificationDefault notification={notification} />;
    default:
      return <NotificationDefault notification={notification} />;
  }
}
