import type { PublicUser } from "@/api/auth";
import { ApiError } from "@/api/errors";
import { clearSession } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

export const CUSTOMER_PORTAL_INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

export function isCustomerPortalUser(user: Pick<PublicUser, "role">): boolean {
  return user.role === "CUSTOMER";
}

export function createCustomerPortalAccessDeniedError(): ApiError {
  return new ApiError({
    status: 401,
    code: "INVALID_CREDENTIALS",
    message: CUSTOMER_PORTAL_INVALID_CREDENTIALS_MESSAGE,
  });
}

/** Clears any partial session and rejects non-customer accounts for the customer app. */
export function rejectNonCustomerForCustomerPortal(
  user: Pick<PublicUser, "role">,
): void {
  if (isCustomerPortalUser(user)) {
    return;
  }

  clearSession();
  useAuthStore.getState().reset();
  throw createCustomerPortalAccessDeniedError();
}
