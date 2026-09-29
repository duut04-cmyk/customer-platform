import { apiClient } from "@/api/client";
import { IDEMPOTENCY_HEADER } from "@/api/deliveries/delivery.constants";
import { PAYMENT_ENDPOINTS } from "./payment.constants";
import type { PaymentCreateResponse, PaymentGetResponse } from "./payment.types";

function idempotencyHeaders(key: string): Record<string, string> {
  return { [IDEMPOTENCY_HEADER]: key };
}

export async function createPaymentForDelivery(
  deliveryId: string,
  idempotencyKey?: string,
) {
  return apiClient.post<PaymentCreateResponse>(
    PAYMENT_ENDPOINTS.forDelivery(deliveryId),
    {},
    idempotencyKey ? { headers: idempotencyHeaders(idempotencyKey) } : undefined,
  );
}

export async function getPaymentForDelivery(deliveryId: string) {
  return apiClient.get<PaymentGetResponse>(PAYMENT_ENDPOINTS.forDelivery(deliveryId));
}
