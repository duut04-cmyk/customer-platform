import { afterEach, describe, expect, it } from "vitest";
import type { CustomerOrchestrationResultDto } from "./delivery.types";
import {
  isOrchestrationBookable,
  isOrchestrationInProgress,
  normalizeOrchestrationResult,
} from "./orchestration-result";

const emptyOptionReady: CustomerOrchestrationResultDto = {
  deliveryId: "d1",
  status: "OPTION_READY",
  orchestration: {
    id: "o1",
    attemptNumber: 1,
    completedAt: null,
    selectedOption: null,
  },
};

describe("orchestration-result", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_DEV_MOCK_ORCHESTRATION;
  });

  it("treats OPTION_READY without option as in progress", () => {
    expect(isOrchestrationBookable(emptyOptionReady)).toBe(false);
    expect(isOrchestrationInProgress(emptyOptionReady)).toBe(true);
  });

  it("injects mock option when dev flag is enabled", () => {
    process.env.NEXT_PUBLIC_DEV_MOCK_ORCHESTRATION = "true";
    const normalized = normalizeOrchestrationResult(emptyOptionReady);
    expect(isOrchestrationBookable(normalized)).toBe(true);
    expect(normalized.orchestration.selectedOption?.providerCode).toBe("MOCK");
  });
});
