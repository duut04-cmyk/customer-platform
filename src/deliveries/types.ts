import { calculateDeliveryPricing, type DeliveryPricing } from "./pricing";

export type DeliveryStatus =
  | "booked"
  | "driver_assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "failed"
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

export type DriverStatus = "assigned" | "arriving" | "picked_up" | "in_transit";

export type DeliveryDriver = {
  name: string;
  rating: number;
  vehicleType: string;
  vehicleNumber: string;
  phone?: string;
  status: DriverStatus;
  initials: string;
  photoUrl?: string;
  deliveryCount?: number;
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
  /** Display string for list date column e.g. "Today 12:03 PM" */
  listTimeLabel?: string;
  /** ISO date for home date-range filtering */
  createdAt?: string;
  estimatedArrival: string;
  driverInitials: string;
  timeline: TimelineEvent[];
  selectedService?: string;
  thirdPartyCharge?: number;
  pricing?: DeliveryPricing;
  driver?: DeliveryDriver;
  packagePhotoUrl?: string;
  packagePhotoUrls?: string[];
  scheduledAt?: string;
  prohibitedItemsConsent?: boolean;
  pickupOtp?: string;
  deliveryOtp?: string;
  pickupOtpVerified?: boolean;
  deliveryOtpVerified?: boolean;
  bookedAtLabel?: string;
  estimatedDuration?: string;
  estimatedDeliveryLabel?: string;
  pickupWindowLabel?: string;
  serviceType?: string;
  serviceTagline?: string;
  packagePhotoCount?: number;
  specialInstructions?: string;
  deliveryEta?: string;
  deliveredAtLabel?: string;
  cancelledAtLabel?: string;
  cancelReason?: string;
  customerRating?: number;
  customerRatingComment?: string;
  ratedAt?: string;
  trackingMilestones?: {
    pickedUp?: string;
    onTheWay?: string;
    arrivingSoon?: string;
  };
};

export type DeliveryFilter =
  "all" | "in_transit" | "delivered" | "failed" | "cancelled";

export const STATUS_LABELS: Record<DeliveryStatus, string> = {
  booked: "Booked",
  driver_assigned: "Driver assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
  failed: "Failed",
  cancelled: "Cancelled",
};

type TimelineOtpOptions = {
  pickupOtpVerified?: boolean;
  deliveryOtpVerified?: boolean;
};

const STATUS_ORDER: DeliveryStatus[] = [
  "booked",
  "driver_assigned",
  "picked_up",
  "in_transit",
  "delivered",
];

export function buildDefaultTimeline(
  currentStatus: DeliveryStatus,
  otp: TimelineOtpOptions = {},
): TimelineEvent[] {
  const { pickupOtpVerified = false, deliveryOtpVerified = false } = otp;

  const steps: TimelineEvent[] = [
    { id: "booked", label: "Booked", time: "10:02 AM", state: "upcoming" },
    {
      id: "driver_assigned",
      label: "Driver assigned",
      time: "10:05 AM",
      state: "upcoming",
    },
    {
      id: "pickup_otp",
      label: "Pickup OTP verified",
      time: pickupOtpVerified ? "10:28 AM" : undefined,
      state: "upcoming",
    },
    {
      id: "picked_up",
      label: "Picked up",
      time: "10:32 AM",
      state: "upcoming",
    },
    { id: "in_transit", label: "In transit", time: "Now", state: "upcoming" },
    {
      id: "delivery_otp",
      label: "Delivery OTP verified",
      time: deliveryOtpVerified ? "12:10 PM" : undefined,
      state: "upcoming",
    },
    {
      id: "delivered",
      label: "Delivered",
      time: "Estimated 12:15 PM",
      state: "upcoming",
    },
  ];

  const statusToStepIndex: Record<DeliveryStatus, number> = {
    booked: 0,
    driver_assigned: 1,
    picked_up: 3,
    in_transit: 4,
    delivered: 6,
    failed: 0,
    cancelled: 0,
  };

  if (currentStatus === "cancelled" || currentStatus === "failed") {
    return steps.map((step, index) => ({
      ...step,
      state: index === 0 ? "complete" : "upcoming",
    }));
  }

  if (currentStatus === "delivered") {
    return steps.map((step) => ({
      ...step,
      state: "complete" as TimelineEventState,
      time: step.id === "delivered" ? step.time?.replace("Estimated ", "") : step.time,
    }));
  }

  const currentIndex = statusToStepIndex[currentStatus];

  return steps.map((step, index) => {
    if (step.id === "pickup_otp") {
      if (pickupOtpVerified) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      if (currentStatus === "driver_assigned") {
        return { ...step, state: "current" as TimelineEventState };
      }
      if (index < currentIndex) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      return { ...step, state: "upcoming" as TimelineEventState };
    }

    if (step.id === "delivery_otp") {
      if (deliveryOtpVerified) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      if (currentStatus === "in_transit" || currentStatus === "picked_up") {
        return { ...step, state: "current" as TimelineEventState };
      }
      if (index < currentIndex) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      return { ...step, state: "upcoming" as TimelineEventState };
    }

    const mappedStatusIndex = STATUS_ORDER.indexOf(step.id as DeliveryStatus);
    if (mappedStatusIndex === -1) {
      return step;
    }

    if (mappedStatusIndex < currentIndex) {
      return { ...step, state: "complete" as TimelineEventState };
    }
    if (mappedStatusIndex === currentIndex) {
      return { ...step, state: "current" as TimelineEventState };
    }
    return { ...step, state: "upcoming" as TimelineEventState };
  });
}

