import type { Delivery, DeliveryStatus } from "@/deliveries/types";

const IN_TRANSIT_STATUSES: DeliveryStatus[] = [
  "in_transit",
  "picked_up",
  "driver_assigned",
  "booked",
  "pickup_otp_pending",
  "delivery_otp_pending",
];

export type DashboardCounts = {
  total: number;
  completed: number;
  inTransit: number;
  failedCancelled: number;
  failed: number;
  cancelled: number;
};

export function getDashboardCounts(deliveries: Delivery[] = []): DashboardCounts {
  const completed = deliveries.filter((d) => d.status === "delivered").length;
  const inTransit = deliveries.filter((d) =>
    IN_TRANSIT_STATUSES.includes(d.status),
  ).length;
  const failed = deliveries.filter((d) => d.status === "failed").length;
  const cancelled = deliveries.filter((d) => d.status === "cancelled").length;

  return {
    total: deliveries.length,
    completed,
    inTransit,
    failedCancelled: failed + cancelled,
    failed,
    cancelled,
  };
}

export function getFilterCounts(
  deliveries: Delivery[] = [],
): Record<"all" | "in_transit" | "delivered" | "failed" | "cancelled", number> {
  const counts = getDashboardCounts(deliveries);
  return {
    all: counts.total,
    in_transit: counts.inTransit,
    delivered: counts.completed,
    failed: counts.failed,
    cancelled: counts.cancelled,
  };
}

export function searchDeliveries(deliveries: Delivery[], query: string): Delivery[] {
  const q = query.trim().toLowerCase();
  if (!q) return deliveries;

  return deliveries.filter(
    (d) =>
      d.id.toLowerCase().includes(q) ||
      (d.reference?.toLowerCase().includes(q) ?? false) ||
      d.pickup.city.toLowerCase().includes(q) ||
      d.dropoff.city.toLowerCase().includes(q) ||
      d.pickup.address.toLowerCase().includes(q) ||
      d.dropoff.address.toLowerCase().includes(q) ||
      (d.selectedService?.toLowerCase().includes(q) ?? false),
  );
}
