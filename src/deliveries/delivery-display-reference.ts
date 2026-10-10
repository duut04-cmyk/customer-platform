/** Human-facing delivery id (e.g. DOOT-1039). Falls back to UUID when reference is missing. */
export function getDeliveryDisplayReference(delivery: {
  reference?: string | null;
  id: string;
}): string {
  const ref = delivery.reference?.trim();
  return ref && ref.length > 0 ? ref : delivery.id;
}
