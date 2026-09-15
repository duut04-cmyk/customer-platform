import { setAccessTokenGetter, setSessionRefreshCallbacks } from "@/api/client";
import type { AuthTokens } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

/**
 * In-memory session tokens.
 *
 * Access token: short-lived, memory only.
 * Refresh token: memory only until backend supports HttpOnly cookies.
 *
 * Do NOT persist refresh tokens to localStorage/sessionStorage.
 */

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function setSessionTokens(
  tokens: Pick<AuthTokens, "accessToken" | "refreshToken">,
) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearSession() {
  accessToken = null;
  refreshToken = null;
}

setAccessTokenGetter(getAccessToken);

setSessionRefreshCallbacks({
  getRefreshToken,
  setSessionTokens,
  clearSession,
  onAuthFailure: () => {
    useAuthStore.getState().reset();
  },
});
