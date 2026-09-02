"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import { deliveryTrackingPath } from "@/dashboard/deliveries/mockDeliveries";
import type { DeliveryFormData } from "../types";
import { MOCK_DELIVERY_ID, PACKAGE_LABELS } from "../types";

type DeliveryConfirmedProps = {
  data: DeliveryFormData;
};

export default function DeliveryConfirmed({ data }: DeliveryConfirmedProps) {
  const router = useRouter();

  const packageLabel = data.packageType
    ? PACKAGE_LABELS[data.packageType]
    : "Parcel";
  const dimensions =
    data.length && data.width && data.height
      ? `${data.length} × ${data.width} × ${data.height} cm`
      : "30 × 20 × 15 cm";
  const weight = data.weight ? `${data.weight} kg` : "2.5 kg";

  const pickupDisplay = data.pickupAddress || "Mumbai";
  const dropDisplay = data.dropAddress || "Mumbai";

  return (
    <div className="mt-10 space-y-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
        ✓
      </div>

      <div className="space-y-2">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          You&apos;re all set.
        </h2>
        <p className="text-body text-muted-foreground">
          Your delivery has been booked.
        </p>
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Delivery ID · {MOCK_DELIVERY_ID}
        </p>
      </div>

      <div className="mx-auto max-w-md rounded-xl border border-border bg-background p-6 text-left shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Pickup
            </p>
            <p className="mt-1 text-body font-medium text-foreground">
              {pickupDisplay}
            </p>
          </div>

          <p className="text-center text-muted-foreground" aria-hidden="true">
            ↓
          </p>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Drop-off
            </p>
            <p className="mt-1 text-body font-medium text-foreground">
              {dropDisplay}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Package
            </p>
            <p className="mt-1 text-body font-medium text-foreground">
              {packageLabel} · {dimensions} · {weight}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <p className="mt-1 inline-flex rounded-full bg-surface px-3 py-1 text-small font-semibold text-foreground">
              Driver assigned
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          type="button"
          className="h-11 px-8 text-body font-semibold"
          onClick={() => router.push(deliveryTrackingPath(MOCK_DELIVERY_ID))}
        >
          Track delivery
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-11 px-8 text-body font-semibold"
          onClick={() => router.push("/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
