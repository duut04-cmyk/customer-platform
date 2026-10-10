import type { DeliveryHistoryDetail } from "@/api/deliveries/delivery.types";
import type {
  Delivery,
  DeliveryStatus,
  TimelineEvent,
  TimelineEventState,
} from "./types";

export function formatEventTime(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isToday) return `Today ${time}`;
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeFromStatusEvents(
  events: DeliveryHistoryDetail["timeline"],
  statuses: string[],
): string | undefined {
  for (const event of events) {
    if (statuses.includes(event.toStatus)) {
      return formatEventTime(event.createdAt);
    }
  }
  return undefined;
}

const TRACKING_STATUS_LABELS: Record<string, string> = {
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
  DRIVER_ASSIGNED: "Driver assigned",
};

function trackingStatusLabel(status: string | null | undefined): string {
  if (!status) return "Location update";
  return TRACKING_STATUS_LABELS[status] ?? status.replaceAll("_", " ");
}

export type TrackingEventItem = {
  id: string;
  label: string;
  time?: string;
};

export function buildTrackingEventsFromHistory(
  history: DeliveryHistoryDetail,
): TrackingEventItem[] {
  return history.tracking.history.map((point) => ({
    id: point.id,
    label: trackingStatusLabel(point.normalizedStatus ?? point.providerStatus),
    time: formatEventTime(point.receivedAt),
  }));
}

export type TrackingMilestones = {
  pickedUp?: string;
  onTheWay?: string;
  arrivingSoon?: string;
};

export function buildTrackingMilestones(
  history: DeliveryHistoryDetail,
): TrackingMilestones {
  const events = history.timeline;
  const latest = history.tracking.latest;

  return {
    pickedUp:
      timeFromStatusEvents(events, ["PICKED_UP"]) ??
      formatEventTime(
        history.tracking.history.find((p) => p.normalizedStatus === "PICKED_UP")
          ?.receivedAt,
      ),
    onTheWay: timeFromStatusEvents(events, ["IN_TRANSIT"]),
    arrivingSoon: latest?.eta ? formatEventTime(latest.eta) : undefined,
  };
}

