import type { AuthTokens, PublicUser } from "@/api/auth";
import { rejectNonCustomerForCustomerPortal } from "@/auth/customer-portal-auth";
import { setSessionTokens } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

export function establishSession(
  tokens: Pick<AuthTokens, "accessToken" | "refreshToken">,
  user: PublicUser,
) {
  setSessionTokens(tokens);
  useAuthStore.getState().setUser(user);
}

/** Customer platform login — admin accounts are rejected with generic invalid credentials. */
export function establishCustomerSession(
  tokens: Pick<AuthTokens, "accessToken" | "refreshToken">,
  user: PublicUser,
) {
  rejectNonCustomerForCustomerPortal(user);
  establishSession(tokens, user);
}
