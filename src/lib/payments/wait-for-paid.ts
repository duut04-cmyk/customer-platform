import { getPaymentForDelivery } from "@/api/payments";
import type { CustomerPaymentDto } from "@/api/payments";
import { ApiError } from "@/api/errors";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export type WaitForPaidOptions = {
  timeoutMs?: number;
  intervalMs?: number;
  signal?: AbortSignal;
};

export async function waitForPaymentPaid(
  deliveryId: string,
  options: WaitForPaidOptions = {},
): Promise<CustomerPaymentDto> {
  const timeoutMs = options.timeoutMs ?? 180_000;
  const intervalMs = options.intervalMs ?? 2_500;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (options.signal?.aborted) {
      throw new ApiError({
        status: 0,
        message: "Payment verification was cancelled.",
        code: "PAYMENT_VERIFICATION_ABORTED",
      });
    }

    const response = await getPaymentForDelivery(deliveryId);
    const payment = response.data.payment;

    if (payment.status === "PAID") {
      return payment;
    }
    if (payment.status === "FAILED") {
      throw new ApiError({
        status: 422,
        message: "Payment failed. Please try again or use another method.",
        code: "PAYMENT_FAILED",
      });
    }

    await sleep(intervalMs);
  }

  throw new ApiError({
    status: 408,
    message:
      "Payment is still processing. If you completed payment, refresh this page or check your delivery shortly.",
    code: "PAYMENT_VERIFICATION_TIMEOUT",
  });
}
