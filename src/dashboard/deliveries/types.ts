export type DeliveryStatus =
  | "booked"
  | "driver_assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type TimelineEventState = "complete" | "current" | "upcoming";

export type TimelineEvent = {
  id: string;
  label: string;
  time?: string;
  state: TimelineEventState;
};

export type DeliveryLocation = {
  city: string;
  address: string;
};

export type Delivery = {
  id: string;
  status: DeliveryStatus;
  statusLabel: string;
  pickup: DeliveryLocation;
  dropoff: DeliveryLocation;
  packageType: string;
  weight: string;
  dimensions: string;
  requirements: string[];
  dateLabel: string;
  estimatedArrival: string;
  driverInitials: string;
  timeline: TimelineEvent[];
};

export type DeliveryFilter = "all" | "in_transit" | "delivered" | "cancelled";

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
  booked: "Booked",
  driver_assigned: "Driver assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function buildDefaultTimeline(
  currentStatus: DeliveryStatus,
): TimelineEvent[] {
  const steps: { id: DeliveryStatus; label: string; time?: string }[] = [
    { id: "booked", label: "Booked", time: "10:02 AM" },
    { id: "driver_assigned", label: "Driver assigned", time: "10:05 AM" },
    { id: "picked_up", label: "Picked up", time: "10:32 AM" },
    { id: "in_transit", label: "In transit", time: "Now" },
    { id: "delivered", label: "Delivered", time: "Estimated 12:15 PM" },
  ];

  const order: DeliveryStatus[] = [
    "booked",
    "driver_assigned",
    "picked_up",
    "in_transit",
    "delivered",
  ];
  const currentIndex = order.indexOf(currentStatus);

  if (currentStatus === "delivered") {
    return steps.map((step) => ({
      ...step,
      state: "complete" as TimelineEventState,
      time: step.id === "delivered" ? step.time?.replace("Estimated ", "") : step.time,
    }));
  }

  return steps.map((step, index) => {
    if (currentStatus === "cancelled") {
      return {
        ...step,
        state: index === 0 ? "complete" : ("upcoming" as TimelineEventState),
      };
    }
    if (index < currentIndex) {
      return { ...step, state: "complete" as TimelineEventState };
    }
    if (index === currentIndex) {
      return { ...step, state: "current" as TimelineEventState };
    }
    return { ...step, state: "upcoming" as TimelineEventState };
  });
}
