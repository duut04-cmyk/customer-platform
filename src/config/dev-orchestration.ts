import type { CustomerOrchestrationResultDto } from "@/api/deliveries/delivery.types";

/** When true in development, inject a MOCK quote if the API returns OPTION_READY without an option. */
export function isDevMockOrchestrationEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return process.env.NEXT_PUBLIC_DEV_MOCK_ORCHESTRATION === "true";
}

export function buildDevMockOrchestrationResult(
  base: CustomerOrchestrationResultDto,
): CustomerOrchestrationResultDto {
  return {
    ...base,
    status: "OPTION_READY",
    orchestration: {
      ...base.orchestration,
      completedAt: base.orchestration.completedAt ?? new Date().toISOString(),
      selectedOption: {
        providerCode: "MOCK",
        serviceCode: "MOCK_BIKE",
        quote: { amount: 150, currency: "INR" },
        estimatedDeliveryAt: null,
        availability: {
          known: true,
          available: true,
          availableDriverCount: 3,
          reason: null,
        },
        selectionReason: "Dev mock quote (NEXT_PUBLIC_DEV_MOCK_ORCHESTRATION)",
        cancellationPolicy: { policyKnown: true, supported: true },
      },
    },
  };
}
