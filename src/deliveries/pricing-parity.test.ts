import { describe, expect, it } from "vitest";
import {
  DOOT_PLATFORM_FEE_PERCENT as BACKEND_PLATFORM_FEE,
  GST_PERCENT as BACKEND_GST,
  calculateCustomerDeliveryPricing,
} from "../../../backend/src/modules/pricing/customer-delivery-pricing.js";
import {
  calculateDeliveryPricing,
  DOOT_PLATFORM_FEE_PERCENT,
  GST_PERCENT,
  deliveryPricingFromQuote,
} from "./pricing";

describe("delivery pricing parity with backend", () => {
  it("uses the same fee and GST constants", () => {
    expect(DOOT_PLATFORM_FEE_PERCENT).toBe(BACKEND_PLATFORM_FEE);
    expect(GST_PERCENT).toBe(BACKEND_GST);
  });

  it("matches backend customer payable for a provider quote", () => {
    const providerQuote = 150;
    const backend = calculateCustomerDeliveryPricing(providerQuote);
    const frontend = calculateDeliveryPricing(providerQuote);
    expect(frontend.total).toBe(backend.customerPayableAmount);
    expect(frontend.platformFeeAmount).toBe(backend.platformFeeAmount);
    expect(frontend.gstAmount).toBe(backend.gstAmount);
  });

  it("prefers server quote payable fields when mapping orchestration", () => {
    const pricing = deliveryPricingFromQuote({
      amount: 150,
      customerPayableAmount: 194.7,
      platformFeeAmount: 15,
      gstAmount: 29.7,
    });
    expect(pricing.total).toBe(194.7);
  });
});
