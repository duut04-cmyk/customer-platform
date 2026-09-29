import type { ApiSuccess } from "@/api/deliveries/delivery.types";

export type PaymentGatewayCode = "STUB" | "CASHFREE";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export type CustomerPaymentDto = {
  id: string;
  deliveryId: string;
  amount: number;
  currency: "INR";
  status: PaymentStatus;
  gateway: PaymentGatewayCode;
  gatewayOrderId: string | null;
  paymentSessionId: string | null;
  paidAt: string | null;
  refundedAmount: number;
  latestAttempt: {
    id: string;
    attemptNumber: number;
    status: string;
    startedAt: string | null;
  } | null;
};

export type PaymentCreateResponse = ApiSuccess<{
  payment: CustomerPaymentDto;
}>;

export type PaymentGetResponse = ApiSuccess<{
  payment: CustomerPaymentDto;
}>;
