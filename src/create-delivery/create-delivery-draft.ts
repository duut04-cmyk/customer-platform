import type { DeliveryFormData, FormStep, ProgressStep } from "./types";
import { initialDeliveryFormData } from "./types";

const DRAFT_STORAGE_KEY = "doot:create-delivery:draft:v1";

type StoredDraft = {
  version: 1;
  step: ProgressStep;
  data: DeliveryFormData;
};

const progressSteps: ProgressStep[] = [
  "pickup",
  "package",
  "requirements",
  "consent",
  "review",
];

function isProgressStep(step: FormStep): step is ProgressStep {
  return progressSteps.includes(step as ProgressStep);
}

function sanitizeFormForStorage(data: DeliveryFormData): DeliveryFormData {
  return {
    ...data,
    packagePhotos: [],
    packagePhotoUrls: [],
  };
}

export function saveCreateDeliveryDraft(step: FormStep, data: DeliveryFormData): void {
  if (typeof window === "undefined" || !isProgressStep(step)) {
    return;
  }
  try {
    const payload: StoredDraft = {
      version: 1,
      step,
      data: sanitizeFormForStorage(data),
    };
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or private mode — ignore.
  }
}

export function loadCreateDeliveryDraft(): {
  step: ProgressStep;
  data: DeliveryFormData;
} | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    if (parsed.version !== 1 || !isProgressStep(parsed.step) || !parsed.data) {
      return null;
    }
    return {
      step: parsed.step,
      data: {
        ...initialDeliveryFormData,
        ...parsed.data,
        packagePhotos: [],
        packagePhotoUrls: [],
        photoUploadBatchId: parsed.data.photoUploadBatchId || crypto.randomUUID(),
      },
    };
  } catch {
    return null;
  }
}

export function clearCreateDeliveryDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