const CUSTOMER_TIMELINE_STEPS = [
  { id: "order_confirmed", label: "Order confirmed" },
  { id: "driver_assigned", label: "Driver assigned" },
  { id: "picked_up", label: "Picked up" },
  { id: "on_the_way", label: "On the way" },
  { id: "delivered", label: "Delivered" },
] as const;

const CUSTOMER_TIMELINE_STATUS_INDEX: Record<DeliveryStatus, number> = {
  booked: 0,
  driver_assigned: 1,
  picked_up: 2,
  in_transit: 3,
  delivered: 4,
  failed: 0,
  cancelled: 0,
};

export function buildCustomerDetailTimeline(delivery: Delivery): TimelineEvent[] {
  const times: Record<string, string | undefined> = {
    order_confirmed: "Sep 10, 10:32 AM",
    driver_assigned: "Sep 10, 10:35 AM",
    picked_up: "Sep 10, 10:48 AM",
    on_the_way: delivery.status === "in_transit" ? "Sep 10, 11:05 AM" : undefined,
    delivered: delivery.deliveryEta ?? `ETA ${delivery.estimatedArrival}`,
  };

  if (delivery.status === "cancelled" || delivery.status === "failed") {
    return CUSTOMER_TIMELINE_STEPS.map((step, index) => ({
      id: step.id,
      label: step.label,
      time: times[step.id],
      state:
        index === 0
          ? ("complete" as TimelineEventState)
          : ("upcoming" as TimelineEventState),
    }));
  }

  if (delivery.status === "delivered") {
    return CUSTOMER_TIMELINE_STEPS.map((step) => ({
      id: step.id,
      label: step.label,
      time: step.id === "delivered" ? delivery.estimatedArrival : times[step.id],
      state: "complete" as TimelineEventState,
    }));
  }

  const currentIndex = CUSTOMER_TIMELINE_STATUS_INDEX[delivery.status];

  return CUSTOMER_TIMELINE_STEPS.map((step, index) => {
    let state: TimelineEventState = "upcoming";
    if (index < currentIndex) state = "complete";
    else if (index === currentIndex) state = "current";

    return {
      id: step.id,
      label: step.label,
      time: times[step.id],
      state,
    };
  });
}

export function isActiveDeliveryDetailStatus(status: DeliveryStatus): boolean {
  return (
    status === "picked_up" || status === "in_transit" || status === "driver_assigned"
  );
}

export function isActiveTrackingStatus(status: DeliveryStatus): boolean {
  return (
    status === "booked" ||
    status === "driver_assigned" ||
    status === "picked_up" ||
    status === "in_transit"
  );
}

export function canCancelDelivery(status: DeliveryStatus): boolean {
  return status === "booked" || status === "driver_assigned";
}

export { calculateDeliveryPricing };
export type { DeliveryPricing };
