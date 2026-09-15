import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, refreshSession } from "@/api/auth";
import { clearSession, setAccessToken, setSessionTokens } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";
import { initializeAuth, resetAuthInitializationForTests } from "./initializeAuth";

vi.mock("@/api/auth", () => ({
  getCurrentUser: vi.fn(),
  refreshSession: vi.fn(),
}));

describe("initializeAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthInitializationForTests();
    clearSession();
    useAuthStore.getState().reset();
  });

  it("loads authenticated user through /me when access token exists", async () => {
    setSessionTokens({ accessToken: "access", refreshToken: "refresh" });
    vi.mocked(getCurrentUser).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "1",
          name: "Jane",
          email: "jane@example.com",
          phone: null,
          emailVerified: true,
          status: "ACTIVE",
          role: "CUSTOMER",
        },
      },
    });

    await initializeAuth();

    expect(getCurrentUser).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });

  it("refreshes then loads user when only refresh token exists", async () => {
    setSessionTokens({ accessToken: "access", refreshToken: "refresh" });
    setAccessToken(null);
    vi.mocked(refreshSession).mockResolvedValue({
      success: true,
      message: "ok",
      data: {
        accessToken: "access2",
        refreshToken: "refresh2",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    });
    vi.mocked(getCurrentUser).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "1",
          name: "Jane",
          email: "jane@example.com",
          phone: null,
          emailVerified: true,
          status: "ACTIVE",
          role: "CUSTOMER",
        },
      },
    });

    await initializeAuth();

    expect(refreshSession).toHaveBeenCalledWith({ refreshToken: "refresh" });
    expect(getCurrentUser).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("clears state when no session exists", async () => {
    await initializeAuth();

    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });
});
