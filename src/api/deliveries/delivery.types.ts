import type { PhoneResponse } from "@/api/auth/auth.types";

export type BackendDeliveryStatus =
  | "CREATED"
  | "ORCHESTRATING"
  | "OPTION_READY"
  | "BOOKING"
  | "BOOKED"
  | "DRIVER_ASSIGNED"
  | "PICKUP_OTP_PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERY_OTP_PENDING"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type BackendPackageType = "MEDICINE" | "FOOD" | "DOCUMENT" | "OTHER";
export type BackendSizeTier = "SMALL" | "MEDIUM" | "LARGE";
export type BackendScheduleMode = "ASAP" | "SCHEDULED";
export type BackendHandlingRequirement =
  "HANDLE_WITH_CARE" | "FRAGILE" | "KEEP_UPRIGHT";

export type CreateDeliveryRequest = {
  pickup: {
    addressText: string;
    contactName: string;
    contactPhone: { countryCode: string; number: string };
    instructions?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  drop: {
    addressText: string;
    contactName: string;
    contactPhone: { countryCode: string; number: string };
    instructions?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  package: {
    packageType: BackendPackageType;
    description?: string | null;
    weightKg: number;
    lengthCm?: number | null;
    widthCm?: number | null;
    heightCm?: number | null;
    sizeTier?: BackendSizeTier | null;
    quantity?: number;
    photos?: Array<{
      objectKey: string;
      storageProvider?: string;
      mimeType?: string | null;
      fileSizeBytes?: number | null;
    }>;
  };
  requirements?: BackendHandlingRequirement[];
  specialInstructions?: string | null;
  schedule: {
    mode: BackendScheduleMode;
    timezone: string;
    windowStart?: string | null;
    windowEnd?: string | null;
  };
  compliance: { accepted: true };
};

export type DeliveryDetailDto = {
  id: string;
  reference: string;
  status: BackendDeliveryStatus;
  pickup: {
    addressText: string;
    contactName: string;
    contactPhone: PhoneResponse;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  drop: {
    addressText: string;
    contactName: string;
    contactPhone: PhoneResponse;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  package: {
    packageType: BackendPackageType;
    description: string | null;
    weightKg: number;
    lengthCm: number | null;
    widthCm: number | null;
    heightCm: number | null;
    sizeTier: BackendSizeTier;
    quantity: number;
    photos: Array<{
      objectKey: string;
      storageProvider: string;
      mimeType: string | null;
      fileSizeBytes: number | null;
    }>;
  };
  requirements: BackendHandlingRequirement[];
  specialInstructions: string | null;
  schedule: {
    mode: BackendScheduleMode;
    timezone: string;
    scheduledAt: string | null;
    windowStart: string | null;
    windowEnd: string | null;
  };
  compliance: { accepted: boolean; acceptedAt: string };
  createdAt: string;
  updatedAt: string;
};

export type DeliveryListItemDto = {
  id: string;
  reference: string;
  status: BackendDeliveryStatus;
  pickup: { addressText: string; contactName: string };
  drop: { addressText: string; contactName: string };
  packageType: BackendPackageType;
  weightKg: number;
  sizeTier: BackendSizeTier;
  schedule: {
    mode: BackendScheduleMode;
    scheduledAt: string | null;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type PaginatedDeliveriesDto = {
  items: DeliveryListItemDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CustomerSelectedOptionDto = {
  providerCode: string;
  serviceCode: string | null;
  quote: { amount: number; currency: string };
  estimatedDeliveryAt: string | null;
  availability: {
    known: boolean;
    available?: boolean;
    availableDriverCount?: number | null;
    reason?: string | null;
  };
  selectionReason: string;
  cancellationPolicy: {
    policyKnown: boolean;
    supported?: boolean;
  };
};

export type CustomerOrchestrationResultDto = {
  deliveryId: string;
  status: BackendDeliveryStatus;
  orchestration: {
    id: string;
    attemptNumber: number;
    completedAt: string | null;
    selectedOption: CustomerSelectedOptionDto | null;
  };
};

export type CustomerBookingDto = {
  id: string;
  providerCode: string;
  serviceCode: string | null;
  status: string;
  providerReference: string | null;
  quote: { amount: number; currency: string };
  bookedAt: string | null;
};

export type ConfirmDeliveryResultDto = {
  delivery: { id: string; reference: string; status: BackendDeliveryStatus };
  booking: CustomerBookingDto;
};

export type CustomerDriverResponse = {
  known: boolean;
  assigned?: boolean;
  status?: string;
  driver?: {
    name: string | null;
    phone: PhoneResponse | null;
    photoUrl: string | null;
    vehicleType: string | null;
    vehicleNumber: string | null;
    assignedAt: string | null;
  } | null;
};

export type TrackingPointDto = {
  normalizedStatus: string | null;
  providerStatus: string | null;
  latitude: number | null;
  longitude: number | null;
  eta: string | null;
  trackingUrl: string | null;
  lastUpdatedAt: string;
};

export type OtpHistoryMetadata = {
  generatedAt: string;
  expiresAt: string;
  verifiedAt: string | null;
  consumedAt: string | null;
  attempts: number;
  maxAttempts: number;
  status: "ACTIVE" | "CONSUMED" | "EXPIRED" | "LOCKED";
};

export type DeliveryHistoryDetail = {
  delivery: {
    id: string;
    reference: string;
    status: BackendDeliveryStatus;
    specialInstructions: string | null;
    createdAt: string;
    updatedAt: string;
  };
  pickup: DeliveryDetailDto["pickup"];
  drop: DeliveryDetailDto["drop"];
  package: DeliveryDetailDto["package"] & { requirements?: string[] };
  schedule: DeliveryDetailDto["schedule"];
  timeline: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    source: string;
    reason: string | null;
    createdAt: string;
  }>;
  orchestration: {
    id: string;
    attemptNumber: number;
    completedAt: string | null;
    selectedOption: {
      providerCode: string;
      serviceCode: string | null;
      quote: { amount: number; currency: string };
      selectionReason: string | null;
    } | null;
  } | null;
  booking: {
    id: string;
    providerCode: string;
    serviceCode: string | null;
    status: string;
    providerReference: string | null;
    providerOrderId?: string | null;
    quote: { amount: number; currency: string };
    bookedAt: string | null;
  } | null;
  driver: CustomerDriverResponse;
  tracking: {
    latest: TrackingPointDto | null;
    history: Array<{
      id: string;
      latitude: number | null;
      longitude: number | null;
      normalizedStatus: string | null;
      providerStatus: string | null;
      eta: string | null;
      trackingUrl: string | null;
      receivedAt: string;
    }>;
  };
  otp: {
    pickup: OtpHistoryMetadata | null;
    delivery: OtpHistoryMetadata | null;
  };
  rating: {
    driverRating: number;
    deliveryRating: number;
    submittedAt: string;
  } | null;
  feedback: {
    positiveTags: string[];
    issueTags: string[];
    comment: string | null;
    submittedAt: string;
  } | null;
  cancellation: {
    id: string;
    status: string;
    reasonCode: string;
    reasonMessage: string | null;
    requestedAt: string;
    cancelledAt: string | null;
    providerCancellationReference?: string | null;
  } | null;
};

export type ApiSuccess<T> = { success: true; data: T };

export type ListDeliveriesQuery = {
  page?: number;
  limit?: number;
  status?: BackendDeliveryStatus;
  from?: string;
  to?: string;
  reference?: string;
};

export type SubmitRatingBody = {
  driverRating: number;
  deliveryRating: number;
};

export type SubmitFeedbackBody = {
  positiveTags?: string[];
  issueTags?: string[];
  comment?: string | null;
};
