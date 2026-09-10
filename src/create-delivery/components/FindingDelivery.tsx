"use client";

import { useCallback } from "react";
import { IconClockFilled } from "@/dashboard/components/icons";
import type { DeliveryFormData, FormStep } from "../types";
import FindingProvidersList from "./FindingProvidersList";
import FindingTimeSlotBanner from "./FindingTimeSlotBanner";

type FindingDeliveryProps = {
  data: DeliveryFormData;
  onComplete: () => void;
  onEdit: (step: FormStep) => void;
};

export default function FindingDelivery({
  data,
  onComplete,
  onEdit,
}: FindingDeliveryProps) {
  const isScheduled = data.timing === "scheduled";
  const slotLabel = isScheduled
    ? "Checking availability for your time slot..."
    : "Checking availability for your request...";

  const handleAllChecked = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
      aria-labelledby="finding-delivery-heading"
    >
      <div className="space-y-5 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <IconClockFilled className="h-5 w-5" />
          </span>
          <div>
            <h2
              id="finding-delivery-heading"
              className="text-body-lg font-bold text-foreground md:text-subheading"
            >
              {isScheduled
                ? "When should we deliver?"
                : "Finding the best delivery option"}
            </h2>
            <p className="mt-1 text-small leading-relaxed text-muted-foreground">
              {isScheduled
                ? "You've selected a delivery time slot. Now we're finding the best available service for your request."
                : "Doot is checking available delivery services based on price, delivery time, package compatibility, and your requirements."}
            </p>
          </div>
        </div>

        <FindingTimeSlotBanner data={data} onEdit={() => onEdit("requirements")} />

        <FindingProvidersList onAllChecked={handleAllChecked} slotLabel={slotLabel} />
      </div>

      <div className="flex gap-2.5 border-t border-border bg-blue-50 px-5 py-3.5 md:px-6">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v5M12 8h.01" strokeLinecap="round" />
        </svg>
        <p className="text-caption leading-relaxed text-muted-foreground">
          This usually takes less than 30 seconds. We&apos;ll show you the best option
          once our analysis is complete.
        </p>
      </div>
    </section>
  );
}
