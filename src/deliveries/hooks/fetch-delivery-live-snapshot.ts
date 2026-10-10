import {
  getDelivery,
  getDriver,
  getDeliveryHistory,
  getTracking,
} from "@/api/deliveries/delivery.api";
import { ApiError } from "@/api/errors";
import {
  mapHistoryToDelivery,
  patchDeliveryFromLivePoll,
} from "../map-history-to-delivery";
import type { Delivery } from "../types";

/**
 * Lightweight active-delivery refresh: detail + tracking + driver.
 * Falls back to full history when status changes or a request fails.
 */
export async function fetchDeliveryLiveSnapshot(
  deliveryId: string,
  current: Delivery,
): Promise<Delivery> {
  try {
    const [detailRes, trackingRes, driverResult] = await Promise.all([
      getDelivery(deliveryId),
      getTracking(deliveryId),
      getDriver(deliveryId).catch((error) => {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }),
    ]);

    const { next, statusChanged } = patchDeliveryFromLivePoll(current, {
      backendStatus: detailRes.data.status,
      tracking: trackingRes.data.tracking,
      driverResponse: driverResult?.data ?? null,
    });

    if (statusChanged) {
      const history = await getDeliveryHistory(deliveryId);
      return mapHistoryToDelivery(history.data);
    }

    return next;
  } catch {
    const history = await getDeliveryHistory(deliveryId);
    return mapHistoryToDelivery(history.data);
  }
}
