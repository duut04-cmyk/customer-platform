import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../client";
import { AUTH_ENDPOINTS } from "./auth.constants";
import {
  forgotPassword,
  getCurrentUser,
  googleLogin,
  login,
  logout,
  refreshSession,
  resendEmailOtp,
  resendPasswordResetOtp,
  resetPassword,
  signup,
  verifyEmailOtp,
  verifyPasswordResetOtp,
} from "./auth.api";

vi.mock("../client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  setAccessTokenGetter: vi.fn(),
  setSessionRefreshCallbacks: vi.fn(),
}));

describe("auth.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signup posts split phone fields to the signup endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Account created.",
    });

    const body = {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "StrongPass1!",
      phoneCountryCode: "+91",
      phoneNumber: "9876543210",
    };

    await signup(body);

    expect(apiClient.post).toHaveBeenCalledWith(AUTH_ENDPOINTS.signup, body, {
      auth: false,
    });
  });

  it("verifyEmailOtp posts email and otp without auth header flag", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Email verified.",
    });

    await verifyEmailOtp({ email: "jane@example.com", otp: "123456" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.verifyOtp,
      { email: "jane@example.com", otp: "123456" },
      { auth: false },
    );
  });

  it("resendEmailOtp uses resend endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ success: true, message: "ok" });
    await resendEmailOtp({ email: "jane@example.com" });
    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.resendOtp,
      { email: "jane@example.com" },
      { auth: false },
    );
  });

  it("login posts credentials to login endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Login successful.",
      data: {
        accessToken: "access",
        refreshToken: "refresh",
        tokenType: "Bearer",
        expiresIn: 900,
        user: {
          id: "1",
          name: "Jane",
          email: "jane@example.com",
          phone: null,
          emailVerified: true,
          role: "CUSTOMER",
        },
      },
    });

    await login({ email: "jane@example.com", password: "StrongPass1!" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.login,
      { email: "jane@example.com", password: "StrongPass1!" },
      { auth: false },
    );
  });

  it("refreshSession posts refresh token in body", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Token refreshed.",
      data: {
        accessToken: "access2",
        refreshToken: "refresh2",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    });

    await refreshSession({ refreshToken: "refresh" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.refresh,
      { refreshToken: "refresh" },
      { auth: false },
    );
  });

  it("getCurrentUser calls me endpoint with default auth", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "1",
          name: "Jane",
          email: "jane@example.com",
          phone: {
            countryCode: "+91",
            number: "9876543210",
            e164: "+919876543210",
          },
          emailVerified: true,
          status: "ACTIVE",
          role: "CUSTOMER",
        },
      },
    });

    await getCurrentUser();

    expect(apiClient.get).toHaveBeenCalledWith(AUTH_ENDPOINTS.me);
  });

  it("logout posts refresh token", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Logged out.",
    });

    await logout({ refreshToken: "refresh" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.logout,
      { refreshToken: "refresh" },
      { auth: false },
    );
  });

  it("googleLogin posts credential", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Login successful.",
      data: {
        accessToken: "access",
        refreshToken: "refresh",
        tokenType: "Bearer",
        expiresIn: 900,
        user: {
          id: "1",
          name: "Jane",
          email: "jane@example.com",
          phone: null,
          emailVerified: true,
          role: "CUSTOMER",
        },
      },
    });

    await googleLogin({ credential: "google-id-token" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.google,
      { credential: "google-id-token" },
      { auth: false },
    );
  });

  it("forgotPassword posts email", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "If an account exists, a code was sent.",
    });

    await forgotPassword({ email: "jane@example.com" });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.forgotPassword,
      { email: "jane@example.com" },
      { auth: false },
    );
  });

  it("verifyPasswordResetOtp returns reset token shape", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      data: {
        resetToken: "reset-token",
        expiresAt: "2026-09-15T10:10:00.000Z",
      },
    });

    const result = await verifyPasswordResetOtp({
      email: "jane@example.com",
      otp: "123456",
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.verifyPasswordResetOtp,
      { email: "jane@example.com", otp: "123456" },
      { auth: false },
    );
    expect(result.data.resetToken).toBe("reset-token");
  });

  it("resendPasswordResetOtp uses resend endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ success: true, message: "ok" });
    await resendPasswordResetOtp({ email: "jane@example.com" });
    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.resendPasswordResetOtp,
      { email: "jane@example.com" },
      { auth: false },
    );
  });

  it("resetPassword posts resetToken and newPassword", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });

    await resetPassword({
      resetToken: "reset-token",
      newPassword: "NewStrongPass1!",
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      AUTH_ENDPOINTS.resetPassword,
      { resetToken: "reset-token", newPassword: "NewStrongPass1!" },
      { auth: false },
    );
  });
});
