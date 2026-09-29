"use client";

import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { useDeliveryHistory } from "../hooks/useDeliveryHistory";
import TrackingPage from "./TrackingPage";

type DeliveryTrackingProps = {
  deliveryId: string;
};

export default function DeliveryTracking({ deliveryId }: DeliveryTrackingProps) {
  const { delivery, loading, error, refresh } = useDeliveryHistory(deliveryId, {
    pollWhenActive: true,
  });

  if (loading) {
    return (
      <main className={`${DASHBOARD_MAIN} bg-white`}>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
      </main>
    );
  }

  if (error || !delivery) {
    return (
      <main className={`${DASHBOARD_MAIN} text-center`}>
        <BackButton href="/deliveries" label="Back to deliveries" />
        <h1 className="mt-6 text-heading font-bold text-foreground">
          Delivery not found
        </h1>
        <Link
          href="/deliveries"
          className="mt-6 inline-block text-body font-semibold text-accent"
        >
          Go to delivery history
        </Link>
      </main>
    );
  }

  return <TrackingPage delivery={delivery} onRefresh={refresh} />;
}
