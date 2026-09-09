"use client";

import Button from "@/common/components/Button";
import type { Delivery } from "../../types";

type DriverInfoProps = {
  delivery: Delivery;
};

export default function DriverInfo({ delivery }: DriverInfoProps) {
  if (delivery.status === "cancelled" || delivery.status === "failed") {
    return null;
  }

  if (!delivery.driver) {
    if (delivery.status === "booked") {
      return (
        <section
          className="rounded-xl border border-border bg-background p-6 shadow-sm"
          aria-labelledby="driver-info-heading"
        >
          <h2
            id="driver-info-heading"
            className="text-body-lg font-bold text-foreground"
          >
            Your delivery partner
          </h2>
          <p className="mt-2 text-body font-medium text-foreground">
            Finding your delivery partner
          </p>
          <p className="mt-1 text-body text-muted-foreground">
            Your delivery is booked. We&apos;re assigning a delivery partner.
          </p>
        </section>
      );
    }

    return null;
  }

  const { driver } = delivery;

  return (
    <section
      className="rounded-xl border border-border bg-background p-6 shadow-sm"
      aria-labelledby="driver-info-heading"
    >
      <h2 id="driver-info-heading" className="text-body-lg font-bold text-foreground">
        Your delivery partner
      </h2>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface text-body-lg font-bold text-foreground"
          aria-hidden="true"
        >
          {driver.initials}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-body-lg font-semibold text-foreground">{driver.name}</p>
            <p className="mt-1 text-body text-muted-foreground">
              {driver.vehicleType} · {driver.vehicleNumber}
            </p>
            <p className="mt-1 text-body text-foreground">
              <span aria-hidden="true">⭐ </span>
              <span className="font-medium">{driver.rating.toFixed(1)}</span>
            </p>
          </div>

          {driver.phone && (
            <div>
              <Button
                type="button"
                variant="secondary"
                className="h-10 px-5 text-small font-semibold"
                onClick={() => {
                  window.location.href = `tel:${driver.phone?.replace(/\s/g, "")}`;
                }}
              >
                Contact
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
