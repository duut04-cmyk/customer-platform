import { apiClient } from "@/api/client";
import type { BackendCancellationReasonCode } from "./cancel-reasons";
import { DELIVERY_ENDPOINTS, IDEMPOTENCY_HEADER } from "./delivery.constants";
import type {
  ApiSuccess,
  ConfirmDeliveryResultDto,
  CreateDeliveryRequest,
  CustomerDriverResponse,
  CustomerOrchestrationResultDto,
  DeliveryDetailDto,
  DeliveryHistoryDetail,
  ListDeliveriesQuery,
  PaginatedDeliveriesDto,
  SubmitFeedbackBody,
  SubmitRatingBody,
  TrackingPointDto,
} from "./delivery.types";

function idempotencyHeaders(key: string): Record<string, string> {
  return { [IDEMPOTENCY_HEADER]: key };
}

export async function createDelivery(
  body: CreateDeliveryRequest,
  idempotencyKey: string,
) {
  return apiClient.post<ApiSuccess<DeliveryDetailDto>>(
    DELIVERY_ENDPOINTS.create,
    body,
    { headers: idempotencyHeaders(idempotencyKey) },
  );
}

export async function listDeliveries(query: ListDeliveriesQuery = {}) {
  const params = new URLSearchParams();
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.reference) params.set("reference", query.reference);
  const qs = params.toString();
  const path = qs ? `${DELIVERY_ENDPOINTS.list}?${qs}` : DELIVERY_ENDPOINTS.list;
  return apiClient.get<ApiSuccess<PaginatedDeliveriesDto>>(path);
}

export async function getDelivery(id: string) {
  return apiClient.get<ApiSuccess<DeliveryDetailDto>>(DELIVERY_ENDPOINTS.byId(id));
}

export async function getDeliveryHistory(id: string) {
  return apiClient.get<ApiSuccess<DeliveryHistoryDetail>>(
    DELIVERY_ENDPOINTS.history(id),
  );
}

export async function orchestrateDelivery(id: string) {
  return apiClient.post<ApiSuccess<CustomerOrchestrationResultDto>>(
    DELIVERY_ENDPOINTS.orchestrate(id),
    {},
  );
}

export async function getOrchestration(id: string) {
  return apiClient.get<ApiSuccess<CustomerOrchestrationResultDto>>(
    DELIVERY_ENDPOINTS.orchestration(id),
  );
}

export async function confirmDelivery(id: string, idempotencyKey?: string) {
  return apiClient.post<ApiSuccess<ConfirmDeliveryResultDto>>(
    DELIVERY_ENDPOINTS.confirm(id),
    {},
    idempotencyKey ? { headers: idempotencyHeaders(idempotencyKey) } : undefined,
  );
}

export async function getBooking(id: string) {
  return apiClient.get<
    ApiSuccess<{
      delivery: ConfirmDeliveryResultDto["delivery"];
      booking: ConfirmDeliveryResultDto["booking"];
    }>
  >(DELIVERY_ENDPOINTS.booking(id));
}

export async function getDriver(id: string) {
  return apiClient.get<ApiSuccess<CustomerDriverResponse>>(
    DELIVERY_ENDPOINTS.driver(id),
  );
}

export async function getTracking(id: string) {
  return apiClient.get<
    ApiSuccess<{
      deliveryId: string;
      status: string;
      tracking: TrackingPointDto | null;
    }>
  >(DELIVERY_ENDPOINTS.tracking(id));
}

export async function generatePickupOtp(id: string) {
  return apiClient.post<
    ApiSuccess<{ deliveryId: string; type: "PICKUP"; expiresAt: string }>
  >(DELIVERY_ENDPOINTS.pickupOtp(id));
}

export async function verifyPickupOtp(id: string, otp: string) {
  return apiClient.post<ApiSuccess<{ deliveryId: string; status: "PICKED_UP" }>>(
    DELIVERY_ENDPOINTS.verifyPickupOtp(id),
    { otp },
  );
}

export async function generateDeliveryOtp(id: string) {
  return apiClient.post<
    ApiSuccess<{ deliveryId: string; type: "DELIVERY"; expiresAt: string }>
  >(DELIVERY_ENDPOINTS.deliveryOtp(id));
}

export async function verifyDeliveryOtp(id: string, otp: string) {
  return apiClient.post<ApiSuccess<{ deliveryId: string; status: "DELIVERED" }>>(
    DELIVERY_ENDPOINTS.verifyDeliveryOtp(id),
    { otp },
  );
}

export async function submitRating(id: string, body: SubmitRatingBody) {
  return apiClient.post(DELIVERY_ENDPOINTS.rating(id), body);
}

export async function getRating(id: string) {
  return apiClient.get<
    ApiSuccess<{
      driverRating: number;
      deliveryRating: number;
      submittedAt: string;
    }>
  >(DELIVERY_ENDPOINTS.rating(id));
}

export async function submitFeedback(id: string, body: SubmitFeedbackBody) {
  return apiClient.post(DELIVERY_ENDPOINTS.feedback(id), body);
}

export async function getFeedback(id: string) {
  return apiClient.get<
    ApiSuccess<{
      positiveTags: string[];
      issueTags: string[];
      comment: string | null;
      submittedAt: string;
    }>
  >(DELIVERY_ENDPOINTS.feedback(id));
}

export async function cancelDelivery(
  id: string,
  body: {
    reasonCode: BackendCancellationReasonCode;
    reasonMessage?: string | null;
  },
  idempotencyKey?: string,
) {
  return apiClient.post<
    ApiSuccess<{
      delivery: { id: string; reference: string; status: string };
      cancellation: {
        id: string;
        status: string;
        reasonCode: string;
        reasonMessage: string | null;
        cancelledAt: string | null;
      };
    }>
  >(
    DELIVERY_ENDPOINTS.cancel(id),
    body,
    idempotencyKey ? { headers: idempotencyHeaders(idempotencyKey) } : undefined,
  );
}

/** Create delivery then orchestrate — primary create-flow entry point. */
export async function createAndOrchestrate(
  body: CreateDeliveryRequest,
  createIdempotencyKey: string,
) {
  const created = await createDelivery(body, createIdempotencyKey);
  const deliveryId = created.data.id;
  const orchestration = await orchestrateDelivery(deliveryId);

  if (orchestration.data.status === "FAILED") {
    throw new Error(
      "No eligible delivery providers were found for this route. Try adjusting your package or timing.",
    );
  }

  if (!orchestration.data.orchestration.selectedOption) {
    throw new Error("Orchestration completed without a selected delivery option.");
  }

  return {
    deliveryId,
    delivery: created.data,
    orchestration: orchestration.data,
  };
}
