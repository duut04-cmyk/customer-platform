import { beforeEach, describe, expect, it, vi } from "vitest";
import { logout } from "@/api/auth";
import { clearSession, getRefreshToken, setSessionTokens } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";
import { performLogout } from "./logout";

vi.mock("@/api/auth", () => ({
  logout: vi.fn(),
}));

describe("performLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().reset();
    clearSession();
  });

  it("calls backend logout and clears local session", async () => {
    setSessionTokens({ accessToken: "access", refreshToken: "refresh" });
    useAuthStore.getState().setUser({
      id: "1",
      name: "Jane",
      email: "jane@example.com",
      phone: null,
      emailVerified: true,
      role: "CUSTOMER",
    });

    vi.mocked(logout).mockResolvedValue({
      success: true,
      message: "Logged out.",
    });

    const router = { replace: vi.fn() };
    await performLogout(router);

    expect(logout).toHaveBeenCalledWith({ refreshToken: "refresh" });
    expect(getRefreshToken()).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(router.replace).toHaveBeenCalledWith("/");
  });

  it("clears local session even when backend logout fails", async () => {
    setSessionTokens({ accessToken: "access", refreshToken: "refresh" });
    useAuthStore.getState().setUser({
      id: "1",
      name: "Jane",
      email: "jane@example.com",
      phone: null,
      emailVerified: true,
      role: "CUSTOMER",
    });

    vi.mocked(logout).mockRejectedValue(new Error("network"));

    await performLogout();

    expect(getRefreshToken()).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
