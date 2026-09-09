"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import { formatInr } from "@/deliveries/pricing";
import { deliveryTrackingPath } from "@/deliveries/mockDeliveries";
import type { BookingResult, DeliveryFormData } from "../types";
import { formatScheduledAt, PACKAGE_LABELS } from "../types";
import PricingBreakdown from "./PricingBreakdown";

type DeliveryConfirmedProps = {
  booking: BookingResult;
  formData?: DeliveryFormData;
};

export default function DeliveryConfirmed({
  booking,
  formData,
}: DeliveryConfirmedProps) {
  const router = useRouter();
  const { recommendation, deliveryId } = booking;

  return (
    <div className="mx-auto mt-10 max-w-md space-y-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
        ✓
      </div>

      <div className="space-y-2">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Delivery booked
        </h2>
        <p className="text-body text-muted-foreground">
          Your delivery has been successfully booked.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 text-left shadow-sm">
        <dl className="space-y-4">
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Delivery ID
            </dt>
            <dd className="mt-1 text-body font-semibold text-foreground">
              {deliveryId}
            </dd>
          </div>
          {formData?.packageType && (
            <div>
              <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                Item category
              </dt>
              <dd className="mt-1 text-body font-semibold text-foreground">
                {PACKAGE_LABELS[formData.packageType]}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Delivery service
            </dt>
            <dd className="mt-1 text-body font-semibold text-foreground">
              {recommendation.serviceName}
            </dd>
          </div>
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Estimated delivery
            </dt>
            <dd className="mt-1 text-body font-medium text-foreground">
              {recommendation.estimatedDuration}
            </dd>
            <dd className="mt-0.5 text-small text-muted-foreground">
              {recommendation.estimatedDelivery}
            </dd>
          </div>
          {formData?.timing === "scheduled" && formData.scheduledAt && (
            <div>
              <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                Scheduled for
              </dt>
              <dd className="mt-1 text-body font-medium text-foreground">
                {formatScheduledAt(formData.scheduledAt)}
              </dd>
            </div>
          )}
          <div className="border-t border-border pt-4">
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Total
            </dt>
            <dd className="mt-1 text-body-lg font-bold text-foreground">
              {formatInr(recommendation.pricing.total)}
            </dd>
          </div>
        </dl>
      </div>

      <PricingBreakdown
        pricing={recommendation.pricing}
        showNote={false}
        heading="Price breakdown"
      />

      <p className="text-small text-muted-foreground">
        Pickup and delivery OTP codes will be available on the tracking page.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          className="h-11 w-full px-8 text-body font-semibold"
          onClick={() => router.push(deliveryTrackingPath(deliveryId))}
        >
          Track delivery
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full px-8 text-body font-semibold"
          onClick={() => router.push("/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