const DETAIL_STEPS = [
  {
    id: "order_confirmed",
    label: "Order confirmed",
    statuses: ["BOOKED", "OPTION_READY", "CREATED"],
  },
  { id: "driver_assigned", label: "Driver assigned", statuses: ["DRIVER_ASSIGNED"] },
  { id: "picked_up", label: "Picked up", statuses: ["PICKED_UP"] },
  {
    id: "on_the_way",
    label: "On the way",
    statuses: ["IN_TRANSIT", "DELIVERY_OTP_PENDING"],
  },
  { id: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
] as const;

const DETAIL_STATUS_INDEX: Record<DeliveryStatus, number> = {
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

function resolveDetailStepTime(
  step: (typeof DETAIL_STEPS)[number],
  history: DeliveryHistoryDetail,
): string | undefined {
  const fromTimeline = timeFromStatusEvents(history.timeline, [...step.statuses]);
  if (fromTimeline) return fromTimeline;

  if (step.id === "order_confirmed") {
    return (
      formatEventTime(history.booking?.bookedAt) ??
      formatEventTime(history.delivery.createdAt)
    );
  }
  if (step.id === "driver_assigned") {
    const driver = history.driver as { driver?: { assignedAt?: string | null } };
    return formatEventTime(driver.driver?.assignedAt);
  }
  if (step.id === "picked_up") {
    return formatEventTime(history.otp.pickup?.verifiedAt);
  }
  if (step.id === "delivered") {
    return (
      formatEventTime(history.otp.delivery?.verifiedAt) ??
      formatEventTime(history.tracking.latest?.eta)
    );
  }
  return undefined;
}

export function buildDetailTimelineFromHistory(
  history: DeliveryHistoryDetail,
  frontendStatus: DeliveryStatus,
): TimelineEvent[] {
  if (frontendStatus === "cancelled" || frontendStatus === "failed") {
    const confirmedTime = resolveDetailStepTime(DETAIL_STEPS[0], history);
    const cancellation = history.cancellation;
    const terminalTime = formatEventTime(cancellation?.cancelledAt) ?? confirmedTime;
    const reason =
      cancellation?.reasonMessage ??
      (cancellation?.reasonCode
        ? cancellation.reasonCode.replaceAll("_", " ")
        : undefined);

    return [
      {
        id: "order_confirmed",
        label: "Order confirmed",
        time: confirmedTime,
        state: "complete" as TimelineEventState,
      },
      {
        id: frontendStatus === "cancelled" ? "cancelled" : "failed",
        label: frontendStatus === "cancelled" ? "Cancelled" : "Failed",
        time: terminalTime,
        description: reason,
        state: "complete" as TimelineEventState,
      },
    ];
  }

  if (frontendStatus === "delivered") {
    return DETAIL_STEPS.map((step) => ({
      id: step.id,
      label: step.label,
      time: resolveDetailStepTime(step, history),
      state: "complete" as TimelineEventState,
    }));
  }

  const currentIndex = DETAIL_STATUS_INDEX[frontendStatus];

  return DETAIL_STEPS.map((step, index) => {
    let state: TimelineEventState = "upcoming";
    if (index < currentIndex) state = "complete";
    else if (index === currentIndex) state = "current";

    return {
      id: step.id,
      label: step.label,
      time: resolveDetailStepTime(step, history),
      state,
    };
  });
}

const TRACKING_STEP_IDS = [
  "booked",
  "driver_assigned",
  "pickup_otp",
  "picked_up",
  "in_transit",
  "delivery_otp",
  "delivered",
] as const;

const TRACKING_STEP_LABELS: Record<(typeof TRACKING_STEP_IDS)[number], string> = {
  booked: "Booked",
  driver_assigned: "Driver assigned",
  pickup_otp: "Pickup OTP verified",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivery_otp: "Delivery OTP verified",
  delivered: "Delivered",
};

const STEP_TO_BACKEND_STATUSES: Record<(typeof TRACKING_STEP_IDS)[number], string[]> = {
  booked: ["BOOKED", "OPTION_READY", "CREATED"],
  driver_assigned: ["DRIVER_ASSIGNED"],
  pickup_otp: ["PICKUP_OTP_PENDING"],
  picked_up: ["PICKED_UP"],
  in_transit: ["IN_TRANSIT"],
  delivery_otp: ["DELIVERY_OTP_PENDING"],
  delivered: ["DELIVERED"],
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

export function buildTrackingTimelineFromHistory(
  history: DeliveryHistoryDetail,
  frontendStatus: DeliveryStatus,
): TimelineEvent[] {
  const pickupVerified = Boolean(history.otp.pickup?.verifiedAt);
  const deliveryVerified = Boolean(history.otp.delivery?.verifiedAt);
  const events = history.timeline;

  const resolveStepTime = (
    stepId: (typeof TRACKING_STEP_IDS)[number],
  ): string | undefined => {
    const backendStatuses = STEP_TO_BACKEND_STATUSES[stepId];
    const fromTimeline = timeFromStatusEvents(events, backendStatuses);
    if (fromTimeline) return fromTimeline;

    if (stepId === "pickup_otp") return formatEventTime(history.otp.pickup?.verifiedAt);
    if (stepId === "delivery_otp")
      return formatEventTime(history.otp.delivery?.verifiedAt);
    if (stepId === "booked") {
      return (
        formatEventTime(history.booking?.bookedAt) ??
        formatEventTime(history.delivery.createdAt)
      );
    }
    if (stepId === "driver_assigned") {
      const driver = history.driver as { driver?: { assignedAt?: string | null } };
      return formatEventTime(driver.driver?.assignedAt);
    }
    if (stepId === "delivered") {
      return formatEventTime(history.otp.delivery?.verifiedAt);
    }
    return undefined;
  };

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

  const steps: TimelineEvent[] = TRACKING_STEP_IDS.map((id) => ({
    id,
    label: TRACKING_STEP_LABELS[id],
    time: resolveStepTime(id),
    state: "upcoming" as TimelineEventState,
  }));

  if (frontendStatus === "cancelled" || frontendStatus === "failed") {
    return steps.map((step, index) => ({
      ...step,
      state: (index === 0 ? "complete" : "upcoming") as TimelineEventState,
    }));
  }

  if (frontendStatus === "delivered") {
    return steps.map((step) => ({
      ...step,
      state: "complete" as TimelineEventState,
    }));
  }

  const currentIndex = statusToStepIndex[frontendStatus];

  return steps.map((step, index) => {
    if (step.id === "pickup_otp") {
      if (pickupVerified) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      if (
        frontendStatus === "driver_assigned" ||
        frontendStatus === "pickup_otp_pending"
      ) {
        return { ...step, state: "current" as TimelineEventState };
      }
      if (index < currentIndex) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      return { ...step, state: "upcoming" as TimelineEventState };
    }

    if (step.id === "delivery_otp") {
      if (deliveryVerified) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      if (
        frontendStatus === "in_transit" ||
        frontendStatus === "delivery_otp_pending"
      ) {
        return { ...step, state: "current" as TimelineEventState };
      }
      if (index < currentIndex) {
        return { ...step, state: "complete" as TimelineEventState };
      }
      return { ...step, state: "upcoming" as TimelineEventState };
    }

    const mappedStatusIndex = STATUS_ORDER.indexOf(step.id as DeliveryStatus);
    if (mappedStatusIndex === -1) return step;

    if (mappedStatusIndex < currentIndex) {
      return { ...step, state: "complete" as TimelineEventState };
    }
    if (mappedStatusIndex === currentIndex) {
      return { ...step, state: "current" as TimelineEventState };
    }
    return { ...step, state: "upcoming" as TimelineEventState };
  });
}

const CUSTOMER_TRACKING_PROGRESS_STEPS = [
  { id: "to_pickup", label: "Rider on the way to pickup" },
  { id: "pickup_received", label: "Pickup received" },
  { id: "to_dropoff", label: "On the way to drop-off" },
  { id: "arriving", label: "Arriving" },
] as const;

const TRACKING_PROGRESS_STATUS_INDEX: Record<DeliveryStatus, number> = {
  booked: 0,
  driver_assigned: 0,
  pickup_otp_pending: 0,
  picked_up: 1,
  in_transit: 2,
  delivery_otp_pending: 3,
  delivered: 4,
  cancelled: -1,
  failed: -1,
};

function findTrackingEventTime(
  events: Delivery["trackingEvents"],
  matchers: string[],
): string | undefined {
  if (!events?.length) return undefined;
  for (const event of events) {
    const normalized = event.label.toLowerCase();
    if (matchers.some((m) => normalized.includes(m.toLowerCase()))) {
      return event.time;
    }
  }
  return undefined;
}

function updatesForStep(
  events: Delivery["trackingEvents"],
  stepIndex: number,
): string | undefined {
  if (!events?.length) return undefined;

  const matchers: Record<number, string[]> = {
    0: ["driver assigned", "assigned"],
    1: ["picked up", "pickup"],
    2: ["in transit", "transit", "location"],
    3: ["arriving", "delivery", "delivered"],
  };

  const keys = matchers[stepIndex] ?? [];
  const matched = events.filter((event) => {
    const normalized = event.label.toLowerCase();
    return keys.some((key) => normalized.includes(key));
  });

  if (matched.length === 0) return undefined;
  return matched
    .slice(0, 3)
    .map((event) => (event.time ? `${event.label} · ${event.time}` : event.label))
    .join(" · ");
}

/** Single customer-facing progress rail for the live tracking page. */
export function buildCustomerTrackingProgressTimeline(
  delivery: Delivery,
): TimelineEvent[] {
  const milestones = delivery.trackingMilestones ?? {};
  const events = delivery.trackingEvents;
  const currentIndex = TRACKING_PROGRESS_STATUS_INDEX[delivery.status];

  const stepTimes: (string | undefined)[] = [
    findTrackingEventTime(events, ["driver assigned"]) ?? delivery.bookedAtLabel,
    milestones.pickedUp ?? findTrackingEventTime(events, ["picked up"]),
    milestones.onTheWay ?? findTrackingEventTime(events, ["in transit"]),
    milestones.arrivingSoon ??
      findTrackingEventTime(events, ["arriving"]) ??
      (delivery.status === "delivery_otp_pending" || delivery.status === "in_transit"
        ? delivery.estimatedArrival !== "Pending update"
          ? delivery.estimatedArrival
          : undefined
        : undefined),
  ];

  if (currentIndex < 0) {
    return CUSTOMER_TRACKING_PROGRESS_STEPS.map((step, index) => ({
      id: step.id,
      label: step.label,
      time: stepTimes[index],
      state:
        index === 0
          ? ("complete" as TimelineEventState)
          : ("upcoming" as TimelineEventState),
    }));
  }

  if (currentIndex >= CUSTOMER_TRACKING_PROGRESS_STEPS.length) {
    return CUSTOMER_TRACKING_PROGRESS_STEPS.map((step, index) => ({
      id: step.id,
      label: step.label,
      time: stepTimes[index],
      state: "complete" as TimelineEventState,
    }));
  }

  return CUSTOMER_TRACKING_PROGRESS_STEPS.map((step, index) => {
    let state: TimelineEventState = "upcoming";
    if (index < currentIndex) state = "complete";
    else if (index === currentIndex) state = "current";

    const description = state === "current" ? updatesForStep(events, index) : undefined;

    return {
      id: step.id,
      label: step.label,
      time: stepTimes[index],
      description,
      state,
    };
  });
}
