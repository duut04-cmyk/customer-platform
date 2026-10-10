const CHECKOUT_DELIVERY_ID_KEY = "doot:checkout-delivery-id";

export function rememberCheckoutDeliveryId(deliveryId: string): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  sessionStorage.setItem(CHECKOUT_DELIVERY_ID_KEY, deliveryId);
}

export function readCheckoutDeliveryId(): string | null {
  if (typeof sessionStorage === "undefined") {
    return null;
  }
  return sessionStorage.getItem(CHECKOUT_DELIVERY_ID_KEY)?.trim() || null;
}

export function clearCheckoutDeliveryId(): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  sessionStorage.removeItem(CHECKOUT_DELIVERY_ID_KEY);
}
