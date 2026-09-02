import type { Delivery } from "../../types";

type DeliveryStatusProps = {
  delivery: Delivery;
};

export default function DeliveryStatus({ delivery }: DeliveryStatusProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <p className="mt-2 text-body-lg font-bold text-foreground">
            {delivery.statusLabel}
          </p>
          <p className="mt-1 text-body text-muted-foreground">
            {delivery.status === "in_transit"
              ? "Your delivery is on the way."
              : delivery.statusLabel}
          </p>
        </div>
        {delivery.status !== "cancelled" && delivery.status !== "delivered" && (
          <div className="text-right">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Estimated arrival
            </p>
            <p className="mt-2 text-body-lg font-bold text-accent">
              {delivery.estimatedArrival}
            </p>
          </div>
        )}
      </div>
      {delivery.status !== "cancelled" && delivery.status !== "delivered" && (
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-small font-bold text-accent-foreground">
            {delivery.driverInitials}
          </span>
          <div>
            <p className="text-small font-semibold text-foreground">Driver</p>
            <p className="text-caption text-muted-foreground">
              Assigned to your delivery
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
