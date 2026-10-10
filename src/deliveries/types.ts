import { calculateDeliveryPricing, type DeliveryPricing } from "./pricing";
import type { TrackingEventItem } from "./timeline-builder";

export type DeliveryStatus =
  | "booked"
  | "driver_assigned"
  | "pickup_otp_pending"
  | "picked_up"
  | "in_transit"
  | "delivery_otp_pending"
  | "delivered"
  | "failed"
  | "cancelled";

export type TimelineEventState = "complete" | "current" | "upcoming";

export type TimelineEvent = {
  id: string;
  label: string;
  time?: string;
  /** Optional secondary line (e.g. cancellation reason). */
  description?: string;
  state: TimelineEventState;
};

export type DeliveryLocation = {
  city: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type DriverStatus = "assigned" | "arriving" | "picked_up" | "in_transit";

export type CustomerExperienceRatings = {
  driverRating: number;
  platformRating: number;
  deliveryRating: number;
  timelinessRating: number;
  packageHandlingRating: number;
  servicePresentationRating: number;
};

export type DeliveryDriver = {
  name: string;
  rating?: number;
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
  reference?: string;
  status: DeliveryStatus;
  statusLabel: string;
  providerCode?: string;
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
  /** Detail-page timeline built from backend history. */
  detailTimeline?: TimelineEvent[];
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
  pickupOtpPending?: boolean;
  deliveryOtpPending?: boolean;
  trackingLatitude?: number | null;
  trackingLongitude?: number | null;
  trackingUrl?: string | null;
  trackingEvents?: TrackingEventItem[];
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
  customerExperienceRatings?: CustomerExperienceRatings;
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
  pickup_otp_pending: "Pickup verification",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivery_otp_pending: "Delivery verification",
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
  "pickup_otp_pending",
  "picked_up",
  "in_transit",
  "delivery_otp_pending",
  "delivered",
];

/** Fallback timeline for list items without full history — no fabricated timestamps. */
export function buildDefaultTimeline(
  currentStatus: DeliveryStatus,
  otp: TimelineOtpOptions = {},
): TimelineEvent[] {
  const { pickupOtpVerified = false, deliveryOtpVerified = false } = otp;

  const steps: TimelineEvent[] = [
    { id: "booked", label: "Booked", state: "upcoming" },
    { id: "driver_assigned", label: "Driver assigned", state: "upcoming" },
    { id: "pickup_otp", label: "Pickup OTP verified", state: "upcoming" },
    { id: "picked_up", label: "Picked up", state: "upcoming" },
    { id: "in_transit", label: "In transit", state: "upcoming" },
    { id: "delivery_otp", label: "Delivery OTP verified", state: "upcoming" },
    { id: "delivered", label: "Delivered", state: "upcoming" },
  ];

  const statusToStepIndex: Record<DeliveryStatus, number> = {
    booked: 0,
    driver_assigned: 1,
    pickup_otp_pending: 2,
    picked_up: 3,
    in_transit: 4,
    delivery_otp_pending: 5,
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
    }));
  }

  const currentIndex = statusToStepIndex[currentStatus];

  return steps.map((step, index) => {
    if (step.id === "pickup_otp") {
      if (pickupOtpVerified) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      if (
        currentStatus === "driver_assigned" ||
        currentStatus === "pickup_otp_pending"
      ) {
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
      if (currentStatus === "in_transit" || currentStatus === "delivery_otp_pending") {
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

export function buildCustomerDetailTimeline(delivery: Delivery): TimelineEvent[] {
  if (delivery.detailTimeline) {
    return delivery.detailTimeline;
  }

  const currentIndex: Record<DeliveryStatus, number> = {
    booked: 0,
    driver_assigned: 1,
    pickup_otp_pending: 1,
    picked_up: 2,
    in_transit: 3,
    delivery_otp_pending: 3,
    delivered: 4,
    failed: 0,
    cancelled: 0,
  };

  const steps = [
    { id: "order_confirmed", label: "Order confirmed" },
    { id: "driver_assigned", label: "Driver assigned" },
    { id: "picked_up", label: "Picked up" },
    { id: "on_the_way", label: "On the way" },
    { id: "delivered", label: "Delivered" },
  ];

  const idx = currentIndex[delivery.status];

  if (delivery.status === "cancelled") {
    return [
      {
        id: "order_confirmed",
        label: "Order confirmed",
        time: delivery.bookedAtLabel ?? delivery.dateLabel,
        state: "complete" as TimelineEventState,
      },
      {
        id: "cancelled",
        label: "Cancelled",
        time: delivery.cancelledAtLabel,
        description: delivery.cancelReason,
        state: "complete" as TimelineEventState,
      },
    ];
  }

  if (delivery.status === "failed") {
    return [
      {
        id: "order_confirmed",
        label: "Order confirmed",
        time: delivery.bookedAtLabel ?? delivery.dateLabel,
        state: "complete" as TimelineEventState,
      },
      {
        id: "failed",
        label: "Failed",
        time: delivery.cancelledAtLabel ?? delivery.dateLabel,
        description: delivery.cancelReason,
        state: "complete" as TimelineEventState,
      },
    ];
  }

  if (delivery.status === "delivered") {
    return steps.map((step) => ({
      ...step,
      time: step.id === "delivered" ? delivery.deliveredAtLabel : undefined,
      state: "complete" as TimelineEventState,
    }));
  }

  return steps.map((step, index) => {
    let state: TimelineEventState = "upcoming";
    if (index < idx) state = "complete";
    else if (index === idx) state = "current";
    return { ...step, state };
  });
}

export function isActiveDeliveryDetailStatus(status: DeliveryStatus): boolean {
  return (
    status === "picked_up" ||
    status === "in_transit" ||
    status === "driver_assigned" ||
    status === "pickup_otp_pending" ||
    status === "delivery_otp_pending"
  );
}

export function isActiveTrackingStatus(status: DeliveryStatus): boolean {
  return (
    status === "booked" ||
    status === "driver_assigned" ||
    status === "pickup_otp_pending" ||
    status === "picked_up" ||
    status === "in_transit" ||
    status === "delivery_otp_pending"
  );
}

export function canCancelDelivery(status: DeliveryStatus): boolean {
  return (
    status === "booked" ||
    status === "driver_assigned" ||
    status === "pickup_otp_pending"
  );
}

export { calculateDeliveryPricing };
export type { DeliveryPricing };
