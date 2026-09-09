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
  scheduledAt?: string;
  prohibitedItemsConsent?: boolean;
  pickupOtp?: string;
  deliveryOtp?: string;
  pickupOtpVerified?: boolean;
  deliveryOtpVerified?: boolean;
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

export { calculateDeliveryPricing };
export type { DeliveryPricing };
