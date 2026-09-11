"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconClose,
  IconMapPinFilled,
} from "@/dashboard/components/icons";
import PricingBreakdown from "@/create-delivery/components/PricingBreakdown";
import { deliveryTrackingPath } from "@/deliveries/paths";
import { formatInr } from "@/deliveries/pricing";
import { getPartnerMark } from "@/utils/deliveryDisplayHelpers";
import { isActiveDeliveryDetailStatus, type Delivery } from "../../types";

type DeliverySummaryHeroCardProps = {
  delivery: Delivery;
};

const trackDeliveryButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-accent px-4 text-small font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function TrackDeliveryLink({
  deliveryId,
  className = "",
}: {
  deliveryId: string;
  className?: string;
}) {
  return (
    <Link
      href={deliveryTrackingPath(deliveryId)}
      className={`${trackDeliveryButtonClassName} ${className}`}
    >
      Track delivery
      <IconArrowRight className="h-4 w-4" />
    </Link>
  );
}

function IconCalendarClock({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconReceipt({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M6 2h12v20l-2-1.5L14 22l-2-1.5L10 22l-2-1.5L6 22V2Z"
        strokeLinejoin="round"
      />
      <path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round" />
    </svg>
  );
}

export default function DeliverySummaryHeroCard({
  delivery,
}: DeliverySummaryHeroCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isActive = isActiveDeliveryDetailStatus(delivery.status);
  const partner = getPartnerMark(delivery.selectedService);
  const serviceType = delivery.serviceType ?? "Standard delivery";
  const serviceTagline = delivery.serviceTagline ?? "Fast & reliable delivery";

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="space-y-5 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  In progress
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
                  <IconCheck className="h-3.5 w-3.5" />
                  Confirmed
                </span>
              )}
              <div>
                <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
                  {delivery.id}
                </h2>
                <p className="mt-1 text-small text-muted-foreground">
                  {delivery.bookedAtLabel ?? `Booked ${delivery.dateLabel}`}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[200px]">
              <div className="flex min-w-0 items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5">
                {partner.letter !== "?" && (
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-bold ${partner.className}`}
                    aria-hidden="true"
                  >
                    {partner.letter}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-small font-semibold capitalize text-foreground">
                    {serviceType}
                  </p>
                  <p className="mt-0.5 text-caption capitalize text-muted-foreground">
                    {serviceTagline}
                  </p>
                </div>
              </div>
              {isActive && (
                <TrackDeliveryLink deliveryId={delivery.id} className="w-full" />
              )}
            </div>
          </div>

          <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
            <div className="flex gap-3">
              <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-caption font-medium text-muted-foreground">
                  Estimated delivery
                </p>
                <p className="mt-0.5 text-small font-semibold text-foreground">
                  {delivery.estimatedDuration ?? delivery.estimatedArrival}
                </p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  {delivery.estimatedDeliveryLabel ?? delivery.dateLabel}
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:border-l sm:border-border sm:pl-4">
              <IconCalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-caption font-medium text-muted-foreground">
                  Pickup window
                </p>
                <p className="mt-0.5 text-small font-semibold text-foreground">
                  {delivery.pickupWindowLabel?.split(" Today")[0] ??
                    delivery.estimatedArrival}
                </p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  {delivery.pickupWindowLabel?.includes("Today")
                    ? "Today"
                    : delivery.dateLabel}
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:border-l sm:border-border sm:pl-4">
              <IconReceipt className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-caption font-medium text-muted-foreground">Price</p>
                <p className="mt-0.5 text-small font-semibold text-foreground">
                  {delivery.pricing ? formatInr(delivery.pricing.total) : "—"}
                </p>
                {delivery.pricing && (
                  <button
                    type="button"
                    onClick={() => setShowBreakdown(true)}
                    className="mt-0.5 cursor-pointer text-caption font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View breakdown
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <IconMapPinFilled className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-caption font-medium text-muted-foreground">Pickup</p>
              </div>
              <p className="mt-1 text-small font-medium text-foreground">
                {delivery.pickup.address}
              </p>
            </div>
            <div className="min-w-0 flex-1 sm:text-right">
              <div className="flex items-center gap-2 sm:justify-end">
                <IconMapPinFilled className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-caption font-medium text-muted-foreground">
                  Drop-off
                </p>
              </div>
              <p className="mt-1 text-small font-medium text-foreground">
                {delivery.dropoff.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {showBreakdown && delivery.pricing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={() => setShowBreakdown(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-background p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-breakdown-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3
                id="pricing-breakdown-title"
                className="text-body-lg font-bold text-foreground"
              >
                Price breakdown
              </h3>
              <button
                type="button"
                onClick={() => setShowBreakdown(false)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Close price breakdown"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <PricingBreakdown
              pricing={delivery.pricing}
              embedded
              heading="Order summary"
            />
          </div>
        </div>
      )}
    </>
  );
}
