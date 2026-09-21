import { getApiBaseUrl } from "@/config/env";
import { AUTH_ENDPOINTS } from "@/api/auth/auth.constants";
import { ApiError, normalizeApiError } from "./errors";

export type ApiClientRequestOptions = {
  headers?: Record<string, string>;
  /** When false, skip Authorization header even if a token is available. */
  auth?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Internal: prevents infinite retry loops. */
  _retry?: boolean;
};

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestContext = ApiClientRequestOptions & {
  method: HttpMethod;
  path: string;
  body?: unknown;
};

const DEFAULT_TIMEOUT_MS = 30_000;

let accessTokenGetter: (() => string | null) | null = null;

type SessionRefreshCallbacks = {
  getRefreshToken: () => string | null;
  setSessionTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
  onAuthFailure: () => void;
};

let sessionCallbacks: SessionRefreshCallbacks | null = null;
let refreshInFlight: Promise<boolean> | null = null;

/** Register a getter for the short-lived access token (in-memory session layer). */
export function setAccessTokenGetter(getter: (() => string | null) | null) {
  accessTokenGetter = getter;
}

/** Register session callbacks used for token refresh without circular imports. */
export function setSessionRefreshCallbacks(callbacks: SessionRefreshCallbacks | null) {
  sessionCallbacks = callbacks;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function mergeAbortSignals(signals: AbortSignal[]): AbortSignal {
  if (signals.length === 1) {
    return signals[0]!;
  }
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new ApiError({
        status: response.status,
        message: "Server returned invalid JSON.",
      });
    }
  }

  return text;
}

function handleAuthFailure() {
  sessionCallbacks?.clearSession();
  sessionCallbacks?.onAuthFailure();
}

async function refreshAccessTokenOnce(): Promise<boolean> {
  if (!sessionCallbacks) {
    return false;
  }

  const refreshToken = sessionCallbacks.getRefreshToken();
  if (!refreshToken) {
    handleAuthFailure();
    return false;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(AUTH_ENDPOINTS.refresh), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });
  } catch {
    handleAuthFailure();
    return false;
  }

  const parsedBody = await parseResponseBody(response);

  if (!response.ok) {
    handleAuthFailure();
    return false;
  }

  const data = parsedBody as {
    data?: { accessToken?: string; refreshToken?: string };
  };

  const accessToken = data.data?.accessToken;
  const nextRefreshToken = data.data?.refreshToken;

  if (!accessToken || !nextRefreshToken) {
    handleAuthFailure();
    return false;
  }

  sessionCallbacks.setSessionTokens({
    accessToken,
    refreshToken: nextRefreshToken,
  });

  return true;
}

function singleFlightRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessTokenOnce().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function request<T>(context: RequestContext): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...context.headers,
  };

  const useAuth = context.auth !== false;
  if (useAuth && accessTokenGetter) {
    const token = accessTokenGetter();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let body: BodyInit | undefined;
  if (context.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(context.body);
  }

  const timeoutMs = context.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new DOMException("Request timed out.", "TimeoutError"));
  }, timeoutMs);

  const signals = [timeoutController.signal];
  if (context.signal) {
    signals.push(context.signal);
  }
  const signal = mergeAbortSignals(signals);

  let response: Response;
  try {
    response = await fetch(buildUrl(context.path), {
      method: context.method,
      headers,
      body,
      credentials: "include",
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        status: 0,
        message:
          error.message === "Request timed out."
            ? "Request timed out."
            : "Request was cancelled.",
        code: "REQUEST_ABORTED",
      });
    }
    throw new ApiError({
      status: 0,
      message: "Network request failed.",
      code: "NETWORK_ERROR",
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const parsedBody = await parseResponseBody(response);

  const canAttemptRefresh =
    response.status === 401 &&
    useAuth &&
    !context._retry &&
    context.path !== AUTH_ENDPOINTS.refresh &&
    context.path !== AUTH_ENDPOINTS.login &&
    context.path !== AUTH_ENDPOINTS.logout;

  if (canAttemptRefresh) {
    const refreshed = await singleFlightRefresh();
    if (refreshed) {
      return request<T>({ ...context, _retry: true });
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

export const apiClient = {
  get<T>(path: string, options?: ApiClientRequestOptions) {
    return request<T>({ ...options, method: "GET", path });
  },
  post<T>(path: string, body?: unknown, options?: ApiClientRequestOptions) {
    return request<T>({ ...options, method: "POST", path, body });
  },
  patch<T>(path: string, body?: unknown, options?: ApiClientRequestOptions) {
    return request<T>({ ...options, method: "PATCH", path, body });
  },
  put<T>(path: string, body?: unknown, options?: ApiClientRequestOptions) {
    return request<T>({ ...options, method: "PUT", path, body });
  },
  delete<T>(path: string, options?: ApiClientRequestOptions) {
    return request<T>({ ...options, method: "DELETE", path });
  },
};

/** Test helper — resets single-flight refresh state. */
export function resetRefreshStateForTests() {
  refreshInFlight = null;
}
