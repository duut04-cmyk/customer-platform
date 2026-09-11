"use client";

import { useState } from "react";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import type { Delivery } from "../types";
import TrackingCancelledView from "./components/TrackingCancelledView";
import TrackingCompletedView from "./components/TrackingCompletedView";
import TrackingFailedView from "./components/TrackingFailedView";
import TrackingInProgressView from "./components/TrackingInProgressView";

type TrackingPageProps = {
  delivery: Delivery;
};

export default function TrackingPage({ delivery: initialDelivery }: TrackingPageProps) {
  const [delivery, setDelivery] = useState(initialDelivery);

  const handleCancel = (reason: string) => {
    setDelivery((current) => ({
      ...current,
      status: "cancelled",
      statusLabel: "Cancelled",
      cancelReason: reason,
      cancelledAtLabel: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
  };

  const handleRate = (rating: number, comment: string) => {
    setDelivery((current) => ({
      ...current,
      customerRating: rating,
      customerRatingComment: comment || undefined,
      ratedAt: new Date().toISOString(),
    }));
  };

  const isCompleted = delivery.status === "delivered";
  const isCancelled = delivery.status === "cancelled";
  const isFailed = delivery.status === "failed";

  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        {isCompleted && (
          <TrackingCompletedView delivery={delivery} onRate={handleRate} />
        )}
        {isCancelled && <TrackingCancelledView delivery={delivery} />}
        {isFailed && <TrackingFailedView delivery={delivery} />}
        {!isCompleted && !isCancelled && !isFailed && (
          <TrackingInProgressView delivery={delivery} onCancel={handleCancel} />
        )}
      </div>
    </main>
  );
}
