import type { DeliveryDriver, DeliveryStatus } from "@/deliveries/types";

/**
 * Track-page simulator for MOCK deliveries. Controlled by env flag so staging/production
 * builds can enable it without relying on NODE_ENV (Next sets production on live deploys).
 */
export function isDevDeliverySimulateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_SIMULATE_DELIVERY === "true";
}

export function canSimulateDeliveryProvider(providerCode?: string): boolean {
  if (!isDevDeliverySimulateEnabled()) {
    return false;
  }
  return providerCode === "MOCK";
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

export function resolveDevPreviewDriver(
  status: DeliveryStatus,
  providerCode?: string,
): DeliveryDriver | null {
  if (!isDevDeliverySimulateEnabled() || !canShowDevDriverPreview(status)) {
    return null;
  }
  if (providerCode !== "MOCK") {
    return null;
  }
  return DEV_PREVIEW_DRIVER;
}
