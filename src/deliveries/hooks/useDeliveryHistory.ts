"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDeliveryHistory } from "@/api/deliveries/delivery.api";
import { ApiError } from "@/api/errors";
import { mapHistoryToDelivery } from "../map-history-to-delivery";
import type { Delivery } from "../types";

const ACTIVE_POLL_MS = 30_000;

type UseDeliveryHistoryResult = {
  delivery: Delivery | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useDeliveryHistory(
  deliveryId: string,
  options?: { pollWhenActive?: boolean },
): UseDeliveryHistoryResult {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDeliveryHistory(deliveryId);
      if (!mountedRef.current) return;
      setDelivery(mapHistoryToDelivery(response.data));
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof ApiError && err.status === 404) {
        setError("Delivery not found.");
      } else {
        setError(
          err instanceof Error ? err.message : "Unable to load delivery details.",
        );
      }
      setDelivery(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    mountedRef.current = true;
    const timer = window.setTimeout(() => {
      void fetchHistory();
    }, 0);
    return () => {
      mountedRef.current = false;
      window.clearTimeout(timer);
    };
  }, [fetchHistory]);

  useEffect(() => {
    if (!options?.pollWhenActive || !delivery) return undefined;

    const backendStatus = delivery.status;
    const shouldPoll =
      backendStatus !== "delivered" &&
      backendStatus !== "cancelled" &&
      backendStatus !== "failed";

    if (!shouldPoll) return undefined;

    const intervalId = window.setInterval(() => {
      void fetchHistory();
    }, ACTIVE_POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [delivery, fetchHistory, options?.pollWhenActive]);

  return {
    delivery,
    loading,
    error,
    refresh: fetchHistory,
  };
}
