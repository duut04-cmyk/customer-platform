import {
  getBooking,
  getDelivery,
  getOrchestration,
  mapDeliveryDetailToFormData,
  mapOrchestrationToRecommendation,
} from "@/api/deliveries";
import { ApiError } from "@/api/errors";
import { normalizeOrchestrationResult } from "@/api/deliveries/orchestration-result";
import type { BackendDeliveryStatus } from "@/api/deliveries/delivery.types";
import { calculateDeliveryPricing } from "@/deliveries/pricing";
import { deliveryRoutePath } from "@/deliveries/paths";
import {
  toCustomerServiceName,
  toCustomerServiceType,
} from "@/utils/customerServiceLabels";
import type { CreateDeliveryUrlPhase } from "./create-delivery-url";
import type {
  BookingResult,
  DeliveryFormData,
  DeliveryRecommendation,
  FormStep,
} from "./types";

const POST_WIZARD_STATUSES: BackendDeliveryStatus[] = [
  "BOOKED",
  "DRIVER_ASSIGNED",
  "PICKUP_OTP_PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERY_OTP_PENDING",
  "DELIVERED",
  "CANCELLED",
];

export type RestoreCreateDeliveryResult =
  | { kind: "redirect"; href: string }
  | {
      kind: "restored";
      deliveryId: string;
      formData: DeliveryFormData;
      step: FormStep;
      recommendation: DeliveryRecommendation | null;
      booking: BookingResult | null;
    }
  | { kind: "not_found" };

async function loadRecommendation(
  deliveryId: string,
): Promise<DeliveryRecommendation | null> {
  try {
    const orchestration = await getOrchestration(deliveryId);
    return mapOrchestrationToRecommendation(
      normalizeOrchestrationResult(orchestration.data),
    );
  } catch {
    return null;
  }
}

export async function restoreCreateDeliverySession(
  deliveryId: string,
  urlPhase: CreateDeliveryUrlPhase | null,
): Promise<RestoreCreateDeliveryResult> {
  let delivery;
  try {
    const response = await getDelivery(deliveryId);
    delivery = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { kind: "not_found" };
    }
    throw error;
  }

  const formData = mapDeliveryDetailToFormData(delivery);

  if (urlPhase === "confirmed") {
    const recommendation = await loadRecommendation(delivery.id);
    try {
      const bookingResponse = await getBooking(delivery.id);
      const booking: BookingResult = {
        deliveryId: delivery.id,
        deliveryReference: bookingResponse.data.delivery.reference,
        recommendation:
          recommendation ??
          (() => {
            const thirdPartyCharge = bookingResponse.data.booking.quote.amount;
            return {
              serviceId: bookingResponse.data.booking.providerCode,
              serviceName: toCustomerServiceName(),
              thirdPartyCharge,
              estimatedPickup: "Confirmed",
              estimatedDelivery: "Confirmed",
              pricing: calculateDeliveryPricing(thirdPartyCharge),
              tagline: "Booked delivery",
              serviceType: toCustomerServiceType(
                bookingResponse.data.booking.serviceCode,
              ),
              pickupAvailability: "Confirmed",
              deliveryEta: "Confirmed",
            } satisfies DeliveryRecommendation;
          })(),
      };
      return {
        kind: "restored",
        deliveryId: delivery.id,
        formData,
        step: "confirmed",
        recommendation: booking.recommendation,
        booking,
      };
    } catch {
      return { kind: "redirect", href: deliveryRoutePath(delivery.id) };
    }
  }

  if (POST_WIZARD_STATUSES.includes(delivery.status)) {
    return { kind: "redirect", href: deliveryRoutePath(delivery.id) };
  }

  if (delivery.status === "FAILED") {
    return {
      kind: "restored",
      deliveryId: delivery.id,
      formData,
      step: "review",
      recommendation: null,
      booking: null,
    };
  }

  if (delivery.status === "CREATED" || delivery.status === "ORCHESTRATING") {
    return {
      kind: "restored",
      deliveryId: delivery.id,
      formData,
      step: "finding",
      recommendation: null,
      booking: null,
    };
  }

  const recommendation = await loadRecommendation(delivery.id);

  if (urlPhase === "booking" || delivery.status === "BOOKING") {
    return {
      kind: "restored",
      deliveryId: delivery.id,
      formData,
      step: "booking",
      recommendation,
      booking: null,
    };
  }

  if (delivery.status === "OPTION_READY") {
    return {
      kind: "restored",
      deliveryId: delivery.id,
      formData,
      step: recommendation ? "best_option" : "finding",
      recommendation,
      booking: null,
    };
  }

  return {
    kind: "restored",
    deliveryId: delivery.id,
    formData,
    step: "review",
    recommendation,
    booking: null,
  };
}
