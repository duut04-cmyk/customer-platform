import { refreshSession } from "@/api/auth";
import { ApiError, normalizeApiError } from "@/api/errors";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

function handleAuthFailure() {
  clearSession();
  useAuthStore.getState().reset();
}

async function refreshTokensOnce(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    handleAuthFailure();
    return false;
  }

  try {
    const response = await refreshSession({ refreshToken });
    setSessionTokens(response.data);
    return Boolean(getAccessToken());
  } catch {
    handleAuthFailure();
    return false;
  }
}

async function ensureAccessToken(): Promise<string> {
  const existing = getAccessToken();
  if (existing) {
    return existing;
  }
  const refreshed = await refreshTokensOnce();
  if (!refreshed) {
    throw new ApiError({
      status: 401,
      message: "Sign in to continue.",
      code: "UNAUTHORIZED",
    });
  }
  const token = getAccessToken();
  if (!token) {
    throw new ApiError({
      status: 401,
      message: "Sign in to continue.",
      code: "UNAUTHORIZED",
    });
  }
  return token;
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError({
      status: response.status,
      message: "Server returned invalid JSON.",
    });
  }
}

/** Authenticated POST to this Next.js app (e.g. /api/*) with refresh on 401. */
export async function sameOriginJsonPost<T>(
  path: string,
  body: unknown,
  options: { _retry?: boolean } = {},
): Promise<T> {
  const token = await ensureAccessToken();

  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError({
      status: 0,
      message: "Network request failed.",
      code: "NETWORK_ERROR",
    });
  }

  const parsedBody = await parseJsonBody(response);

  if (response.status === 401 && !options._retry) {
    const refreshed = await refreshTokensOnce();
    if (refreshed) {
      return sameOriginJsonPost<T>(path, body, { _retry: true });
    }
  }

  if (!response.ok) {
    throw normalizeApiError(
      response.status,
      parsedBody,
      `Request failed with status ${response.status}.`,
    );
  }

  return parsedBody as T;
}

/** Authenticated multipart POST to this Next.js app with refresh on 401. */
export async function sameOriginFormPost<T>(
  path: string,
  formData: FormData,
  options: { _retry?: boolean } = {},
): Promise<T> {
  const token = await ensureAccessToken();

  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    throw new ApiError({
      status: 0,
      message: "Network request failed. Check your connection and try again.",
      code: "NETWORK_ERROR",
    });
  }

  const parsedBody = await parseJsonBody(response);

  if (response.status === 401 && !options._retry) {
    const refreshed = await refreshTokensOnce();
    if (refreshed) {
      return sameOriginFormPost<T>(path, formData, { _retry: true });
    }
  }

  if (!response.ok) {
    throw normalizeApiError(
      response.status,
      parsedBody,
      `Request failed with status ${response.status}.`,
    );
  }

  return parsedBody as T;
}
