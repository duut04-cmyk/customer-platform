import type { Delivery, DeliveryFilter, DeliveryStatus } from "./types";

const IN_TRANSIT_STATUSES: DeliveryStatus[] = [
  "in_transit",
  "picked_up",
  "driver_assigned",
  "booked",
  "pickup_otp_pending",
  "delivery_otp_pending",
];

export function filterDeliveries(
  deliveries: Delivery[],
  filter: DeliveryFilter,
): Delivery[] {
  if (filter === "all") return deliveries;
  if (filter === "delivered") {
    return deliveries.filter((d) => d.status === "delivered");
  }
  if (filter === "cancelled") {
    return deliveries.filter((d) => d.status === "cancelled");
  }
  if (filter === "failed") {
    return deliveries.filter((d) => d.status === "failed");
  }
  return deliveries.filter((d) => IN_TRANSIT_STATUSES.includes(d.status));
}
