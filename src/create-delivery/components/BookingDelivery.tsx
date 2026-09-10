"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeliveryFormData, DeliveryRecommendation } from "../types";
import BookingProgressStepper from "./BookingProgressStepper";
import BookingServiceSummaryCard from "./BookingServiceSummaryCard";
import BookingStatusBanners from "./BookingStatusBanners";
import BookingWhatHappensNextCard from "./BookingWhatHappensNextCard";
import ConfirmedDeliverySummaryCard from "./ConfirmedDeliverySummaryCard";

type BookingDeliveryProps = {
  recommendation: DeliveryRecommendation;
  formData: DeliveryFormData;
  onComplete: () => void;
};

export function BookingDeliveryHeader() {
  return (
    <div className="space-y-2">
      <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
        Booking your delivery
      </h2>
      <p className="text-body text-muted-foreground">
        Your selected delivery option is being booked.
      </p>
    </div>
  );
}

export default function BookingDelivery({
  recommendation,
  formData,
  onComplete,
}: BookingDeliveryProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setActiveIndex(3);
      }, 900),
    );

    timers.push(
      window.setTimeout(() => {
        handleComplete();
      }, 2600),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [handleComplete]);

  return (
    <div className="space-y-5">
      <BookingServiceSummaryCard recommendation={recommendation} formData={formData} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-x-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section
          className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
          aria-label="Booking progress"
        >
          <div className="space-y-5 p-5 md:p-6">
            <p className="text-body font-semibold text-foreground">Booking progress</p>

            <div className="overflow-x-auto pb-1">
              <BookingProgressStepper activeIndex={activeIndex} />
            </div>

            <BookingStatusBanners
              serviceName={recommendation.serviceName}
              showAlmostThere={activeIndex >= 2}
            />
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <ConfirmedDeliverySummaryCard
            data={formData}
            serviceName={recommendation.serviceName}
          />
          <BookingWhatHappensNextCard />
        </aside>
      </div>
    </div>
  );
}
