import type { DeliveryPricing } from "@/deliveries/pricing";

export type FormStep =
  | "pickup"
  | "package"
  | "requirements"
  | "consent"
  | "review"
  | "finding"
  | "best_option"
  | "booking"
  | "confirmed";

export type ProgressStep = "pickup" | "package" | "requirements" | "consent" | "review";

export type PackageType =
  "parcel" | "document" | "box" | "other" | "food" | "medicine" | "";

export type PackageSizeTier = "small" | "medium" | "large" | "";

export type SizePreset = {
  length: number;
  width: number;
  height: number;
  weight: number;
};

/** Max weight (kg) for Small — matches backend deriveSizeTier. */
export const SMALL_PACKAGE_MAX_WEIGHT_KG = 0.5;
/** Max weight (kg) for Medium — matches backend deriveSizeTier. */
export const MEDIUM_PACKAGE_MAX_WEIGHT_KG = 2.5;
export const MAX_PACKAGE_DESCRIPTION_LENGTH = 200;

export const MIN_PACKAGE_PHOTOS = 3;
export const MAX_PACKAGE_PHOTOS = 5;

export type Timing = "asap" | "scheduled" | "";

export type DeliveryFormData = {
  pickupAddress: string;
  dropAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;
  dropContactName: string;
  dropContactPhone: string;
  packageType: PackageType;
  packageSizeTier: PackageSizeTier;
  packageDescription: string;
  packagePhotoUrls: string[];
  length: string;
  width: string;
  height: string;
  weight: string;
  timing: Timing;
  scheduledAt: string;
  scheduledDate: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  requirements: string[];
  instructions: string;
  complianceConsent: boolean;
  consentAcceptedAt: string;
};

export type RecommendedDriver = {
  name: string;
  initials: string;
  photoUrl: string;
  rating: number;
  deliveryCount: number;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
};

export type DeliveryRecommendation = {
  serviceId: string;
  serviceName: string;
  thirdPartyCharge: number;
  serviceQualityRating: number;
  estimatedPickup: string;
  estimatedDelivery: string;
  estimatedDuration: string;
  packageCompatible: boolean;
  pricing: DeliveryPricing;
  tagline: string;
  serviceType: string;
  verified: boolean;
  pickupAvailability: string;
  driver: RecommendedDriver;
  pickupTime: string;
  deliveryEta: string;
};

export type BookingResult = {
  deliveryId: string;
  recommendation: DeliveryRecommendation;
};

export const initialDeliveryFormData: DeliveryFormData = {
  pickupAddress: "",
  dropAddress: "",
  pickupContactName: "",
  pickupContactPhone: "",
  dropContactName: "",
  dropContactPhone: "",
  packageType: "",
  packageSizeTier: "",
  packageDescription: "",
  packagePhotoUrls: [],
  length: "",
  width: "",
  height: "",
  weight: "",
  timing: "asap",
  scheduledAt: "",
  scheduledDate: "",
  pickupWindowStart: "",
  pickupWindowEnd: "",
  requirements: [],
  instructions: "",
  complianceConsent: false,
  consentAcceptedAt: "",
};

export function hasComplianceConsent(data: DeliveryFormData): boolean {
  return data.complianceConsent;
}

export const PACKAGE_LABELS: Record<Exclude<PackageType, "">, string> = {
  parcel: "Parcel",
  document: "Document",
  box: "Box",
  other: "Other",
  food: "Food",
  medicine: "Medicine",
};

export const PACKAGE_SIZE_TIER_LABELS: Record<Exclude<PackageSizeTier, "">, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large / heavy",
};

const SIZE_PRESETS: Partial<
  Record<
    Exclude<PackageType, "">,
    Partial<Record<Exclude<PackageSizeTier, "">, SizePreset>>
  >
> = {
  document: {
    small: { length: 25, width: 18, height: 2, weight: 0.2 },
    medium: { length: 30, width: 22, height: 5, weight: 0.5 },
  },
  medicine: {
    small: { length: 15, width: 10, height: 5, weight: 0.3 },
    medium: { length: 25, width: 20, height: 12, weight: 1.5 },
  },
  food: {
    small: { length: 25, width: 25, height: 10, weight: 0.8 },
    medium: { length: 35, width: 30, height: 20, weight: 2 },
  },
  other: {
    medium: { length: 35, width: 30, height: 25, weight: 3 },
  },
};

export function getDefaultPackageSizeTier(packageType: PackageType): PackageSizeTier {
  if (packageType === "other") return "medium";
  if (
    packageType === "document" ||
    packageType === "food" ||
    packageType === "medicine"
  ) {
    return "small";
  }
  return "small";
}

