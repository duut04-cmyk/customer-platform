import Link from "next/link";
import type { Delivery } from "@/dashboard/deliveries/types";
import { deliveryRoutePath, deliveryTrackingPath } from "@/dashboard/deliveries/mockDeliveries";

type DeliveryCardProps = {
  delivery: Delivery;
  showTrack?: boolean;
};

export default function DeliveryCard({
  delivery,
  showTrack = false,
}: DeliveryCardProps) {
  return (
    <article className="rounded-xl border border-border bg-background p-5 shadow-sm transition-colors hover:border-foreground/15">
      <Link
        href={deliveryRoutePath(delivery.id)}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              {delivery.id}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-body font-semibold text-foreground">
              <span className="truncate">{delivery.pickup.city}</span>
              <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                →
              </span>
              <span className="truncate">{delivery.dropoff.city}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-small text-muted-foreground">
              <span>{delivery.packageType}</span>
              <span>{delivery.dateLabel}</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-caption font-semibold ${
                delivery.status === "in_transit"
                  ? "bg-surface-accent text-foreground"
                  : "bg-surface text-foreground"
              }`}
            >
              {delivery.statusLabel}
            </span>
            <p className="mt-2 text-caption text-muted-foreground">
              {delivery.estimatedArrival}
            </p>
          </div>
        </div>
      </Link>
      {showTrack && delivery.status === "in_transit" && (
        <Link
          href={deliveryTrackingPath(delivery.id)}
          className="mt-4 inline-block text-small font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Track delivery
        </Link>
      )}
    </article>
  );
}
