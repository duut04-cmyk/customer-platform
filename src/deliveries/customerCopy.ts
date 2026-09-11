import type { DeliveryStatus } from "./types";

export function getDeliveryStatusMessage(status: DeliveryStatus): string {
  switch (status) {
    case "delivered":
      return "Your delivery has been completed.";
    case "cancelled":
      return "This delivery was cancelled.";
    case "failed":
      return "This delivery could not be completed.";
    case "booked":
      return "Your delivery is booked.";
    case "driver_assigned":
      return "A delivery partner has been assigned.";
    case "picked_up":
      return "Your package has been picked up.";
    case "in_transit":
      return "Your delivery is on the way.";
    default:
      return "Your delivery is being processed.";
  }
}

export function isActiveDeliveryStatus(status: DeliveryStatus): boolean {
  return (
    status === "booked" ||
    status === "driver_assigned" ||
    status === "picked_up" ||
    status === "in_transit"
  );
}

export function getTrackingHeroTitle(status: DeliveryStatus): string {
  switch (status) {
    case "booked":
      return "Delivery booked";
    case "driver_assigned":
      return "Driver assigned";
    case "picked_up":
      return "Package picked up";
    case "in_transit":
      return "Driver is on the way";
    case "delivered":
      return "Delivery completed";
    case "cancelled":
      return "Delivery cancelled";
    case "failed":
      return "Delivery failed";
    default:
      return "Delivery progress";
  }
}

export function getTrackingHeroSubtitle(status: DeliveryStatus): string {
  switch (status) {
    case "booked":
      return "We're finding the best delivery partner for your package.";
    case "driver_assigned":
      return "Your delivery partner will arrive at the pickup location shortly.";
    case "picked_up":
      return "Your package has been picked up and is heading to the destination.";
    case "in_transit":
      return "Your package has been picked up and is on its way to the destination.";
    case "delivered":
      return "Your package has been successfully delivered.";
    case "cancelled":
      return "This delivery was cancelled before pickup.";
    case "failed":
      return "We couldn't complete this delivery. Our support team can help.";
    default:
      return "Your delivery is being processed.";
  }
}

export const CANCEL_DELIVERY_REASONS = [
  "Wrong pickup or drop-off address",
  "Change of plans",
  "Found another delivery option",
  "Driver is taking too long",
  "Other",
] as const;

export type CancelDeliveryReason = (typeof CANCEL_DELIVERY_REASONS)[number];

export const OTP_COPY = {
  pickupTitle: "Pickup verification",
  pickupPending:
    "Share this code with your delivery partner when they pick up the package.",
  pickupVerified: "Pickup verified successfully.",
  deliveryTitle: "Delivery verification",
  deliveryPending: "Share this code with the recipient when the package is delivered.",
  deliveryVerified: "Delivery verified successfully.",
  codeLabel: "OTP code",
} as const;
