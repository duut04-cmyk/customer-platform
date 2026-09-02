import Link from "next/link";
import type { Delivery } from "../types";
import { deliveryRoutePath } from "../mockDeliveries";

type DeliveryHistoryCardProps = {
  delivery: Delivery;
};

export default function DeliveryHistoryCard({
  delivery,
}: DeliveryHistoryCardProps) {
  return (
    <Link
      href={deliveryRoutePath(delivery.id)}
      className="block rounded-xl border border-border bg-background p-4 shadow-sm transition-colors hover:border-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            {delivery.id}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-body font-semibold text-foreground">
            <span>{delivery.pickup.city}</span>
            <span className="text-muted-foreground" aria-hidden="true">
              →
            </span>
            <span>{delivery.dropoff.city}</span>
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            {delivery.packageType} · {delivery.weight} · {delivery.dateLabel}
          </p>
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
          <p className="mt-3 text-small font-semibold text-accent">
            View delivery
          </p>
        </div>
      </div>
    </Link>
  );
}
