import { formatScheduledAt } from "@/create-delivery/types";
import type { Delivery } from "../../types";

type TrackingDeliveryDetailsProps = {
  delivery: Delivery;
};

export default function TrackingDeliveryDetails({
  delivery,
}: TrackingDeliveryDetailsProps) {
  const weightDisplay =
    delivery.weight === "Not provided" ? "Not provided" : delivery.weight;

  return (
    <section
      className="rounded-xl border border-border bg-background p-6 shadow-sm"
      aria-labelledby="tracking-delivery-details-heading"
    >
      <h2
        id="tracking-delivery-details-heading"
        className="text-body-lg font-bold text-foreground"
      >
        Delivery details
      </h2>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Pickup
          </dt>
          <dd className="mt-1 text-body font-medium text-foreground">
            {delivery.pickup.city}
          </dd>
          <dd className="text-small text-muted-foreground">
            {delivery.pickup.address}
          </dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Drop-off
          </dt>
          <dd className="mt-1 text-body font-medium text-foreground">
            {delivery.dropoff.city}
          </dd>
          <dd className="text-small text-muted-foreground">
            {delivery.dropoff.address}
          </dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Package
          </dt>
          <dd className="mt-1 text-body font-medium text-foreground">
            {delivery.packageType}
          </dd>
          <dd className="text-small text-muted-foreground">{weightDisplay}</dd>
        </div>
        {delivery.scheduledAt && (
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Scheduled for
            </dt>
            <dd className="mt-1 text-body font-medium text-foreground">
              {formatScheduledAt(delivery.scheduledAt)}
            </dd>
          </div>
        )}
        {delivery.selectedService && (
          <div>
            <dt className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Delivery service
            </dt>
            <dd className="mt-1 text-body font-medium text-foreground">
              {delivery.selectedService}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
