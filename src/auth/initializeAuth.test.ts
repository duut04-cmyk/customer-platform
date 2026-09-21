import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, refreshSession } from "@/api/auth";
import { clearSession, setAccessToken, setSessionTokens } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";
import { initializeAuth, resetAuthInitializationForTests } from "./initializeAuth";

vi.mock("@/api/auth", () => ({
  getCurrentUser: vi.fn(),
  refreshSession: vi.fn(),
}));

function createSessionStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("initializeAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthInitializationForTests();
    clearSession();
    useAuthStore.getState().reset();
    vi.stubGlobal("window", { sessionStorage: createSessionStorageMock() });
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

  it("restores session from sessionStorage after reload", async () => {
    const storage = createSessionStorageMock();
    storage.setItem("doot.refreshToken", "stored-refresh");
    vi.stubGlobal("window", { sessionStorage: storage });
    resetAuthInitializationForTests();

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

    expect(refreshSession).toHaveBeenCalledWith({ refreshToken: "stored-refresh" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(storage.getItem("doot.refreshToken")).toBe("refresh2");
  });
});
