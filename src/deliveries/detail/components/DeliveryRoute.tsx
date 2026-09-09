import type { Delivery } from "../../types";

type DeliveryRouteProps = {
  delivery: Delivery;
};

export default function DeliveryRoute({ delivery }: DeliveryRouteProps) {
  const showInTransit =
    delivery.status === "in_transit" || delivery.status === "picked_up";

  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex w-6 shrink-0 flex-col items-center pt-1">
          <span className="h-3 w-3 rounded-full bg-accent ring-4 ring-surface-accent" />
          <span
            className="my-2 w-px flex-1 min-h-[72px] border-l border-dashed border-accent/40"
            aria-hidden="true"
          />
          <span className="relative flex h-3 w-3 items-center justify-center">
            {showInTransit && (
              <span
                className="absolute h-5 w-5 animate-pulse rounded-full bg-accent/20"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 h-3 w-3 rounded-full bg-foreground" />
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-10">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Pickup
            </p>
            <p className="mt-1 text-body font-semibold text-foreground">
              {delivery.pickup.city}
            </p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {delivery.pickup.address}
            </p>
          </div>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Drop-off
            </p>
            <p className="mt-1 text-body font-semibold text-foreground">
              {delivery.dropoff.city}
            </p>
            <p className="mt-0.5 text-small text-muted-foreground">
              {delivery.dropoff.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
