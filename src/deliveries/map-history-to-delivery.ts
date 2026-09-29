import type {
  BackendDeliveryStatus,
  CustomerDriverResponse,
  DeliveryHistoryDetail,
  DeliveryListItemDto,
} from "@/api/deliveries/delivery.types";
import {
  toCustomerServiceName,
  toCustomerServiceType,
} from "@/utils/customerServiceLabels";
import { calculateDeliveryPricing } from "./pricing";
import {
  buildDetailTimelineFromHistory,
  buildTrackingEventsFromHistory,
  buildTrackingMilestones,
  buildTrackingTimelineFromHistory,
  formatEventTime,
  type TrackingEventItem,
} from "./timeline-builder";
import {
  buildDefaultTimeline,
  STATUS_LABELS,
  type Delivery,
  type DeliveryDriver,
  type DeliveryStatus,
} from "./types";

const BACKEND_PACKAGE_LABELS: Record<string, string> = {
  MEDICINE: "Medicine",
  FOOD: "Food",
  DOCUMENT: "Document",
  OTHER: "Other",
};

const REQUIREMENT_LABELS: Record<string, string> = {
  HANDLE_WITH_CARE: "Handle with care",
  FRAGILE: "Fragile",
  KEEP_UPRIGHT: "Keep upright",
};

export function mapBackendStatusToFrontend(
  status: BackendDeliveryStatus,
): DeliveryStatus {
  switch (status) {
    case "CREATED":
    case "ORCHESTRATING":
    case "OPTION_READY":
    case "BOOKING":
    case "BOOKED":
      return "booked";
    case "DRIVER_ASSIGNED":
      return "driver_assigned";
    case "PICKUP_OTP_PENDING":
      return "pickup_otp_pending";
    case "PICKED_UP":
      return "picked_up";
    case "IN_TRANSIT":
      return "in_transit";
    case "DELIVERY_OTP_PENDING":
      return "delivery_otp_pending";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    case "FAILED":
      return "failed";
    default:
      return "booked";
  }
}

function splitCityFromAddress(addressText: string): { city: string; address: string } {
  const parts = addressText
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return { city: "", address: addressText };
  }
  return {
    city: parts[parts.length - 1] ?? "",
    address: parts.slice(0, -1).join(", "),
  };
}

function formatDimensions(
  lengthCm: number | null,
  widthCm: number | null,
  heightCm: number | null,
): string {
  if (lengthCm && widthCm && heightCm) {
    return `${lengthCm} × ${widthCm} × ${heightCm} cm`;
  }
  return "Not provided";
}

