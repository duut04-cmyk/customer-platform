import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { clearSession, setAccessToken, setSessionTokens } from "@/auth/session";

vi.mock("@/api/auth", () => ({
  refreshSession: vi.fn(),
}));

import { refreshSession } from "@/api/auth";
import { sameOriginJsonPost } from "./same-origin-client";

describe("sameOriginJsonPost", () => {
  beforeEach(() => {
    clearSession();
    vi.mocked(refreshSession).mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true, data: { ok: true } }),
      }),
    );
  });

  it("refreshes and retries once on 401", async () => {
    setSessionTokens({ accessToken: "expired", refreshToken: "refresh-1" });
    vi.mocked(refreshSession).mockResolvedValue({
      success: true,
      data: { accessToken: "fresh", refreshToken: "refresh-2" },
    } as Awaited<ReturnType<typeof refreshSession>>);

    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: { message: "Unauthorized" } }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true, data: { token: "x" } }),
      } as Response);

    const result = await sameOriginJsonPost<{
      success: boolean;
      data: { token: string };
    }>("/api/package-photos/presign", {
      uploadBatchId: "11111111-1111-4111-8111-111111111111",
      mimeType: "image/jpeg",
      fileSizeBytes: 100,
    });

    expect(result.data.token).toBe("x");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("throws when no session is available", async () => {
    await expect(
      sameOriginJsonPost("/api/package-photos/presign", {}),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("uses existing access token without refresh", async () => {
    setAccessToken("valid-access");
    await sameOriginJsonPost("/api/test", { a: 1 });
    expect(refreshSession).not.toHaveBeenCalled();
  });
});
