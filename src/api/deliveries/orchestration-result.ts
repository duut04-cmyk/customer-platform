import {
  buildDevMockOrchestrationResult,
  isDevMockOrchestrationEnabled,
} from "@/config/dev-orchestration";
import type { CustomerOrchestrationResultDto } from "./delivery.types";

export const NO_ELIGIBLE_PROVIDERS_MESSAGE =
  "No eligible delivery providers were found for this route. Try adjusting your package or timing.";

export const NO_SELECTED_OPTION_MESSAGE =
  "No delivery option is available yet. Please try again in a moment or go back and review your details.";

export function isOrchestrationBookable(
  result: CustomerOrchestrationResultDto,
): boolean {
  return (
    result.status === "OPTION_READY" && result.orchestration.selectedOption != null
  );
}

export function isOrchestrationInProgress(
  result: CustomerOrchestrationResultDto,
): boolean {
  if (isOrchestrationBookable(result)) {
    return false;
  }
  if (result.status === "FAILED") {
    return false;
  }
  return (
    result.status === "CREATED" ||
    result.status === "ORCHESTRATING" ||
    (result.status === "OPTION_READY" && !result.orchestration.selectedOption)
  );
}

export function normalizeOrchestrationResult(
  result: CustomerOrchestrationResultDto,
): CustomerOrchestrationResultDto {
  if (isOrchestrationBookable(result)) {
    return result;
  }
  if (
    isDevMockOrchestrationEnabled() &&
    (result.status === "OPTION_READY" || result.status === "ORCHESTRATING")
  ) {
    return buildDevMockOrchestrationResult(result);
  }
  return result;
}

export function assertBookableOrchestrationResult(
  result: CustomerOrchestrationResultDto,
): CustomerOrchestrationResultDto {
  const normalized = normalizeOrchestrationResult(result);

  if (normalized.status === "FAILED") {
    throw new Error(NO_ELIGIBLE_PROVIDERS_MESSAGE);
  }

  if (!isOrchestrationBookable(normalized)) {
    if (isOrchestrationInProgress(normalized)) {
      throw new Error(NO_SELECTED_OPTION_MESSAGE);
    }
    throw new Error(NO_SELECTED_OPTION_MESSAGE);
  }

  return normalized;
}
