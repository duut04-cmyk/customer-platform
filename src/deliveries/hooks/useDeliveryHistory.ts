"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDeliveryHistory } from "@/api/deliveries/delivery.api";
import { ApiError } from "@/api/errors";
import { mapHistoryToDelivery } from "../map-history-to-delivery";
import type { Delivery } from "../types";
import { getDeliveryHistoryPollMs } from "./delivery-poll-config";
import { fetchDeliveryLiveSnapshot } from "./fetch-delivery-live-snapshot";

type UseDeliveryHistoryResult = {
  delivery: Delivery | null;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

type FetchMode = "initial" | "background";

type FetchOptions = {
  forceFull?: boolean;
};

export function useDeliveryHistory(
  deliveryId: string,
  options?: { pollWhenActive?: boolean },
): UseDeliveryHistoryResult {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const isInitialLoadRef = useRef(true);
  const deliveryRef = useRef<Delivery | null>(null);

  useEffect(() => {
    deliveryRef.current = delivery;
  }, [delivery]);

  const fetchHistory = useCallback(
    async (mode: FetchMode = "background", fetchOptions?: FetchOptions) => {
      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const useLiveSnapshot =
          mode === "background" &&
          !fetchOptions?.forceFull &&
          deliveryRef.current != null;

        if (useLiveSnapshot && deliveryRef.current) {
          const updated = await fetchDeliveryLiveSnapshot(
            deliveryId,
            deliveryRef.current,
          );
          if (!mountedRef.current) return;
          setDelivery(updated);
          setError(null);
        } else {
          const response = await getDeliveryHistory(deliveryId);
          if (!mountedRef.current) return;
          setDelivery(mapHistoryToDelivery(response.data));
          setError(null);
        }
      } catch (err) {
        if (!mountedRef.current) return;
        if (mode === "initial") {
          if (err instanceof ApiError && err.status === 404) {
            setError("Delivery not found.");
          } else {
            setError(
              err instanceof Error ? err.message : "Unable to load delivery details.",
            );
          }
          setDelivery(null);
        }
      } finally {
        if (!mountedRef.current) return;
        if (mode === "initial") {
          setLoading(false);
          isInitialLoadRef.current = false;
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [deliveryId],
  );

  useEffect(() => {
    mountedRef.current = true;
    isInitialLoadRef.current = true;
    const timer = window.setTimeout(() => {
      void fetchHistory("initial");
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
      if (isInitialLoadRef.current) return;
      void fetchHistory("background");
    }, getDeliveryHistoryPollMs());

    return () => window.clearInterval(intervalId);
  }, [delivery, fetchHistory, options?.pollWhenActive]);

  const refresh = useCallback(async () => {
    await fetchHistory(isInitialLoadRef.current ? "initial" : "background", {
      forceFull: true,
    });
  }, [fetchHistory]);

  return {
    delivery,
    loading,
    isRefreshing,
    error,
    refresh,
  };
}
