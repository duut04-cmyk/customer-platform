"use client";

import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import { useDeliveryHistory } from "../hooks/useDeliveryHistory";
import LiveTrackingSkeleton from "./components/LiveTrackingSkeleton";
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
        <LiveTrackingSkeleton />
      </main>
    );
  }

  if (error || !delivery) {
    return (
      <main className={`${DASHBOARD_MAIN} text-center`}>
        <h1 className="text-heading font-bold text-foreground">Delivery not found</h1>
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
