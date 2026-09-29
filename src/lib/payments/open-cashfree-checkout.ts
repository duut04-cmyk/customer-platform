import { load } from "@cashfreepayments/cashfree-js";
import { getCashfreeCheckoutMode } from "@/config/payment-env";
import { ApiError } from "@/api/errors";

/**
 * Opens Cashfree hosted checkout. Resolves when the checkout UI closes;
 * payment success must be verified via GET payment (webhook/poll).
 */
export async function openCashfreeCheckout(paymentSessionId: string): Promise<void> {
  if (!paymentSessionId.trim()) {
    throw new ApiError({
      status: 422,
      message: "Payment session is missing.",
      code: "PAYMENT_SESSION_MISSING",
    });
  }

  const mode = getCashfreeCheckoutMode();
  const cashfree = await load({ mode });

  try {
    await cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_modal",
    });
  } catch (error) {
    throw new ApiError({
      status: 0,
      message:
        error instanceof Error ? error.message : "Could not open Cashfree checkout.",
      code: "CASHFREE_CHECKOUT_FAILED",
    });
  }
}
