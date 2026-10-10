import { describe, expect, it } from "vitest";
import {
  calculateDeliveryPricing,
  DOOT_PLATFORM_FEE_PERCENT,
  GST_PERCENT,
  deliveryPricingFromQuote,
} from "./pricing";

/** Golden totals for provider quote ₹150 (must match backend customer-delivery-pricing). */
const GOLDEN_PROVIDER_QUOTE = 150;
const GOLDEN_PLATFORM_FEE = 15;
const GOLDEN_GST = 29.7;
const GOLDEN_CUSTOMER_PAYABLE = 194.7;

describe("delivery pricing parity with backend", () => {
  it("uses the documented fee and GST constants", () => {
    expect(DOOT_PLATFORM_FEE_PERCENT).toBe(10);
    expect(GST_PERCENT).toBe(18);
  });

  it("matches backend customer payable for a provider quote", () => {
    const frontend = calculateDeliveryPricing(GOLDEN_PROVIDER_QUOTE);
    expect(frontend.total).toBe(GOLDEN_CUSTOMER_PAYABLE);
    expect(frontend.platformFeeAmount).toBe(GOLDEN_PLATFORM_FEE);
    expect(frontend.gstAmount).toBe(GOLDEN_GST);
  });

  it("prefers server quote payable fields when mapping orchestration", () => {
    const pricing = deliveryPricingFromQuote({
      amount: GOLDEN_PROVIDER_QUOTE,
      customerPayableAmount: GOLDEN_CUSTOMER_PAYABLE,
      platformFeeAmount: GOLDEN_PLATFORM_FEE,
      gstAmount: GOLDEN_GST,
    });
    expect(pricing.total).toBe(GOLDEN_CUSTOMER_PAYABLE);
  });
});
