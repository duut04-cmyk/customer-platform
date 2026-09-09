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

export const MIN_PACKAGE_PHOTOS = 3;

export type Timing = "asap" | "scheduled" | "";

export type DeliveryFormData = {
  pickupAddress: string;
  dropAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;
  dropContactName: string;
  dropContactPhone: string;
  packageType: PackageType;
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

export function isDimensionsOptional(packageType: PackageType): boolean {
  return packageType === "food" || packageType === "medicine";
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
  return "Not provided";
}

export function formatWeight(weight: string): string {
  return weight ? `${weight} kg` : "Not provided";
}
