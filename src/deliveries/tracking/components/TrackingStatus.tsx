import { getDeliveryStatusMessage } from "../../customerCopy";
import type { Delivery } from "../../types";

type TrackingStatusProps = {
  delivery: Delivery;
};

export default function TrackingStatus({ delivery }: TrackingStatusProps) {
  const statusMessage = getDeliveryStatusMessage(delivery.status);

  return (
    <section
      className="rounded-xl border border-border bg-background p-6 shadow-sm"
      aria-labelledby="tracking-status-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            id="tracking-status-heading"
            className="text-body-lg font-bold text-foreground"
          >
            {delivery.statusLabel}
          </p>
          <p className="mt-1 text-body text-muted-foreground">{statusMessage}</p>
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
    </section>
  );
}
