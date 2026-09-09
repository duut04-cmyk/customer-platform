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
