"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconDocumentFilled,
  IconMapPinFilled,
} from "@/dashboard/components/icons";
import { deliveryRoutePath, deliveryTrackingPath } from "@/deliveries/paths";
import { formatInr } from "@/deliveries/pricing";
import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import type { BookingResult, DeliveryFormData } from "../types";

type ConfirmedDeliveryOverviewCardProps = {
  booking: BookingResult;
  formData: DeliveryFormData;
};

export default function ConfirmedDeliveryOverviewCard({
  booking,
  formData,
}: ConfirmedDeliveryOverviewCardProps) {
  const router = useRouter();
  const { recommendation, deliveryId } = booking;
  const partner = getPartnerMark(recommendation.serviceName);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
      aria-labelledby="confirmed-overview-heading"
    >
      <div className="space-y-5 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-caption font-medium text-muted-foreground">
              Delivery ID
            </p>
            <h2
              id="confirmed-overview-heading"
              className="mt-0.5 text-body-lg font-bold text-foreground md:text-subheading"
            >
              {deliveryId}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
            <IconCheck className="h-3.5 w-3.5" />
            Confirmed
          </span>
        </div>

        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-body-lg font-bold ${partner.className}`}
              aria-hidden="true"
            >
              {partner.letter}
            </span>
            <div className="min-w-0">
              <p className="text-body-lg font-bold text-foreground">
                {recommendation.serviceName}
              </p>
              <p className="mt-0.5 text-small capitalize text-muted-foreground">
                {recommendation.tagline}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2 sm:text-right">
            <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-small font-semibold text-foreground">
                {recommendation.estimatedDuration}
              </p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                {recommendation.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <IconMapPinFilled className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
                Pickup
              </p>
            </div>
            <p className="mt-1.5 text-small font-medium text-foreground">
              {formData.pickupAddress.trim() || "Not specified"}
            </p>
          </div>

          <IconArrowRight
            className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1 sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <IconMapPinFilled className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
                Drop-off
              </p>
            </div>
            <p className="mt-1.5 text-small font-medium text-foreground">
              {formData.dropAddress.trim() || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 rounded-lg bg-blue-50 px-3 py-2.5">
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
            Your delivery is confirmed and will be picked up shortly.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-body font-semibold text-foreground">Total</p>
          <p className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
            {formatInr(recommendation.pricing.total)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-12! min-h-12 flex-1 gap-2 rounded-[6px] px-6 py-3 text-body font-semibold"
            onClick={() => router.push(deliveryTrackingPath(deliveryId))}
          >
            Track delivery
            <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-12! min-h-12 flex-1 gap-2 rounded-[6px] px-6 py-3 text-body font-semibold"
            onClick={() => router.push(deliveryRoutePath(deliveryId))}
          >
            <IconDocumentFilled className="h-4 w-4" />
            View delivery details
          </Button>
        </div>
      </div>
    </section>
  );
}
