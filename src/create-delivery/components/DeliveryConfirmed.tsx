"use client";

import type { BookingResult, DeliveryFormData } from "../types";
import ConfirmedDeliveryOverviewCard from "./ConfirmedDeliveryOverviewCard";
import ConfirmedDeliverySummaryCard from "./ConfirmedDeliverySummaryCard";
import ConfirmedWhatHappensNextCard from "./ConfirmedWhatHappensNextCard";
import PricingBreakdown from "./PricingBreakdown";
import RecommendedDriverCard from "./RecommendedDriverCard";

type DeliveryConfirmedProps = {
  booking: BookingResult;
  formData: DeliveryFormData;
};

export function DeliveryConfirmedHeader() {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground"
        aria-hidden="true"
      >
        ✓
      </div>
      <div className="space-y-1 pt-0.5">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Delivery booked
        </h2>
        <p className="text-body text-muted-foreground">
          Your delivery has been successfully booked.
        </p>
      </div>
    </div>
  );
}

export default function DeliveryConfirmed({
  booking,
  formData,
}: DeliveryConfirmedProps) {
  const { recommendation } = booking;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="flex flex-col gap-4">
        <ConfirmedDeliveryOverviewCard booking={booking} formData={formData} />
        <RecommendedDriverCard driver={recommendation.driver} />
      </div>

      <aside className="flex flex-col gap-4">
        <PricingBreakdown
          pricing={recommendation.pricing}
          showNote={false}
          heading="Price breakdown"
        />
        <ConfirmedDeliverySummaryCard
          data={formData}
          serviceName={recommendation.serviceName}
        />
        <ConfirmedWhatHappensNextCard />
      </aside>
    </div>
  );
}
