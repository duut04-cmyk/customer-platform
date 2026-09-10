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
    tagline: "Fast & reliable delivery",
    serviceType: "Express delivery",
    pickupAvailability: "Today, 4:00 PM",
    pickupTime: "4:00 PM",
    deliveryEta: "~4:45 PM",
    driver: {
      name: "Rohit Sharma",
      initials: "RS",
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=112&h=112&fit=crop&crop=face",
      rating: 4.8,
      deliveryCount: 124,
      phone: "+91 98765 43210",
      vehicleType: "Bike",
      vehicleNumber: "DL 8C XY 4587",
    },
  },
  {
    serviceId: "cityfleet",
    serviceName: "CityFleet",
    thirdPartyCharge: 185,
    serviceQualityRating: 4.4,
    estimatedPickup: "Within 30 minutes",
    estimatedDelivery: "Today, 5:00 PM",
    estimatedDuration: "~55 min",
    tagline: "City-wide coverage",
    serviceType: "Standard delivery",
    pickupAvailability: "Today, 4:15 PM",
    pickupTime: "4:15 PM",
    deliveryEta: "~5:10 PM",
    driver: {
      name: "Amit Kumar",
      initials: "AK",
      photoUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=112&h=112&fit=crop&crop=face",
      rating: 4.6,
      deliveryCount: 98,
      phone: "+91 98123 45678",
      vehicleType: "Bike",
      vehicleNumber: "DL 1A BC 2345",
    },
  },
  {
    serviceId: "movex",
    serviceName: "MoveX",
    thirdPartyCharge: 240,
    serviceQualityRating: 4.5,
    estimatedPickup: "Within 20 minutes",
    estimatedDelivery: "Today, 4:15 PM",
    estimatedDuration: "~40 min",
    tagline: "Priority express service",
    serviceType: "Express delivery",
    pickupAvailability: "Today, 3:50 PM",
    pickupTime: "3:50 PM",
    deliveryEta: "~4:30 PM",
    driver: {
      name: "Vikram Singh",
      initials: "VS",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=112&h=112&fit=crop&crop=face",
      rating: 4.9,
      deliveryCount: 210,
      phone: "+91 99001 22334",
      vehicleType: "Bike",
      vehicleNumber: "DL 9Z PQ 7890",
    },
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

function formatPickupWindow(data: DeliveryFormData, fallback: string): string {
  if (data.timing === "scheduled" && data.scheduledDate && data.pickupWindowStart) {
    const date = new Date(`${data.scheduledDate}T${data.pickupWindowStart}`);
    if (!Number.isNaN(date.getTime())) {
      const dateLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const timeLabel = date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
      return `${dateLabel}, ${timeLabel}`;
    }
  }
  return fallback;
}

function formatPickupTime(data: DeliveryFormData, fallback: string): string {
  if (data.timing === "scheduled" && data.pickupWindowStart) {
    const [hours, minutes] = data.pickupWindowStart.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
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
    tagline: selected.tagline,
    serviceType: selected.serviceType,
    verified: true,
    pickupAvailability: formatPickupWindow(data, selected.pickupAvailability),
    driver: selected.driver,
    pickupTime: formatPickupTime(data, selected.pickupTime),
    deliveryEta: selected.deliveryEta,
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
