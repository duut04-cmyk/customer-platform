"use client";

import type { ReactElement } from "react";
import Button from "@/common/components/Button";
import {
  IconArrowRight,
  IconClock,
  IconShield,
  IconTruck,
} from "@/dashboard/components/icons";
import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import { formatInr } from "@/deliveries/pricing";
import type { DeliveryFormData, DeliveryRecommendation } from "../types";
import PricingBreakdown from "./PricingBreakdown";
import RecommendedDeliveryRoute from "./RecommendedDeliveryRoute";

type BestDeliveryOptionProps = {
  recommendation: DeliveryRecommendation;
  formData: DeliveryFormData;
  onBook: () => void;
  onBack: () => void;
};

type QuickInfoItemProps = {
  icon: ReactElement;
  label: string;
  value: string;
};

function QuickInfoItem({ icon, label, value }: QuickInfoItemProps) {
  return (
    <div className="min-w-0 flex-1 py-3 first:pt-0 last:pb-0 sm:px-3 sm:py-1 sm:first:pl-0 sm:last:pr-0">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <p className="text-caption font-medium">{label}</p>
      </div>
      <p className="mt-1 pl-5 text-small font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function BestDeliveryOption({
  recommendation,
  formData,
  onBook,
  onBack,
}: BestDeliveryOptionProps) {
  const { pricing } = recommendation;
  const partner = getPartnerMark(recommendation.serviceName);
  const accessibleBookLabel = `Confirm and continue for ${formatInr(pricing.total)}`;

  return (
    <section
      className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6"
      aria-labelledby="recommended-service-heading"
    >
      <div className="space-y-5">
        <span className="inline-flex rounded-pill bg-surface-accent px-3 py-1 text-caption font-semibold text-accent">
          Recommended
        </span>

        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-body-lg font-bold ${partner.className}`}
              aria-hidden="true"
            >
              {partner.letter}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id="recommended-service-heading"
                  className="text-body-lg font-bold text-foreground md:text-subheading"
                >
                  {recommendation.serviceName}
                </h3>
                {recommendation.verified && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-emerald-50 px-2 py-0.5 text-caption font-semibold text-emerald-700">
                    <IconShield className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-small text-muted-foreground">
                {recommendation.tagline}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-heading font-bold tracking-tight text-emerald-600 md:text-heading-md">
              {formatInr(pricing.total)}
            </p>
            <p className="mt-0.5 text-caption text-muted-foreground">Total charge</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0">
          <QuickInfoItem
            icon={<IconClock className="h-3.5 w-3.5" />}
            label="Estimated delivery"
            value={recommendation.estimatedDuration}
          />
          <QuickInfoItem
            icon={<IconClock className="h-3.5 w-3.5" />}
            label="Pickup availability"
            value={recommendation.pickupAvailability}
          />
          <QuickInfoItem
            icon={<IconTruck className="h-3.5 w-3.5" />}
            label="Service type"
            value={recommendation.serviceType}
          />
        </div>

        <div className="rounded-xl border border-border bg-surface/40 p-4 md:p-5">
          <p className="text-small font-medium text-foreground">Driver assignment</p>
          <p className="mt-1.5 text-small leading-relaxed text-muted-foreground">
            A driver will be assigned once your booking is confirmed.
          </p>
        </div>

        <RecommendedDeliveryRoute
          pickupAddress={formData.pickupAddress}
          dropAddress={formData.dropAddress}
          pickupTime={recommendation.pickupTime}
          deliveryEta={recommendation.deliveryEta}
        />

        <div className="rounded-lg border border-border p-4 md:p-5">
          <PricingBreakdown
            pricing={pricing}
            embedded
            variant="order-summary"
            heading="Order summary"
          />
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <Button
            type="button"
            className="h-12 w-full gap-2 rounded-[6px] px-8 text-body font-semibold"
            onClick={onBook}
            aria-label={accessibleBookLabel}
          >
            Confirm &amp; continue
            <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full px-8 text-body font-semibold sm:hidden"
            onClick={onBack}
          >
            Back to review
          </Button>
        </div>
      </div>
    </section>
  );
}
