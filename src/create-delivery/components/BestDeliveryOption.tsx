"use client";

import Button from "@/common/components/Button";
import { formatInr } from "@/deliveries/pricing";
import type { DeliveryRecommendation } from "../types";
import PricingBreakdown from "./PricingBreakdown";

type BestDeliveryOptionProps = {
  recommendation: DeliveryRecommendation;
  onBook: () => void;
  onBack: () => void;
};

export default function BestDeliveryOption({
  recommendation,
  onBook,
  onBack,
}: BestDeliveryOptionProps) {
  const { pricing } = recommendation;
  const bookLabel = `Book delivery — ${formatInr(pricing.total)}`;
  const accessibleBookLabel = `Book delivery for ${formatInr(pricing.total)}`;

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Best delivery option
        </h2>
        <p className="text-body leading-relaxed text-muted-foreground">
          We found the best available option based on price, delivery time,
          availability, and your requirements.
        </p>
      </div>

      <section
        className="rounded-xl border border-border bg-background p-6 shadow-sm md:p-8"
        aria-labelledby="recommended-service-heading"
      >
        <div className="space-y-6">
          <div className="space-y-4 border-b border-border pb-6">
            <span className="inline-flex rounded-pill bg-surface-accent px-3 py-1 text-caption font-semibold text-accent">
              Recommended
            </span>
            <div>
              <h3
                id="recommended-service-heading"
                className="text-body-lg font-bold text-foreground md:text-subheading"
              >
                {recommendation.serviceName}
              </h3>
              <p className="mt-2 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                Delivery service
              </p>
            </div>
            <p className="text-small leading-relaxed text-muted-foreground">
              Doot recommends this option as the best match for your delivery based on
              price, delivery time, and your requirements.
            </p>
            <div>
              <p className="text-caption text-muted-foreground">Estimated delivery</p>
              <p className="mt-0.5 text-body-lg font-bold text-foreground">
                {recommendation.estimatedDuration}
              </p>
              <p className="mt-1 text-small text-muted-foreground">
                {recommendation.estimatedDelivery}
              </p>
            </div>
            <div className="rounded-lg bg-surface/60 px-4 py-3">
              <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="mt-1 text-heading font-bold tracking-tight text-foreground md:text-heading-md">
                {formatInr(pricing.total)}
              </p>
            </div>
          </div>

          <PricingBreakdown pricing={pricing} embedded heading="Price breakdown" />
        </div>
      </section>

      <p className="text-center text-small text-muted-foreground">
        Nothing is booked yet. Review the price and book when you&apos;re ready.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          className="h-12 w-full px-8 text-body font-semibold"
          onClick={onBook}
          aria-label={accessibleBookLabel}
        >
          {bookLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-12 w-full px-8 text-body font-semibold"
          onClick={onBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
