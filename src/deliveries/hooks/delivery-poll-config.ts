const DEFAULT_DELIVERY_POLL_MS = 30_000;

export function getDeliveryHistoryPollMs(): number {
  const raw = process.env.NEXT_PUBLIC_DELIVERY_POLL_MS;
  if (!raw?.trim()) {
    return DEFAULT_DELIVERY_POLL_MS;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 5_000) {
    return DEFAULT_DELIVERY_POLL_MS;
  }
  return parsed;
}
