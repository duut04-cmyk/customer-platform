import { calculateDeliveryPricing } from "@/deliveries/pricing";
import type { DeliveryFormData, DeliveryRecommendation, PackageType } from "./types";

const SERVICE_OPTIONS = [
  {
    serviceId: "flashdrop",
    serviceName: "FlashDrop",
    thirdPartyCharge: 200,
    serviceQualityRating: 4.6,
    estimatedPickup: "Within 25 minutes",
    estimatedDelivery: "Today, 4:30 PM",
    estimatedDuration: "~45 min",
  },
  {
    serviceId: "cityfleet",
    serviceName: "CityFleet",
    thirdPartyCharge: 185,
    serviceQualityRating: 4.4,
    estimatedPickup: "Within 30 minutes",
    estimatedDelivery: "Today, 5:00 PM",
    estimatedDuration: "~55 min",
  },
  {
    serviceId: "movex",
    serviceName: "MoveX",
    thirdPartyCharge: 240,
    serviceQualityRating: 4.5,
    estimatedPickup: "Within 20 minutes",
    estimatedDelivery: "Today, 4:15 PM",
    estimatedDuration: "~40 min",
  },
] as const;

const CATEGORY_BASE_CHARGE: Record<Exclude<PackageType, "">, number> = {
  parcel: 200,
  document: 165,
  box: 210,
  other: 190,
  food: 195,
  medicine: 220,
};

function hashFormSeed(data: DeliveryFormData): number {
  const seed = [
    data.pickupAddress,
    data.dropAddress,
    data.packageType,
    data.scheduledAt,
    data.weight,
  ].join("|");

  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function resolveThirdPartyCharge(data: DeliveryFormData, fallback: number): number {
  if (data.packageType) {
    return CATEGORY_BASE_CHARGE[data.packageType];
  }
  return fallback;
}

export function getMockDeliveryRecommendation(
  data: DeliveryFormData,
): DeliveryRecommendation {
  const index = hashFormSeed(data) % SERVICE_OPTIONS.length;
  const selected = SERVICE_OPTIONS[index];
  const thirdPartyCharge = resolveThirdPartyCharge(data, selected.thirdPartyCharge);

  const estimatedDelivery =
    data.timing === "scheduled" && data.scheduledAt
      ? formatScheduledDelivery(data.scheduledAt)
      : selected.estimatedDelivery;

  return {
    serviceId: selected.serviceId,
    serviceName: selected.serviceName,
    thirdPartyCharge,
    serviceQualityRating: selected.serviceQualityRating,
    estimatedPickup: selected.estimatedPickup,
    estimatedDelivery,
    estimatedDuration: selected.estimatedDuration,
    packageCompatible: true,
    pricing: calculateDeliveryPricing(thirdPartyCharge),
  };
}

function formatScheduledDelivery(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
