import { CREATE_DELIVERY_PATH } from "./paths";

export type CreateDeliveryUrlPhase = "quote" | "booking" | "confirmed";

export function buildCreateDeliveryHref(input?: {
  deliveryId?: string | null;
  phase?: CreateDeliveryUrlPhase | null;
}): string {
  if (!input?.deliveryId) {
    return CREATE_DELIVERY_PATH;
  }
  const params = new URLSearchParams();
  params.set("deliveryId", input.deliveryId);
  if (input.phase && input.phase !== "quote") {
    params.set("phase", input.phase);
  }
  return `${CREATE_DELIVERY_PATH}?${params.toString()}`;
}

export function parseCreateDeliverySearchParams(searchParams: URLSearchParams): {
  deliveryId: string | null;
  phase: CreateDeliveryUrlPhase | null;
} {
  const deliveryId = searchParams.get("deliveryId")?.trim() || null;
  const rawPhase = searchParams.get("phase")?.trim();
  const phase =
    rawPhase === "booking" || rawPhase === "confirmed" || rawPhase === "quote"
      ? rawPhase
      : null;
  return { deliveryId, phase };
}
