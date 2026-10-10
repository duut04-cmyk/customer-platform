import { describe, expect, it } from "vitest";
import { calculateDeliveryPricing } from "@/deliveries/pricing";
import type { CustomerPaymentDto } from "@/api/payments";

/** Checkout should charge the same total shown in the order summary. */
export function assertPaymentMatchesDisplayedTotal(
  payment: Pick<CustomerPaymentDto, "amount">,
  providerQuote: number,
): void {
  const displayed = calculateDeliveryPricing(providerQuote).total;
  expect(payment.amount).toBe(displayed);
}

describe("payment-pricing-alignment", () => {
  it("expects Cashfree order amount to match UI total for a ₹150 provider quote", () => {
    assertPaymentMatchesDisplayedTotal({ amount: 194.7 }, 150);
  });
});
