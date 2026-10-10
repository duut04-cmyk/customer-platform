import { apiClient, type ApiClientRequestOptions } from "@/api/client";
import { ApiError } from "@/api/errors";
import {
  assertBookableOrchestrationResult,
  isOrchestrationBookable,
  isOrchestrationInProgress,
  NO_ELIGIBLE_PROVIDERS_MESSAGE,
  normalizeOrchestrationResult,
} from "./orchestration-result";
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
  SubmitDeliveryExperienceBody,
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

const ORCHESTRATE_POST_TIMEOUT_MS = 120_000;
/** How long to poll GET /orchestration after a lost or in-flight POST. */
const ORCHESTRATE_POLL_TOTAL_MS = 120_000;
const ORCHESTRATE_POLL_INTERVAL_MS = 500;
const ORCHESTRATE_POLL_INTERVAL_MAX_MS = 2_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOrchestrationTransportError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.code === "NETWORK_ERROR" ||
      error.code === "REQUEST_ABORTED" ||
      error.status === 0)
  );
}

function isOrchestrationConflictError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 409 || error.code === "ORCHESTRATION_IN_PROGRESS")
  );
}

export async function orchestrateDelivery(
  id: string,
  options?: ApiClientRequestOptions,
) {
  return apiClient.post<ApiSuccess<CustomerOrchestrationResultDto>>(
    DELIVERY_ENDPOINTS.orchestrate(id),
    {},
    options,
  );
}

export async function getOrchestration(id: string) {
  return apiClient.get<ApiSuccess<CustomerOrchestrationResultDto>>(
    DELIVERY_ENDPOINTS.orchestration(id),
  );
}

/**
 * One GET attempt. Returns completed OPTION_READY, null if still in progress / not found,
 * or throws on definitive business failure. Transport errors return null (retry poll).
 */
async function readOrchestrationSnapshot(
  deliveryId: string,
): Promise<CustomerOrchestrationResultDto | null> {
  try {
    const latest = await getOrchestration(deliveryId);
    const data = normalizeOrchestrationResult(latest.data);
    if (isOrchestrationBookable(data)) {
      return data;
    }
    if (data.status === "FAILED") {
      throw new Error(NO_ELIGIBLE_PROVIDERS_MESSAGE);
    }
    return null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    if (isOrchestrationTransportError(error)) {
      return null;
    }
    throw error;
  }
}

/** Poll until orchestration completes or deadline — used when POST response is lost. */
export async function waitForOrchestrationResult(
  deliveryId: string,
  options?: { totalMs?: number; intervalMs?: number },
): Promise<CustomerOrchestrationResultDto> {
  const totalMs = options?.totalMs ?? ORCHESTRATE_POLL_TOTAL_MS;
  const baseIntervalMs = options?.intervalMs ?? ORCHESTRATE_POLL_INTERVAL_MS;
  const deadline = Date.now() + totalMs;
  let lastTransportError: ApiError | null = null;
  let pollAttempt = 0;

  while (Date.now() < deadline) {
    try {
      const completed = await readOrchestrationSnapshot(deliveryId);
      if (completed) {
        return completed;
      }
    } catch (error) {
      if (error instanceof ApiError && isOrchestrationTransportError(error)) {
        lastTransportError = error;
      } else {
        throw error;
      }
    }
    pollAttempt += 1;
    const backoffInterval = Math.min(
      baseIntervalMs * pollAttempt,
      ORCHESTRATE_POLL_INTERVAL_MAX_MS,
    );
    await sleep(backoffInterval);
  }

  if (lastTransportError) {
    throw lastTransportError;
  }

  throw new ApiError({
    status: 0,
    message:
      "We couldn't load delivery options in time. Please try again or go back to review your details.",
    code: "ORCHESTRATION_POLL_TIMEOUT",
  });
}

function finalizeOrchestrationResult(
  data: CustomerOrchestrationResultDto,
  deliveryId: string,
): Promise<CustomerOrchestrationResultDto> {
  const normalized = normalizeOrchestrationResult(data);
  if (isOrchestrationBookable(normalized)) {
    return Promise.resolve(normalized);
  }
  if (isOrchestrationInProgress(normalized)) {
    return waitForOrchestrationResult(deliveryId);
  }
  return Promise.resolve(assertBookableOrchestrationResult(normalized));
}

/** @deprecated Prefer waitForOrchestrationResult — kept for tests/callers. */
export async function fetchCompletedOrchestration(
  deliveryId: string,
): Promise<CustomerOrchestrationResultDto | null> {
  return readOrchestrationSnapshot(deliveryId);
}

/**
 * POST orchestrate once; if the response is lost or orchestration is still running, poll GET
 * until OPTION_READY (no duplicate POST spam).
 */
export async function orchestrateWithRecovery(
  deliveryId: string,
  options?: ApiClientRequestOptions,
): Promise<CustomerOrchestrationResultDto> {
  try {
    const response = await orchestrateDelivery(deliveryId, {
      ...options,
      timeoutMs: options?.timeoutMs ?? ORCHESTRATE_POST_TIMEOUT_MS,
    });
    return finalizeOrchestrationResult(response.data, deliveryId);
  } catch (error) {
    if (options?.signal?.aborted) {
      throw error;
    }

    const shouldPoll =
      isOrchestrationTransportError(error) || isOrchestrationConflictError(error);

    if (shouldPoll) {
      return waitForOrchestrationResult(deliveryId);
    }

    throw error;
  }
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

export async function submitDeliveryExperience(
  id: string,
  body: SubmitDeliveryExperienceBody,
) {
  return apiClient.post(DELIVERY_ENDPOINTS.experience(id), body);
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

export async function advanceDevDeliveryStep(id: string) {
  return apiClient.post<
    ApiSuccess<{
      deliveryId: string;
      previousStatus: string;
      status: string;
      step: string;
      nextStep: string | null;
      devOtp?: string;
    }>
  >(DELIVERY_ENDPOINTS.devAdvance(id));
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
  const orchestration = await orchestrateWithRecovery(deliveryId);

  return {
    deliveryId,
    delivery: created.data,
    orchestration,
  };
}
