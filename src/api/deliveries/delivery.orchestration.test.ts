import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { waitForOrchestrationResult } from "./delivery.api";
import type { CustomerOrchestrationResultDto } from "./delivery.types";

describe("waitForOrchestrationResult", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:5000/api/v1";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const optionReady: CustomerOrchestrationResultDto = {
    deliveryId: "delivery-1",
    status: "OPTION_READY",
    orchestration: {
      id: "orch-1",
      attemptNumber: 1,
      completedAt: new Date().toISOString(),
      selectedOption: {
        providerCode: "MOCK",
        serviceCode: "MOCK_BIKE",
        quote: { amount: 150, currency: "INR" },
        estimatedDeliveryAt: null,
        availability: { known: true, available: true },
        selectionReason: "Best score",
        cancellationPolicy: { policyKnown: true, supported: true },
      },
    },
  };

  function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  it("returns when GET eventually reports OPTION_READY", async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: {
            ...optionReady,
            status: "ORCHESTRATING",
            orchestration: { ...optionReady.orchestration, selectedOption: null },
          },
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, data: optionReady }));

    const result = await waitForOrchestrationResult("delivery-1", {
      totalMs: 5_000,
      intervalMs: 10,
    });

    expect(result.status).toBe("OPTION_READY");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries GET after transport failure", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: optionReady }));

    const result = await waitForOrchestrationResult("delivery-1", {
      totalMs: 5_000,
      intervalMs: 10,
    });

    expect(result.orchestration.selectedOption?.providerCode).toBe("MOCK");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
