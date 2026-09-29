"use client";

import { useCallback, useEffect, useState } from "react";
import { listDeliveries } from "@/api/deliveries/delivery.api";
import { ApiError } from "@/api/errors";
import { mapListItemToDelivery } from "../map-history-to-delivery";
import type { Delivery } from "../types";

type UseDeliveriesListResult = {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useDeliveriesList(limit = 50): UseDeliveriesListResult {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      const response = await listDeliveries({ page: 1, limit });
      setDeliveries(response.data.items.map(mapListItemToDelivery));
      setError(null);
    } catch (err) {
      setDeliveries([]);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to load deliveries.",
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchList();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchList]);

  return { deliveries, loading, error, refresh: fetchList };
}
