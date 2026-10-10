import { mapE164ToSplitPhoneFields } from "@/auth/phone-mapper";
import type {
  DeliveryFormData,
  DeliveryRecommendation,
  PackagePhotoUpload,
} from "@/create-delivery/types";
import {
  formatISODate,
  getEffectiveSizePreset,
  initialDeliveryFormData,
  MEDIUM_PACKAGE_MAX_WEIGHT_KG,
  SMALL_PACKAGE_MAX_WEIGHT_KG,
  syncScheduledAt,
  type PackageSizeTier,
  type PackageType,
  type Timing,
} from "@/create-delivery/types";
import {
  toCustomerServiceName,
  toCustomerServiceType,
} from "@/utils/customerServiceLabels";
import { deliveryPricingFromQuote } from "@/deliveries/pricing";
import type {
  BackendHandlingRequirement,
  BackendPackageType,
  BackendSizeTier,
  CreateDeliveryRequest,
  CustomerOrchestrationResultDto,
  CustomerSelectedOptionDto,
  DeliveryDetailDto,
} from "./delivery.types";
import {
  assertBookableOrchestrationResult,
  normalizeOrchestrationResult,
} from "./orchestration-result";

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
  const pricing = deliveryPricingFromQuote(option.quote);
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
  const bookable = assertBookableOrchestrationResult(
    normalizeOrchestrationResult(result),
  );
  const option = bookable.orchestration.selectedOption!;
  return mapSelectedOptionToRecommendation(option);
}

function reversePackageType(packageType: BackendPackageType): PackageType {
  switch (packageType) {
    case "MEDICINE":
      return "medicine";
    case "FOOD":
      return "food";
    case "DOCUMENT":
      return "document";
    default:
      return "other";
  }
}

function reverseSizeTier(sizeTier: BackendSizeTier): PackageSizeTier {
  switch (sizeTier) {
    case "SMALL":
      return "small";
    case "MEDIUM":
      return "medium";
    case "LARGE":
      return "large";
    default:
      return "";
  }
}

function reverseRequirements(requirements: BackendHandlingRequirement[]): string[] {
  const mapped: string[] = [];
  for (const req of requirements) {
    if (req === "HANDLE_WITH_CARE") mapped.push("handle-with-care");
    if (req === "FRAGILE") mapped.push("fragile");
    if (req === "KEEP_UPRIGHT") mapped.push("keep-upright");
  }
  return mapped;
}

function parseScheduleField(iso: string | null): { date: string; time: string } {
  if (!iso) {
    return { date: "", time: "" };
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }
  return {
    date: formatISODate(parsed),
    time: `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`,
  };
}

/** Rehydrate create-delivery form state from a server delivery record. */
export function mapDeliveryDetailToFormData(
  detail: DeliveryDetailDto,
): DeliveryFormData {
  const scheduled = detail.schedule.mode === "SCHEDULED";
  const windowStart = parseScheduleField(detail.schedule.windowStart);
  const windowEnd = parseScheduleField(detail.schedule.windowEnd);
  const instructions =
    detail.pickup.instructions?.trim() || detail.specialInstructions?.trim() || "";

  return {
    ...initialDeliveryFormData,
    pickupAddress: detail.pickup.addressText,
    pickupLatitude: detail.pickup.latitude,
    pickupLongitude: detail.pickup.longitude,
    dropAddress: detail.drop.addressText,
    dropLatitude: detail.drop.latitude,
    dropLongitude: detail.drop.longitude,
    pickupContactName: detail.pickup.contactName,
    pickupContactPhone: detail.pickup.contactPhone.e164,
    dropContactName: detail.drop.contactName,
    dropContactPhone: detail.drop.contactPhone.e164,
    packageType: reversePackageType(detail.package.packageType),
    packageSizeTier: reverseSizeTier(detail.package.sizeTier),
    packageDescription: detail.package.description ?? "",
    packagePhotoUrls: [],
    length: detail.package.lengthCm != null ? String(detail.package.lengthCm) : "",
    width: detail.package.widthCm != null ? String(detail.package.widthCm) : "",
    height: detail.package.heightCm != null ? String(detail.package.heightCm) : "",
    weight: String(detail.package.weightKg),
    timing: (scheduled ? "scheduled" : "asap") as Timing,
    scheduledAt: detail.schedule.scheduledAt ?? "",
    scheduledDate: windowStart.date,
    pickupWindowStart: windowStart.time,
    pickupWindowEnd: windowEnd.time,
    requirements: reverseRequirements(detail.requirements),
    instructions,
    complianceConsent: detail.compliance.accepted,
    consentAcceptedAt: detail.compliance.acceptedAt,
  };
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

  const pickupCoords =
    data.pickupLatitude != null && data.pickupLongitude != null
      ? { latitude: data.pickupLatitude, longitude: data.pickupLongitude }
      : {};
  const dropCoords =
    data.dropLatitude != null && data.dropLongitude != null
      ? { latitude: data.dropLatitude, longitude: data.dropLongitude }
      : {};

  return {
    pickup: {
      addressText: data.pickupAddress.trim(),
      contactName: data.pickupContactName.trim(),
      contactPhone: {
        countryCode: pickupPhone.phoneCountryCode,
        number: pickupPhone.phoneNumber,
      },
      instructions: data.instructions.trim() || null,
      ...pickupCoords,
    },
    drop: {
      addressText: data.dropAddress.trim(),
      contactName: data.dropContactName.trim(),
      contactPhone: {
        countryCode: dropPhone.phoneCountryCode,
        number: dropPhone.phoneNumber,
      },
      ...dropCoords,
    },
    package: {
      packageType: mapPackageType(data.packageType),
      description: data.packageDescription.trim() || null,
      weightKg,
      sizeTier: deriveBackendSizeTier(weightKg),
      quantity: 1,
      photos: data.packagePhotos
        .filter(
          (
            photo,
          ): photo is PackagePhotoUpload & {
            objectKey: string;
            storageProvider: string;
          } => Boolean(photo.objectKey && photo.storageProvider),
        )
        .map((photo) => ({
          objectKey: photo.objectKey,
          storageProvider: photo.storageProvider,
          mimeType: photo.mimeType,
          fileSizeBytes: photo.fileSizeBytes,
        })),
      ...dims,
    },
    requirements: mapRequirements(data.requirements),
    specialInstructions: data.instructions.trim() || null,
    schedule,
    compliance: { accepted: true },
  };
}