export function isPackageSizeTierAllowed(
  packageType: PackageType,
  tier: PackageSizeTier,
): boolean {
  if (!tier) return false;
  if (packageType === "other" && tier === "small") return false;
  return true;
}

export function requiresPackageWeight(data: DeliveryFormData): boolean {
  if (!data.packageSizeTier) return false;
  if (data.packageSizeTier === "medium" || data.packageSizeTier === "large") {
    return true;
  }
  return data.packageType === "other";
}

export function requiresPackageDimensions(data: DeliveryFormData): boolean {
  if (data.packageSizeTier === "large") return true;
  if (data.packageType === "other") return true;
  return false;
}

export function getSizePreset(data: DeliveryFormData): SizePreset | null {
  if (!data.packageType || !data.packageSizeTier) return null;
  if (data.packageSizeTier === "large") return null;
  return SIZE_PRESETS[data.packageType]?.[data.packageSizeTier] ?? null;
}

export function getEffectiveSizePreset(data: DeliveryFormData): SizePreset | null {
  if (data.length.trim() && data.width.trim() && data.height.trim()) {
    return null;
  }
  return getSizePreset(data);
}

export function requiresPackageDescription(data: DeliveryFormData): boolean {
  return data.packageType === "other";
}

export function getPackageDescriptionPlaceholder(packageType: PackageType): string {
  switch (packageType) {
    case "medicine":
      return "e.g. Prescription medicines, sealed strip pack";
    case "food":
      return "e.g. 2 meal boxes — keep upright";
    case "document":
      return "e.g. Legal papers in sealed envelope";
    case "other":
      return "e.g. Laptop charger, spare parts in bubble wrap";
    default:
      return "Briefly describe what's inside";
  }
}

export function getPackageSizeHelperText(data: DeliveryFormData): string {
  if (!data.packageType || !data.packageSizeTier) {
    return "Select a size so we can match the right driver.";
  }

  if (data.packageType === "document" && data.packageSizeTier === "small") {
    return "A few pages or one envelope — no dimensions needed.";
  }

  if (data.packageSizeTier === "small") {
    return "Light items that fit in a bag. Add weight only if you know it.";
  }

  if (data.packageSizeTier === "medium") {
    return "Hand-carry size. Weight helps the driver plan pickup.";
  }

  return "Heavy or bulky items need exact size and weight so the driver can pick them up safely.";
}

export function getPackageWeightTierError(
  tier: PackageSizeTier,
  weightKg: number,
): string | undefined {
  if (tier === "small" && weightKg > SMALL_PACKAGE_MAX_WEIGHT_KG) {
    return `Over ${SMALL_PACKAGE_MAX_WEIGHT_KG} kg — choose Medium or Large / heavy.`;
  }
  if (tier === "medium" && weightKg > MEDIUM_PACKAGE_MAX_WEIGHT_KG) {
    return `Over ${MEDIUM_PACKAGE_MAX_WEIGHT_KG} kg — choose Large / heavy.`;
  }
  return undefined;
}

export function getPackageWeightFieldError(data: DeliveryFormData): string | undefined {
  if (!data.weight.trim()) return undefined;

  const parsedWeight = Number.parseFloat(data.weight);
  if (Number.isNaN(parsedWeight) || parsedWeight <= 0) {
    return "Enter a valid weight in kg.";
  }

  return getPackageWeightTierError(data.packageSizeTier, parsedWeight);
}

export function validatePackageFields(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};

  if (!data.packageType) errors.packageType = "Select an item category.";
  if (data.packagePhotoUrls.length < MIN_PACKAGE_PHOTOS) {
    errors.packagePhotoUrls = `Add at least ${MIN_PACKAGE_PHOTOS} package photos.`;
  } else if (data.packagePhotoUrls.length > MAX_PACKAGE_PHOTOS) {
    errors.packagePhotoUrls = `You can upload up to ${MAX_PACKAGE_PHOTOS} package photos.`;
  }
  if (!data.packageSizeTier) {
    errors.packageSizeTier = "Select a package size.";
  } else if (!isPackageSizeTierAllowed(data.packageType, data.packageSizeTier)) {
    errors.packageSizeTier = "Choose a larger size for packed goods.";
  }

  if (requiresPackageWeight(data) && !data.weight.trim()) {
    errors.weight = "Required for this size.";
  }

  if (requiresPackageDimensions(data)) {
    if (!data.length.trim()) errors.length = "Required.";
    if (!data.width.trim()) errors.width = "Required.";
    if (!data.height.trim()) errors.height = "Required.";
  }

  const weightError = getPackageWeightFieldError(data);
  if (weightError) {
    errors.weight = weightError;
  }

  if (requiresPackageDescription(data) && !data.packageDescription.trim()) {
    errors.packageDescription = "Describe what's inside the package.";
  } else if (data.packageDescription.trim().length > MAX_PACKAGE_DESCRIPTION_LENGTH) {
    errors.packageDescription = `Keep it under ${MAX_PACKAGE_DESCRIPTION_LENGTH} characters.`;
  }

  return errors;
}

