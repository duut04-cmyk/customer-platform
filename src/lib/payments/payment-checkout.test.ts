import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { CustomerPaymentDto } from "@/api/payments";
import { requiresCashfreeCheckout } from "./payment-checkout";

function basePayment(overrides: Partial<CustomerPaymentDto> = {}): CustomerPaymentDto {
  return {
    id: "pay-1",
    deliveryId: "del-1",
    amount: 100,
    currency: "INR",
    status: "PENDING",
    gateway: "CASHFREE",
    gatewayOrderId: "DOOT-1",
    paymentSessionId: "sess-1",
    paidAt: null,
    refundedAmount: 0,
    latestAttempt: null,
    ...overrides,
  };
}

describe("requiresCashfreeCheckout", () => {
  const original = process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_ENABLED;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_ENABLED = "true";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_ENABLED = original;
  });

  it("returns true for pending Cashfree payment with session", () => {
    expect(requiresCashfreeCheckout(basePayment())).toBe(true);
  });

  it("returns false when checkout flag disabled", () => {
    process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_ENABLED = "false";
    expect(requiresCashfreeCheckout(basePayment())).toBe(false);
  });

  it("returns false for STUB gateway", () => {
    expect(requiresCashfreeCheckout(basePayment({ gateway: "STUB" }))).toBe(false);
  });
});
