import { beforeEach, describe, expect, it, vi } from "vitest";
import { completeGoogleLogin } from "./complete-google-login";

const { googleLoginMock, establishCustomerSessionMock } = vi.hoisted(() => ({
  googleLoginMock: vi.fn(),
  establishCustomerSessionMock: vi.fn(),
}));

vi.mock("@/api/auth", () => ({
  googleLogin: googleLoginMock,
}));

vi.mock("@/auth/establishSession", () => ({
  establishCustomerSession: establishCustomerSessionMock,
}));

describe("completeGoogleLogin", () => {
  beforeEach(() => {
    googleLoginMock.mockReset();
    establishCustomerSessionMock.mockReset();
  });

  it("exchanges the Google credential for a Dutt session", async () => {
    const router = { push: vi.fn(), replace: vi.fn() };
    const onAuthSuccess = vi.fn();
    googleLoginMock.mockResolvedValue({
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "user-1",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "CUSTOMER",
        },
      },
    });

    await completeGoogleLogin("google-id-token", router, "/dashboard", onAuthSuccess);

    expect(googleLoginMock).toHaveBeenCalledWith({
      credential: "google-id-token",
    });
    expect(establishCustomerSessionMock).toHaveBeenCalledWith(
      {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "user-1",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "CUSTOMER",
        },
      },
      {
        id: "user-1",
        name: "Jane Doe",
        email: "jane@example.com",
        role: "CUSTOMER",
      },
    );
    expect(onAuthSuccess).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/dashboard");
  });
});