export function isPackageStepComplete(data: DeliveryFormData): boolean {
  return Object.keys(validatePackageFields(data)).length === 0;
}

export const TIMING_LABELS: Record<Exclude<Timing, "">, string> = {
  asap: "As soon as possible",
  scheduled: "Schedule for later",
};

export const REQUIREMENT_OPTIONS = [
  { id: "handle-with-care", label: "Handle with care" },
  { id: "fragile", label: "Fragile" },
  { id: "keep-upright", label: "Keep upright" },
  { id: "none", label: "No special requirements" },
] as const;

export const MOCK_DELIVERY_ID = "DUTT-1042";

export function formatScheduledAt(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatScheduledDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const [y, mo, d] = dateStr.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  if (Number.isNaN(date.getTime())) return dateStr;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const shortDate = date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  if (diffDays === 0) return `Today, ${shortDate}`;
  if (diffDays === 1) return `Tomorrow, ${shortDate}`;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime12Hour(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function syncScheduledAt(date: string, startTime: string): string {
  if (!date || !startTime) return "";
  const [y, mo, d] = date.split("-").map(Number);
  const [h, min] = startTime.split(":").map(Number);
  const scheduled = new Date(y, mo - 1, d, h, min);
  if (Number.isNaN(scheduled.getTime())) return "";
  return scheduled.toISOString();
}

export function getScheduledDateOptions(): { value: string; label: string }[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    date.setHours(0, 0, 0, 0);
    const value = formatISODate(date);
    return { value, label: formatScheduledDateLabel(value) };
  });
}

export function getPickupTimeSlotOptions(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 20 && minute === 30) break;
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push({ value, label: formatTime12Hour(value) });
    }
  }
  return slots;
}

export function getDefaultScheduledFields(): Pick<
  DeliveryFormData,
  "scheduledDate" | "pickupWindowStart" | "pickupWindowEnd" | "scheduledAt"
> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const scheduledDate = formatISODate(tomorrow);
  const pickupWindowStart = "16:00";
  const pickupWindowEnd = "16:30";
  return {
    scheduledDate,
    pickupWindowStart,
    pickupWindowEnd,
    scheduledAt: syncScheduledAt(scheduledDate, pickupWindowStart),
  };
}

export function formatTimingSummary(data: DeliveryFormData): string {
  if (!data.timing) return "Not specified";
  if (data.timing === "asap") return TIMING_LABELS.asap;
  if (data.timing === "scheduled") {
    if (data.scheduledDate && data.pickupWindowStart && data.pickupWindowEnd) {
      return `${formatScheduledDateLabel(data.scheduledDate)} · ${formatTime12Hour(data.pickupWindowStart)} – ${formatTime12Hour(data.pickupWindowEnd)}`;
    }
    if (data.scheduledAt) return formatScheduledAt(data.scheduledAt);
    return "Not specified";
  }
  return "Not specified";
}

export function formatDimensions(data: DeliveryFormData): string {
  if (data.length && data.width && data.height) {
    return `${data.length} × ${data.width} × ${data.height} cm`;
  }
  const preset = getEffectiveSizePreset(data);
  if (preset) {
    return `${preset.length} × ${preset.width} × ${preset.height} cm (estimated)`;
  }
  return "Not provided";
}

export function formatWeight(data: DeliveryFormData | string): string {
  if (typeof data === "string") {
    return data ? `${data} kg` : "Not provided";
  }
  if (data.weight.trim()) return `${data.weight} kg`;
  const preset = getEffectiveSizePreset(data);
  if (preset) return `${preset.weight} kg (estimated)`;
  return "Not provided";
}

export function formatPackageSizeSummary(data: DeliveryFormData): string {
  if (!data.packageSizeTier) return "Not selected";
  return PACKAGE_SIZE_TIER_LABELS[data.packageSizeTier];
}
