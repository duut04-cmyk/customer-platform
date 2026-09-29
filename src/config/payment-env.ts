export type CashfreeCheckoutMode = "sandbox" | "production";

export function isCashfreeCheckoutEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_ENABLED === "true";
}

export function getCashfreeCheckoutMode(): CashfreeCheckoutMode {
  const raw = process.env.NEXT_PUBLIC_CASHFREE_CHECKOUT_MODE?.trim().toLowerCase();
  if (raw === "production") {
    return "production";
  }
  return "sandbox";
}
