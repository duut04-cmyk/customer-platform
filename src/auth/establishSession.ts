import type { AuthTokens, PublicUser } from "@/api/auth";
import { setSessionTokens } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

export function establishSession(
  tokens: Pick<AuthTokens, "accessToken" | "refreshToken">,
  user: PublicUser,
) {
  setSessionTokens(tokens);
  useAuthStore.getState().setUser(user);
}
