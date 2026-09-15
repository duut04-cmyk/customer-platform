import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_ENDPOINTS } from "@/api/auth/auth.constants";
import {
  apiClient,
  resetRefreshStateForTests,
  setAccessTokenGetter,
  setSessionRefreshCallbacks,
} from "./client";

describe("apiClient refresh", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    resetRefreshStateForTests();
    vi.stubGlobal("fetch", fetchMock);

    let accessToken: string | null = "access-old";
    let refreshToken: string | null = "refresh-old";

    setAccessTokenGetter(() => accessToken);
    setSessionRefreshCallbacks({
      getRefreshToken: () => refreshToken,
      setSessionTokens: (tokens) => {
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
      },
      clearSession: () => {
        accessToken = null;
        refreshToken = null;
      },
      onAuthFailure: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setAccessTokenGetter(null);
    setSessionRefreshCallbacks(null);
  });

  it("uses single-flight refresh for concurrent 401 responses", async () => {
    fetchMock
      .mockResolvedValueOnce(unauthorizedResponse())
      .mockResolvedValueOnce(unauthorizedResponse())
      .mockResolvedValueOnce(refreshSuccessResponse())
      .mockResolvedValueOnce(okJsonResponse({ success: true, data: { ok: 1 } }))
      .mockResolvedValueOnce(okJsonResponse({ success: true, data: { ok: 2 } }));

    const [first, second] = await Promise.all([
      apiClient.get<{ success: true; data: { ok: number } }>("/protected/a"),
      apiClient.get<{ success: true; data: { ok: number } }>("/protected/b"),
    ]);

    expect(first.data.ok).toBe(1);
    expect(second.data.ok).toBe(2);

    const refreshCalls = fetchMock.mock.calls.filter(
      ([url]) => typeof url === "string" && url.endsWith(AUTH_ENDPOINTS.refresh),
    );
    expect(refreshCalls).toHaveLength(1);
  });

  it("retries the original request once after refresh", async () => {
    fetchMock
      .mockResolvedValueOnce(unauthorizedResponse())
      .mockResolvedValueOnce(refreshSuccessResponse())
      .mockResolvedValueOnce(okJsonResponse({ success: true, data: { ok: true } }));

    const result = await apiClient.get<{ success: true; data: { ok: boolean } }>(
      "/protected/resource",
    );

    expect(result.data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("clears session when refresh fails", async () => {
    const onAuthFailure = vi.fn();
    let accessToken: string | null = "access-old";
    let refreshToken: string | null = "refresh-old";

    setSessionRefreshCallbacks({
      getRefreshToken: () => refreshToken,
      setSessionTokens: (tokens) => {
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
      },
      clearSession: () => {
        accessToken = null;
        refreshToken = null;
      },
      onAuthFailure,
    });
    setAccessTokenGetter(() => accessToken);

    fetchMock
      .mockResolvedValueOnce(unauthorizedResponse())
      .mockResolvedValueOnce(unauthorizedResponse());

    await expect(apiClient.get("/protected/resource")).rejects.toMatchObject({
      status: 401,
    });

    expect(onAuthFailure).toHaveBeenCalled();
    expect(refreshToken).toBeNull();
  });
});

function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ success: false, error: { message: "Unauthorized" } }),
    {
      status: 401,
      headers: { "content-type": "application/json" },
    },
  );
}

function refreshSuccessResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      message: "Token refreshed.",
      data: {
        accessToken: "access-new",
        refreshToken: "refresh-new",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
}

function okJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
