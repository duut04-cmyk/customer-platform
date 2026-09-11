"use client";

import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import type { Delivery } from "../../types";
import CompletedDeliveryHero from "./CompletedDeliveryHero";
import CompletedDeliveryOverviewCard from "./CompletedDeliveryOverviewCard";
import CompletedThankYouCard from "./CompletedThankYouCard";
import DeliveryRatingCard from "./DeliveryRatingCard";
import TrackingPageHeader from "./TrackingPageHeader";

type TrackingCompletedViewProps = {
  delivery: Delivery;
  onRate: (rating: number, comment: string) => void;
};

export default function TrackingCompletedView({
  delivery,
  onRate,
}: TrackingCompletedViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <CompletedDeliveryHero />
      <TrackingPageHeader delivery={delivery} variant="completed" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-x-5">
        <div className="flex flex-col gap-4">
          <DeliveryRatingCard
            initialRating={delivery.customerRating}
            initialComment={delivery.customerRatingComment}
            onSubmit={onRate}
          />
          <CompletedDeliveryOverviewCard delivery={delivery} />
        </div>

        <aside className="flex flex-col gap-4">
          <CompletedThankYouCard />
          <SafetyComplianceCard />
        </aside>
      </div>
    </div>
  );
}
