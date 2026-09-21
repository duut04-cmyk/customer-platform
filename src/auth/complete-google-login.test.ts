import { beforeEach, describe, expect, it, vi } from "vitest";
import { completeGoogleLogin } from "./complete-google-login";

const { googleLoginMock, establishSessionMock } = vi.hoisted(() => ({
  googleLoginMock: vi.fn(),
  establishSessionMock: vi.fn(),
}));

vi.mock("@/api/auth", () => ({
  googleLogin: googleLoginMock,
}));

vi.mock("@/auth/establishSession", () => ({
  establishSession: establishSessionMock,
}));

describe("completeGoogleLogin", () => {
  beforeEach(() => {
    googleLoginMock.mockReset();
    establishSessionMock.mockReset();
  });

  it("exchanges the Google credential for a Dutt session", async () => {
    const router = { push: vi.fn() };
    googleLoginMock.mockResolvedValue({
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "user-1",
          name: "Jane Doe",
          email: "jane@example.com",
        },
      },
    });

    await completeGoogleLogin("google-id-token", router, "/dashboard");

    expect(googleLoginMock).toHaveBeenCalledWith({
      credential: "google-id-token",
    });
    expect(establishSessionMock).toHaveBeenCalledWith(
      {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "user-1",
          name: "Jane Doe",
          email: "jane@example.com",
        },
      },
      {
        id: "user-1",
        name: "Jane Doe",
        email: "jane@example.com",
      },
    );
    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});
