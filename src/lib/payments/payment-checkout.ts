import type { CustomerPaymentDto } from "@/api/payments";
import { isCashfreeCheckoutEnabled } from "@/config/payment-env";

export function requiresCashfreeCheckout(payment: CustomerPaymentDto): boolean {
  if (!isCashfreeCheckoutEnabled()) {
    return false;
  }
  return (
    payment.gateway === "CASHFREE" &&
    payment.status === "PENDING" &&
    Boolean(payment.paymentSessionId)
  );
}
