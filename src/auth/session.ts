import { setAccessTokenGetter, setSessionRefreshCallbacks } from "@/api/client";
import type { AuthTokens } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Session tokens.
 *
 * Access token: short-lived, memory only.
 * Refresh token: memory + sessionStorage until backend supports HttpOnly cookies.
 */

const REFRESH_TOKEN_STORAGE_KEY = "doot.refreshToken";

let accessToken: string | null = null;
let refreshToken: string | null = null;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function readPersistedRefreshToken(): string | null {
  if (!canUseSessionStorage()) return null;
  return window.sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

function persistRefreshToken(token: string | null) {
  if (!canUseSessionStorage()) return;
  if (token) {
    window.sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    return;
  }
  window.sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

/** Restore refresh token from sessionStorage after a full page reload. */
export function hydrateSessionFromStorage() {
  if (refreshToken) return;
  refreshToken = readPersistedRefreshToken();
}

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
  persistRefreshToken(refreshToken);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearSession() {
  accessToken = null;
  refreshToken = null;
  persistRefreshToken(null);
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
