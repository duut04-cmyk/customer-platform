import { confirmDelivery } from "@/api/deliveries";
import { createPaymentForDelivery } from "@/api/payments";
import { ApiError } from "@/api/errors";
import { isCashfreeCheckoutEnabled } from "@/config/payment-env";
import { rememberCheckoutDeliveryId } from "./checkout-delivery-id";
import { openCashfreeCheckout } from "./open-cashfree-checkout";
import { requiresCashfreeCheckout } from "./payment-checkout";
import { waitForPaymentPaid } from "./wait-for-paid";

export type BookingPaymentPhase =
  "creating_payment" | "opening_checkout" | "awaiting_payment" | "confirming_booking";

export async function completeBookingWithPayment(input: {
  deliveryId: string;
  onPhase?: (phase: BookingPaymentPhase) => void;
  paymentIdempotencyKey?: string;
  confirmIdempotencyKey?: string;
}): Promise<{ deliveryReference?: string }> {
  const paymentKey = input.paymentIdempotencyKey ?? crypto.randomUUID();
  const confirmKey = input.confirmIdempotencyKey ?? crypto.randomUUID();

  input.onPhase?.("creating_payment");
  const paymentResponse = await createPaymentForDelivery(input.deliveryId, paymentKey);
  const payment = paymentResponse.data.payment;

  if (requiresCashfreeCheckout(payment)) {
    rememberCheckoutDeliveryId(input.deliveryId);
    input.onPhase?.("opening_checkout");
    await openCashfreeCheckout(payment.paymentSessionId!);
    input.onPhase?.("awaiting_payment");
    await waitForPaymentPaid(input.deliveryId);
  } else if (payment.gateway === "CASHFREE" && payment.status !== "PAID") {
    if (isCashfreeCheckoutEnabled() && !payment.paymentSessionId) {
      throw new ApiError({
        status: 502,
        message: "Cashfree checkout session was not returned by the server.",
        code: "PAYMENT_SESSION_MISSING",
      });
    }
  }

  input.onPhase?.("confirming_booking");
  const confirmed = await confirmDelivery(input.deliveryId, confirmKey);
  return { deliveryReference: confirmed.data.delivery.reference };
}
