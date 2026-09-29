"use client";

import { useCallback, useState } from "react";
import {
  cancelDelivery,
  submitFeedback,
  submitRating,
} from "@/api/deliveries/delivery.api";
import { mapCancelReasonToBackend } from "@/api/deliveries/cancel-reasons";
import { ApiError } from "@/api/errors";
import type { CancelDeliveryReason } from "@/deliveries/customerCopy";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import type { Delivery } from "../types";
import TrackingCancelledView from "./components/TrackingCancelledView";
import TrackingCompletedView from "./components/TrackingCompletedView";
import TrackingFailedView from "./components/TrackingFailedView";
import TrackingInProgressView from "./components/TrackingInProgressView";

type TrackingPageProps = {
  delivery: Delivery;
  onRefresh: () => Promise<void>;
};

export default function TrackingPage({ delivery, onRefresh }: TrackingPageProps) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancel = useCallback(
    async (reason: CancelDeliveryReason, otherText?: string) => {
      setCancelling(true);
      setCancelError(null);
      try {
        const mapped = mapCancelReasonToBackend(reason, otherText);
        await cancelDelivery(
          delivery.id,
          {
            reasonCode: mapped.reasonCode,
            reasonMessage: mapped.reasonMessage,
          },
          crypto.randomUUID(),
        );
        await onRefresh();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not cancel delivery.";
        setCancelError(message);
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setCancelling(false);
      }
    },
    [delivery.id, onRefresh],
  );

  const handleRate = async (rating: number, comment: string) => {
    await submitRating(delivery.id, {
      driverRating: rating,
      deliveryRating: rating,
    });
    if (comment.trim()) {
      await submitFeedback(delivery.id, { comment: comment.trim() });
    }
    await onRefresh();
  };

  const isCompleted = delivery.status === "delivered";
  const isCancelled = delivery.status === "cancelled";
  const isFailed = delivery.status === "failed";

  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        {cancelError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">
            {cancelError}
          </p>
        )}
        {isCompleted && (
          <TrackingCompletedView delivery={delivery} onRate={handleRate} />
        )}
        {isCancelled && <TrackingCancelledView delivery={delivery} />}
        {isFailed && <TrackingFailedView delivery={delivery} />}
        {!isCompleted && !isCancelled && !isFailed && (
          <TrackingInProgressView
            delivery={delivery}
            onCancel={handleCancel}
            cancelling={cancelling}
            onOtpVerified={onRefresh}
          />
        )}
      </div>
    </main>
  );
}
