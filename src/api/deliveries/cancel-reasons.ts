import type { CancelDeliveryReason } from "@/deliveries/customerCopy";

export type BackendCancellationReasonCode =
  | "CUSTOMER_CHANGED_MIND"
  | "WRONG_ADDRESS"
  | "WRONG_PACKAGE_DETAILS"
  | "DELIVERY_NO_LONGER_REQUIRED"
  | "PROVIDER_DELAY"
  | "OTHER";

export function mapCancelReasonToBackend(
  reason: CancelDeliveryReason | string,
  otherText?: string,
): { reasonCode: BackendCancellationReasonCode; reasonMessage: string | null } {
  switch (reason) {
    case "Wrong pickup or drop-off address":
      return { reasonCode: "WRONG_ADDRESS", reasonMessage: null };
    case "Change of plans":
      return { reasonCode: "CUSTOMER_CHANGED_MIND", reasonMessage: null };
    case "Found another delivery option":
      return { reasonCode: "DELIVERY_NO_LONGER_REQUIRED", reasonMessage: null };
    case "Driver is taking too long":
      return { reasonCode: "PROVIDER_DELAY", reasonMessage: null };
    case "Other":
      return {
        reasonCode: "OTHER",
        reasonMessage: otherText?.trim() || "Other",
      };
    default:
      return { reasonCode: "OTHER", reasonMessage: reason };
  }
}
