export const DOOT_PLATFORM_FEE_PERCENT = 10;
export const GST_PERCENT = 18;

export type DeliveryPricing = {
  thirdPartyCharge: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
};

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export type CustomerQuoteAmounts = {
  amount: number;
  customerPayableAmount?: number;
  platformFeeAmount?: number;
  gstAmount?: number;
};

/** Prefer server-provided payable breakdown when present; otherwise compute locally. */
export function deliveryPricingFromQuote(quote: CustomerQuoteAmounts): DeliveryPricing {
  const computed = calculateDeliveryPricing(quote.amount);
  if (quote.customerPayableAmount == null) {
    return computed;
  }
  return {
    ...computed,
    platformFeeAmount: quote.platformFeeAmount ?? computed.platformFeeAmount,
    gstAmount: quote.gstAmount ?? computed.gstAmount,
    total: quote.customerPayableAmount,
  };
}

export function calculateDeliveryPricing(thirdPartyCharge: number): DeliveryPricing {
  const platformFeeAmount = roundCurrency(
    thirdPartyCharge * (DOOT_PLATFORM_FEE_PERCENT / 100),
  );
  const subtotal = roundCurrency(thirdPartyCharge + platformFeeAmount);
  const gstAmount = roundCurrency(subtotal * (GST_PERCENT / 100));
  const total = roundCurrency(subtotal + gstAmount);

  return {
    thirdPartyCharge,
    platformFeePercent: DOOT_PLATFORM_FEE_PERCENT,
    platformFeeAmount,
    subtotal,
    gstPercent: GST_PERCENT,
    gstAmount,
    total,
  };
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
