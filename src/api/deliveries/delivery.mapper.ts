import { mapE164ToSplitPhoneFields } from "@/auth/phone-mapper";
import type { DeliveryFormData, DeliveryRecommendation } from "@/create-delivery/types";
import {
  getEffectiveSizePreset,
  MEDIUM_PACKAGE_MAX_WEIGHT_KG,
  SMALL_PACKAGE_MAX_WEIGHT_KG,
  syncScheduledAt,
} from "@/create-delivery/types";
import {
  toCustomerServiceName,
  toCustomerServiceType,
} from "@/utils/customerServiceLabels";
import { calculateDeliveryPricing } from "@/deliveries/pricing";
import type {
  BackendHandlingRequirement,
  BackendPackageType,
  BackendSizeTier,
  CreateDeliveryRequest,
  CustomerOrchestrationResultDto,
  CustomerSelectedOptionDto,
} from "./delivery.types";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

function mapPackageType(
  packageType: DeliveryFormData["packageType"],
): BackendPackageType {
  switch (packageType) {
    case "medicine":
      return "MEDICINE";
    case "food":
      return "FOOD";
    case "document":
      return "DOCUMENT";
    case "parcel":
    case "box":
    case "other":
    default:
      return "OTHER";
  }
}

function mapRequirements(requirements: string[]): BackendHandlingRequirement[] {
  const mapped: BackendHandlingRequirement[] = [];
  for (const req of requirements) {
    if (req === "handle-with-care") mapped.push("HANDLE_WITH_CARE");
    if (req === "fragile") mapped.push("FRAGILE");
    if (req === "keep-upright") mapped.push("KEEP_UPRIGHT");
  }
  return [...new Set(mapped)];
}

function deriveBackendSizeTier(weightKg: number): BackendSizeTier {
  if (weightKg <= SMALL_PACKAGE_MAX_WEIGHT_KG) return "SMALL";
  if (weightKg <= MEDIUM_PACKAGE_MAX_WEIGHT_KG) return "MEDIUM";
  return "LARGE";
}

function resolveWeightKg(data: DeliveryFormData): number {
  const parsed = Number.parseFloat(data.weight);
  if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  const preset = getEffectiveSizePreset(data);
  if (preset?.weight) return preset.weight;
  return 0.5;
}

function resolveDimensions(data: DeliveryFormData): {
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
} {
  const length = Number.parseFloat(data.length);
  const width = Number.parseFloat(data.width);
  const height = Number.parseFloat(data.height);
  if (
    !Number.isNaN(length) &&
    !Number.isNaN(width) &&
    !Number.isNaN(height) &&
    length > 0 &&
    width > 0 &&
    height > 0
  ) {
    return { lengthCm: length, widthCm: width, heightCm: height };
  }
  const preset = getEffectiveSizePreset(data);
  if (preset) {
    return {
      lengthCm: preset.length,
      widthCm: preset.width,
      heightCm: preset.height,
    };
  }
  return { lengthCm: null, widthCm: null, heightCm: null };
}

function formatAvailabilityLabel(option: CustomerSelectedOptionDto): string {
  if (!option.availability.known) return "Checking availability";
  if (option.availability.available) return "Available now";
  return option.availability.reason ?? "Limited availability";
}

function mapSelectedOptionToRecommendation(
  option: CustomerSelectedOptionDto,
): DeliveryRecommendation {
  const thirdPartyCharge = option.quote.amount;
  const pricing = calculateDeliveryPricing(thirdPartyCharge);
  const etaLabel = option.estimatedDeliveryAt
    ? new Date(option.estimatedDeliveryAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Estimated after booking";

  return {
    serviceId: option.providerCode,
    serviceName: toCustomerServiceName(),
    thirdPartyCharge,
    estimatedPickup: formatAvailabilityLabel(option),
    estimatedDelivery: etaLabel,
    pricing,
    tagline: option.selectionReason,
    serviceType: toCustomerServiceType(option.serviceCode),
    pickupAvailability: formatAvailabilityLabel(option),
    deliveryEta: etaLabel,
  };
}

export function mapOrchestrationToRecommendation(
  result: CustomerOrchestrationResultDto,
): DeliveryRecommendation {
  const option = result.orchestration.selectedOption;
  if (!option) {
    throw new Error("No delivery option was selected.");
  }
  return mapSelectedOptionToRecommendation(option);
}

export function mapFormToCreateRequest(data: DeliveryFormData): CreateDeliveryRequest {
  const weightKg = resolveWeightKg(data);
  const dims = resolveDimensions(data);
  const pickupPhone = mapE164ToSplitPhoneFields(data.pickupContactPhone);
  const dropPhone = mapE164ToSplitPhoneFields(data.dropContactPhone);

  const schedule =
    data.timing === "scheduled" &&
    data.scheduledDate &&
    data.pickupWindowStart &&
    data.pickupWindowEnd
      ? {
          mode: "SCHEDULED" as const,
          timezone: DEFAULT_TIMEZONE,
          windowStart: syncScheduledAt(data.scheduledDate, data.pickupWindowStart),
          windowEnd: syncScheduledAt(data.scheduledDate, data.pickupWindowEnd),
        }
      : {
          mode: "ASAP" as const,
          timezone: DEFAULT_TIMEZONE,
        };

  return {
    pickup: {
      addressText: data.pickupAddress.trim(),
      contactName: data.pickupContactName.trim(),
      contactPhone: {
        countryCode: pickupPhone.phoneCountryCode,
        number: pickupPhone.phoneNumber,
      },
      instructions: data.instructions.trim() || null,
    },
    drop: {
      addressText: data.dropAddress.trim(),
      contactName: data.dropContactName.trim(),
      contactPhone: {
        countryCode: dropPhone.phoneCountryCode,
        number: dropPhone.phoneNumber,
      },
    },
    package: {
      packageType: mapPackageType(data.packageType),
      description: data.packageDescription.trim() || null,
      weightKg,
      sizeTier: deriveBackendSizeTier(weightKg),
      quantity: 1,
      photos: [],
      ...dims,
    },
    requirements: mapRequirements(data.requirements),
    specialInstructions: data.instructions.trim() || null,
    schedule,
    compliance: { accepted: true },
  };
}
