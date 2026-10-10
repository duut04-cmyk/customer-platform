import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/config/env", () => ({
  getApiBaseUrl: () => "http://localhost:5000/api/v1",
}));

import { verifyCustomerBearer } from "./verify-customer-bearer";

describe("verifyCustomerBearer", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            user: {
              id: "customer-uuid-1",
              role: "CUSTOMER",
            },
          },
        }),
      }),
    );
  });

  it("returns customer id from data.user (backend /auth/me shape)", async () => {
    const id = await verifyCustomerBearer("Bearer valid-token");
    expect(id).toBe("customer-uuid-1");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/v1/auth/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer valid-token" },
      }),
    );
  });

  it("returns null when Authorization header is missing", async () => {
    await expect(verifyCustomerBearer(null)).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns null when role is not CUSTOMER", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { user: { id: "admin-1", role: "ADMIN" } },
      }),
    } as Response);

    await expect(verifyCustomerBearer("Bearer t")).resolves.toBeNull();
  });

  it("returns null when /auth/me is unauthorized", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response);

    await expect(verifyCustomerBearer("Bearer bad")).resolves.toBeNull();
  });

  it("returns null for legacy flat data.id shape (wrong nesting)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: "flat-id", role: "CUSTOMER" },
      }),
    } as Response);

    await expect(verifyCustomerBearer("Bearer t")).resolves.toBeNull();
  });
});
