import type { DeliveryDriver, DeliveryStatus } from "@/deliveries/types";

/** Dev-only track page control to advance MOCK deliveries through the happy path. */
export function isDevDeliverySimulateEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return process.env.NEXT_PUBLIC_DEV_SIMULATE_DELIVERY === "true";
}

export function canSimulateDeliveryProvider(providerCode?: string): boolean {
  if (!providerCode) {
    return true;
  }
  return providerCode === "MOCK";
}

const STEP_LABELS: Record<string, string> = {
  ASSIGN_DRIVER: "Assign driver",
  ISSUE_PICKUP_OTP: "Issue pickup OTP",
  CONFIRM_PICKUP: "Confirm pickup",
  START_TRANSIT: "Start transit",
  ISSUE_DELIVERY_OTP: "Issue delivery OTP",
  CONFIRM_DELIVERY: "Confirm delivery",
};

export function devSimulateStepLabel(step: string | undefined): string {
  if (!step) {
    return "Simulate next step";
  }
  return STEP_LABELS[step] ?? "Simulate next step";
}

/** Sample driver card for dev UI preview before ASSIGN_DRIVER simulation step. */
export const DEV_PREVIEW_DRIVER: DeliveryDriver = {
  name: "Aman Singh",
  rating: 4.8,
  vehicleType: "Bike",
  vehicleNumber: "PB10AB1234",
  phone: "+919876543210",
  status: "assigned",
  initials: "AS",
  deliveryCount: 128,
};

export function canShowDevDriverPreview(status: DeliveryStatus): boolean {
  return status !== "cancelled" && status !== "failed" && status !== "delivered";
}

export function resolveDevPreviewDriver(status: DeliveryStatus): DeliveryDriver | null {
  if (!isDevDeliverySimulateEnabled() || !canShowDevDriverPreview(status)) {
    return null;
  }
  return DEV_PREVIEW_DRIVER;
}
