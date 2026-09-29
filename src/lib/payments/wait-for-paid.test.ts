import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

vi.mock("@/api/payments", () => ({
  getPaymentForDelivery: vi.fn(),
}));

import { getPaymentForDelivery } from "@/api/payments";
import { waitForPaymentPaid } from "./wait-for-paid";

describe("waitForPaymentPaid", () => {
  beforeEach(() => {
    vi.mocked(getPaymentForDelivery).mockReset();
  });

  it("resolves when payment becomes PAID", async () => {
    vi.mocked(getPaymentForDelivery)
      .mockResolvedValueOnce({
        success: true,
        data: {
          payment: {
            id: "p1",
            deliveryId: "d1",
            amount: 10,
            currency: "INR",
            status: "PENDING",
            gateway: "CASHFREE",
            gatewayOrderId: "o1",
            paymentSessionId: "s1",
            paidAt: null,
            refundedAmount: 0,
            latestAttempt: null,
          },
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          payment: {
            id: "p1",
            deliveryId: "d1",
            amount: 10,
            currency: "INR",
            status: "PAID",
            gateway: "CASHFREE",
            gatewayOrderId: "o1",
            paymentSessionId: "s1",
            paidAt: "2026-01-01T00:00:00.000Z",
            refundedAmount: 0,
            latestAttempt: null,
          },
        },
      });

    const paid = await waitForPaymentPaid("d1", { intervalMs: 1, timeoutMs: 5000 });
    expect(paid.status).toBe("PAID");
  });

  it("throws on FAILED status", async () => {
    vi.mocked(getPaymentForDelivery).mockResolvedValue({
      success: true,
      data: {
        payment: {
          id: "p1",
          deliveryId: "d1",
          amount: 10,
          currency: "INR",
          status: "FAILED",
          gateway: "CASHFREE",
          gatewayOrderId: "o1",
          paymentSessionId: "s1",
          paidAt: null,
          refundedAmount: 0,
          latestAttempt: null,
        },
      },
    });

    await expect(
      waitForPaymentPaid("d1", { intervalMs: 1, timeoutMs: 100 }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
