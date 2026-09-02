export type FormStep =
  | "pickup"
  | "package"
  | "requirements"
  | "review"
  | "finding"
  | "confirmed";

export type ProgressStep = "pickup" | "package" | "requirements" | "review";

export type PackageType = "parcel" | "document" | "box" | "other" | "";

export type Timing = "asap" | "today" | "scheduled" | "";

export type DeliveryFormData = {
  pickupAddress: string;
  dropAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;
  dropContactName: string;
  dropContactPhone: string;
  packageType: PackageType;
  length: string;
  width: string;
  height: string;
  weight: string;
  timing: Timing;
  requirements: string[];
  instructions: string;
};

export const initialDeliveryFormData: DeliveryFormData = {
  pickupAddress: "",
  dropAddress: "",
  pickupContactName: "",
  pickupContactPhone: "",
  dropContactName: "",
  dropContactPhone: "",
  packageType: "",
  length: "",
  width: "",
  height: "",
  weight: "",
  timing: "",
  requirements: [],
  instructions: "",
};

export const PACKAGE_LABELS: Record<Exclude<PackageType, "">, string> = {
  parcel: "Parcel",
  document: "Document",
  box: "Box",
  other: "Other",
};

export const TIMING_LABELS: Record<Exclude<Timing, "">, string> = {
  asap: "As soon as possible",
  today: "Today",
  scheduled: "Schedule for later",
};

export const REQUIREMENT_OPTIONS = [
  { id: "handle-with-care", label: "Handle with care" },
  { id: "fragile", label: "Fragile" },
  { id: "keep-upright", label: "Keep upright" },
  { id: "none", label: "No special requirements" },
] as const;

export const MOCK_DELIVERY_ID = "DUTT-1042";
