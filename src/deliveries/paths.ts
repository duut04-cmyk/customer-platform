export const DELIVERIES_PATH = "/deliveries";

export function deliveryRoutePath(id: string) {
  return `/deliveries/${id}`;
}

export function deliveryTrackingPath(id: string) {
  return `/deliveries/${id}/tracking`;
}