function initialsFromName(name: string | null | undefined): string {
  if (!name?.trim()) return "—";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function mapDriver(
  driverResponse: CustomerDriverResponse | Record<string, unknown>,
  frontendStatus: DeliveryStatus,
): DeliveryDriver | undefined {
  const parsed = driverResponse as CustomerDriverResponse;
  if (!parsed.known || !parsed.assigned || !parsed.driver) {
    return undefined;
  }

  const d = parsed.driver;
  const name = d.name ?? "Delivery partner";
  let driverStatus: DeliveryDriver["status"] = "assigned";
  if (frontendStatus === "picked_up") driverStatus = "picked_up";
  if (frontendStatus === "in_transit" || frontendStatus === "delivery_otp_pending") {
    driverStatus = "in_transit";
  }

  return {
    name,
    vehicleType: d.vehicleType ?? "—",
    vehicleNumber: d.vehicleNumber ?? "—",
    phone: d.phone?.e164 ?? undefined,
    status: driverStatus,
    initials: initialsFromName(name),
    photoUrl: d.photoUrl ?? undefined,
  };
}

function resolveServiceCode(history: DeliveryHistoryDetail): string | null {
  return (
    history.booking?.serviceCode ??
    history.orchestration?.selectedOption?.serviceCode ??
    null
  );
}

function resolveProviderCode(history: DeliveryHistoryDetail): string | undefined {
  return (
    history.booking?.providerCode ?? history.orchestration?.selectedOption?.providerCode
  );
}

export function mapHistoryToDelivery(history: DeliveryHistoryDetail): Delivery {
  const frontendStatus = mapBackendStatusToFrontend(history.delivery.status);
  const pickupLoc = splitCityFromAddress(history.pickup.addressText);
  const dropLoc = splitCityFromAddress(history.drop.addressText);
  const quoteAmount =
    history.booking?.quote.amount ??
    history.orchestration?.selectedOption?.quote.amount ??
    0;
  const pricing = quoteAmount > 0 ? calculateDeliveryPricing(quoteAmount) : undefined;
  const driver = mapDriver(history.driver, frontendStatus);
  const latest = history.tracking.latest;
  const serviceCode = resolveServiceCode(history);
  const providerCode = resolveProviderCode(history);
  const selectionReason =
    history.orchestration?.selectedOption?.selectionReason ?? undefined;

  const cancellation = history.cancellation;
  const cancelReason =
    cancellation?.reasonMessage ??
    (cancellation?.reasonCode
      ? cancellation.reasonCode.replaceAll("_", " ")
      : undefined);

  const trackingEvents: TrackingEventItem[] = buildTrackingEventsFromHistory(history);
  const trackingMilestones = buildTrackingMilestones(history);
  const detailTimeline = buildDetailTimelineFromHistory(history, frontendStatus);
  const timeline = buildTrackingTimelineFromHistory(history, frontendStatus);

  const deliveredAtLabel =
    frontendStatus === "delivered"
      ? formatEventTime(history.otp.delivery?.verifiedAt)
      : undefined;

  return {
    id: history.delivery.id,
    reference: history.delivery.reference,
    status: frontendStatus,
    statusLabel: STATUS_LABELS[frontendStatus],
    pickup: pickupLoc,
    dropoff: dropLoc,
    packageType: BACKEND_PACKAGE_LABELS[history.package.packageType] ?? "Package",
    weight: `${history.package.weightKg} kg`,
    dimensions: formatDimensions(
      history.package.lengthCm,
      history.package.widthCm,
      history.package.heightCm,
    ),
    requirements: (
      (history.package as { requirements?: string[] }).requirements ?? []
    ).map((r: string) => REQUIREMENT_LABELS[r] ?? r),
    dateLabel: formatEventTime(history.delivery.createdAt) ?? "—",
    listTimeLabel: formatEventTime(history.delivery.createdAt) ?? "—",
    createdAt: history.delivery.createdAt,
    estimatedArrival: latest?.eta
      ? (formatEventTime(latest.eta) ?? "Pending update")
      : "Pending update",
    driverInitials: driver?.initials ?? "—",
    timeline,
    detailTimeline,
    selectedService: toCustomerServiceName(),
    thirdPartyCharge: quoteAmount || undefined,
    pricing,
    driver,
    specialInstructions: history.delivery.specialInstructions ?? undefined,
    providerCode,
    serviceType: toCustomerServiceType(serviceCode),
    serviceTagline: selectionReason,
    bookedAtLabel: formatEventTime(history.booking?.bookedAt),
    deliveredAtLabel,
    pickupOtpVerified: Boolean(history.otp.pickup?.verifiedAt),
    deliveryOtpVerified: Boolean(history.otp.delivery?.verifiedAt),
    pickupOtpPending: history.otp.pickup?.status === "ACTIVE",
    deliveryOtpPending: history.otp.delivery?.status === "ACTIVE",
    trackingLatitude: latest?.latitude ?? null,
    trackingLongitude: latest?.longitude ?? null,
    trackingUrl: latest?.trackingUrl ?? null,
    trackingEvents,
    trackingMilestones,
    customerRating: history.rating?.deliveryRating,
    ratedAt: history.rating?.submittedAt,
    customerRatingComment: history.feedback?.comment ?? undefined,
    cancelReason,
    cancelledAtLabel: cancellation?.cancelledAt
      ? formatEventTime(cancellation.cancelledAt)
      : undefined,
  };
}

export function mapListItemToDelivery(item: DeliveryListItemDto): Delivery {
  const frontendStatus = mapBackendStatusToFrontend(item.status);
  const pickupLoc = splitCityFromAddress(item.pickup.addressText);
  const dropLoc = splitCityFromAddress(item.drop.addressText);

  return {
    id: item.id,
    reference: item.reference,
    status: frontendStatus,
    statusLabel: STATUS_LABELS[frontendStatus],
    pickup: pickupLoc,
    dropoff: dropLoc,
    packageType: BACKEND_PACKAGE_LABELS[item.packageType] ?? "Package",
    weight: `${item.weightKg} kg`,
    dimensions: "—",
    requirements: [],
    dateLabel: formatEventTime(item.createdAt) ?? "—",
    listTimeLabel: formatEventTime(item.createdAt) ?? "—",
    createdAt: item.createdAt,
    estimatedArrival: "—",
    driverInitials: "—",
    timeline: buildDefaultTimeline(frontendStatus),
  };
}

export function isActiveBackendStatus(status: BackendDeliveryStatus): boolean {
  return !["DELIVERED", "CANCELLED", "FAILED"].includes(status);
}
