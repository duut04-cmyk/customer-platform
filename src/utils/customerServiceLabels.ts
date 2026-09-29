/** Provider-neutral label shown to customers — never expose raw provider codes (e.g. MOCK). */
export const CUSTOMER_STANDARD_DELIVERY_LABEL = "Standard delivery";

/** Customer-facing service name. Keeps provider codes internal only. */
export function toCustomerServiceName(): string {
  return CUSTOMER_STANDARD_DELIVERY_LABEL;
}

/** Customer-facing service type from backend service code without exposing provider identity. */
export function toCustomerServiceType(serviceCode?: string | null): string {
  if (!serviceCode?.trim()) return "Standard";
  const normalized = serviceCode.trim().toUpperCase();
  if (normalized.startsWith("MOCK")) return "Standard";
  return serviceCode.replaceAll("_", " ").trim() || "Standard";
}
