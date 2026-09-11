import { ACCOUNT_SETTINGS_PATH } from "@/account/paths";
import { deliveryRoutePath, deliveryTrackingPath } from "@/deliveries/paths";

export type NotificationType =
  "delivery_status" | "otp" | "booking" | "delivered" | "system";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
  deliveryId?: string;
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "delivery_status",
    title: "Driver is on the way",
    body: "DUTT-1042 — Rohit Sharma is heading to the drop-off location.",
    createdAt: "2026-09-10T11:05:00.000Z",
    read: false,
    href: deliveryTrackingPath("DUTT-1042"),
    deliveryId: "DUTT-1042",
  },
  {
    id: "notif-2",
    type: "otp",
    title: "Delivery OTP ready",
    body: "Share the delivery code with the recipient when DUTT-1042 arrives.",
    createdAt: "2026-09-10T10:50:00.000Z",
    read: false,
    href: deliveryTrackingPath("DUTT-1042"),
    deliveryId: "DUTT-1042",
  },
  {
    id: "notif-3",
    type: "delivered",
    title: "Delivery completed",
    body: "DUTT-1041 was delivered successfully at 4:32 PM.",
    createdAt: "2026-09-10T11:02:00.000Z",
    read: false,
    href: deliveryTrackingPath("DUTT-1041"),
    deliveryId: "DUTT-1041",
  },
  {
    id: "notif-4",
    type: "booking",
    title: "Delivery booked",
    body: "DUTT-1042 is confirmed. Pickup window: 4:00 PM – 4:30 PM today.",
    createdAt: "2026-09-10T05:02:00.000Z",
    read: true,
    href: deliveryRoutePath("DUTT-1042"),
    deliveryId: "DUTT-1042",
  },
  {
    id: "notif-5",
    type: "system",
    title: "Complete your profile",
    body: "Add your phone number in account settings for delivery updates.",
    createdAt: "2026-09-09T08:00:00.000Z",
    read: true,
    href: ACCOUNT_SETTINGS_PATH,
  },
];

export function formatNotificationTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
