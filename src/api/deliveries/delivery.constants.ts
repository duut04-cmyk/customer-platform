export const DELIVERY_ENDPOINTS = {
  list: "/deliveries",
  create: "/deliveries",
  byId: (id: string) => `/deliveries/${id}`,
  history: (id: string) => `/deliveries/${id}/history`,
  orchestrate: (id: string) => `/deliveries/${id}/orchestrate`,
  orchestration: (id: string) => `/deliveries/${id}/orchestration`,
  confirm: (id: string) => `/deliveries/${id}/confirm`,
  booking: (id: string) => `/deliveries/${id}/booking`,
  driver: (id: string) => `/deliveries/${id}/driver`,
  tracking: (id: string) => `/deliveries/${id}/tracking`,
  trackingHistory: (id: string) => `/deliveries/${id}/tracking/history`,
  pickupOtp: (id: string) => `/deliveries/${id}/pickup-otp`,
  verifyPickupOtp: (id: string) => `/deliveries/${id}/pickup/verify-otp`,
  deliveryOtp: (id: string) => `/deliveries/${id}/delivery-otp`,
  verifyDeliveryOtp: (id: string) => `/deliveries/${id}/delivery/verify-otp`,
  rating: (id: string) => `/deliveries/${id}/rating`,
  feedback: (id: string) => `/deliveries/${id}/feedback`,
  cancel: (id: string) => `/deliveries/${id}/cancel`,
  cancellation: (id: string) => `/deliveries/${id}/cancellation`,
} as const;

export const IDEMPOTENCY_HEADER = "Idempotency-Key";
