"use client";

import { CREATE_DELIVERY_GRID } from "@/dashboard/components/layout";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/api/errors";
import type { BookingPaymentPhase } from "@/lib/payments/complete-booking-with-payment";
import type { BookingResult, DeliveryFormData, DeliveryRecommendation } from "../types";
import BookingProgressStepper from "./BookingProgressStepper";
import BookingServiceSummaryCard from "./BookingServiceSummaryCard";
import BookingStatusBanners from "./BookingStatusBanners";
import BookingWhatHappensNextCard from "./BookingWhatHappensNextCard";
import ConfirmedDeliverySummaryCard from "./ConfirmedDeliverySummaryCard";

type BookingDeliveryProps = {
  recommendation: DeliveryRecommendation;
  formData: DeliveryFormData;
  onConfirm: (
    onPhase?: (phase: BookingPaymentPhase) => void,
  ) => Promise<BookingResult | null>;
};

function phaseToStepperIndex(phase: BookingPaymentPhase | "idle"): number {
  switch (phase) {
    case "idle":
    case "creating_payment":
      return 2;
    case "opening_checkout":
    case "awaiting_payment":
      return 2;
    case "confirming_booking":
      return 3;
    default:
      return 2;
  }
}

export function BookingDeliveryHeader() {
  return (
    <div className="space-y-2">
      <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
        Pay and confirm booking
      </h2>
      <p className="text-body text-muted-foreground">
        Complete secure payment, then we will confirm your delivery with the partner.
      </p>
    </div>
  );
}

export default function BookingDelivery({
  recommendation,
  formData,
  onConfirm,
}: BookingDeliveryProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [phaseLabel, setPhaseLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const confirmInFlightRef = useRef<Promise<void> | null>(null);

  const handlePhase = useCallback((phase: BookingPaymentPhase) => {
    setActiveIndex(phaseToStepperIndex(phase));
    switch (phase) {
      case "creating_payment":
        setPhaseLabel("Preparing secure payment…");
        break;
      case "opening_checkout":
        setPhaseLabel("Opening Cashfree checkout…");
        break;
      case "awaiting_payment":
        setPhaseLabel("Confirming payment with Doot…");
        break;
      case "confirming_booking":
        setPhaseLabel("Booking your delivery with the partner…");
        break;
      default:
        setPhaseLabel(null);
    }
  }, []);

  const runConfirm = useCallback(async () => {
    if (confirmInFlightRef.current) {
      await confirmInFlightRef.current;
      return;
    }

    const task = (async () => {
      try {
        setError(null);
        const result = await onConfirm(handlePhase);
        if (result === null) {
          setError(
            "Could not start booking. Missing delivery details — go back and try again.",
          );
          setActiveIndex(2);
          setPhaseLabel(null);
        }
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Booking failed. Please try again.",
        );
        setActiveIndex(2);
        setPhaseLabel(null);
      }
    })();

    confirmInFlightRef.current = task;
    try {
      await task;
    } finally {
      if (confirmInFlightRef.current === task) {
        confirmInFlightRef.current = null;
      }
    }
  }, [handlePhase, onConfirm]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runConfirm();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [runConfirm]);

  return (
    <div className="space-y-5">
      <BookingServiceSummaryCard recommendation={recommendation} formData={formData} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-small text-red-700">
          <p>{error}</p>
          <button
            type="button"
            className="mt-3 text-small font-semibold text-red-800 underline"
            onClick={() => void runConfirm()}
          >
            Try again
          </button>
        </div>
      )}

      <div className={`grid gap-4 xl:items-start xl:gap-x-5 ${CREATE_DELIVERY_GRID}`}>
        <section
          className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
          aria-label="Booking progress"
        >
          <div className="space-y-5 p-5 md:p-6">
            <p className="text-body font-semibold text-foreground">Booking progress</p>

            <div className="overflow-x-auto pb-1">
              <BookingProgressStepper activeIndex={activeIndex} />
            </div>

            {phaseLabel ? (
              <p
                className="text-small text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {phaseLabel}
              </p>
            ) : null}

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
