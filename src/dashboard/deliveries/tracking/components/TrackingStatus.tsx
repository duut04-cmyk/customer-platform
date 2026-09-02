import type { Delivery } from "../../types";

type TrackingStatusProps = {
  delivery: Delivery;
};

export default function TrackingStatus({ delivery }: TrackingStatusProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-body-lg font-bold text-foreground">
            {delivery.statusLabel}
          </p>
          <p className="mt-1 text-body text-muted-foreground">
            Your delivery is on the way.
          </p>
        </div>
        {delivery.status !== "cancelled" && delivery.status !== "delivered" && (
          <div className="text-right">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Estimated arrival
            </p>
            <p className="mt-1 text-body-lg font-bold text-accent">
              {delivery.estimatedArrival}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Pickup
          </p>
          <p className="mt-1 text-body font-medium text-foreground">
            {delivery.pickup.city}
          </p>
        </div>
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Drop-off
          </p>
          <p className="mt-1 text-body font-medium text-foreground">
            {delivery.dropoff.city}
          </p>
        </div>
      </div>
    </section>
  );
}
