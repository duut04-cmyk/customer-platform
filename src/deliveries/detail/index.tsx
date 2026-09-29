"use client";

import Link from "next/link";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import BackButton from "@/dashboard/components/BackButton";
import { useDeliveryHistory } from "../hooks/useDeliveryHistory";
import { buildCustomerDetailTimeline, isActiveDeliveryDetailStatus } from "../types";
import DeliveryDetailHeader from "./components/DeliveryHeader";
import DeliveryLocationsCard from "./components/DeliveryLocationsCard";
import DeliverySummaryHeroCard from "./components/DeliverySummaryHeroCard";
import DeliveryTimeline from "./components/DeliveryTimeline";
import DetailDriverCard from "./components/DetailDriverCard";
import DetailNeedHelpCard from "./components/DetailNeedHelpCard";
import DetailSafeCompliantCard from "./components/DetailSafeCompliantCard";
import DetailServiceInfoCard from "./components/DetailServiceInfoCard";

type DeliveryDetailProps = {
  deliveryId: string;
};

export default function DeliveryDetail({ deliveryId }: DeliveryDetailProps) {
  const { delivery, loading, error } = useDeliveryHistory(deliveryId, {
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
        <p className="mt-2 text-body text-muted-foreground">
          {error ?? `We couldn't find delivery ${deliveryId}.`}
        </p>
        <Link
          href="/deliveries"
          className="mt-6 inline-block text-body font-semibold text-accent hover:text-accent/80"
        >
          Go to delivery history
        </Link>
      </main>
    );
  }

  const timelineEvents = buildCustomerDetailTimeline(delivery);
  const isActive = isActiveDeliveryDetailStatus(delivery.status);

  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-6 lg:space-y-8">
        <DeliveryDetailHeader delivery={delivery} />
        <DeliverySummaryHeroCard delivery={delivery} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
          <div className="flex flex-col gap-4">
            <DeliveryTimeline events={timelineEvents} />
            <DeliveryLocationsCard delivery={delivery} />
          </div>

          <aside className="flex flex-col gap-4">
            {isActive && <DetailDriverCard delivery={delivery} />}
            <DetailServiceInfoCard delivery={delivery} />
            <DetailNeedHelpCard />
            <DetailSafeCompliantCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
