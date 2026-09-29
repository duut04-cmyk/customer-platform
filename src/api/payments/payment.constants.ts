export const PAYMENT_ENDPOINTS = {
  forDelivery: (deliveryId: string) => `/deliveries/${deliveryId}/payment`,
} as const;
