import type { DeliveryStatus } from "./types";

export function getTrackingHeroTitle(status: DeliveryStatus): string {
  switch (status) {
    case "booked":
      return "Delivery booked";
    case "driver_assigned":
      return "Driver assigned";
    case "pickup_otp_pending":
      return "Verify pickup";
    case "delivery_otp_pending":
      return "Verify delivery";
    case "picked_up":
      return "Pickup received";
    case "in_transit":
      return "On the way to drop-off";
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
      return "Pickup is complete. Cancel is no longer available — your partner is heading to drop-off.";
    case "in_transit":
      return "Your package is with the delivery partner and moving to the drop-off location.";
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
