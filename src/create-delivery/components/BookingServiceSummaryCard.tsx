import {
  IconArrowRight,
  IconClock,
  IconMapPinFilled,
} from "@/dashboard/components/icons";
import { formatInr } from "@/deliveries/pricing";
import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import type { DeliveryFormData, DeliveryRecommendation } from "../types";

type BookingServiceSummaryCardProps = {
  recommendation: DeliveryRecommendation;
  formData: DeliveryFormData;
};

export default function BookingServiceSummaryCard({
  recommendation,
  formData,
}: BookingServiceSummaryCardProps) {
  const partner = getPartnerMark(recommendation.serviceName);

  return (
    <section
      className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
      aria-labelledby="booking-service-summary-heading"
    >
      <div className="space-y-5 p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-body-lg font-bold ${partner.className}`}
              aria-hidden="true"
            >
              {partner.letter}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="booking-service-summary-heading"
                  className="text-body-lg font-bold text-foreground md:text-subheading"
                >
                  {recommendation.serviceName}
                </h2>
                <span className="inline-flex rounded-pill bg-surface-accent px-2.5 py-0.5 text-caption font-semibold text-accent">
                  Selected
                </span>
              </div>
              <p className="mt-0.5 text-small capitalize text-muted-foreground">
                {recommendation.tagline}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2 lg:text-right">
            <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-caption font-medium text-muted-foreground">
                Estimated delivery
              </p>
              <p className="mt-0.5 text-small font-semibold text-foreground">
                {recommendation.estimatedDuration}
              </p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                {recommendation.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
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

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
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

          <div className="shrink-0 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 lg:text-right">
            <p className="text-caption font-medium text-muted-foreground">Total</p>
            <p className="mt-0.5 text-heading font-bold tracking-tight text-foreground md:text-heading-md">
              {formatInr(recommendation.pricing.total)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
