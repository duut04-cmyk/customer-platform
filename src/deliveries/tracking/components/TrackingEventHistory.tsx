import type { Delivery } from "../../types";

type TrackingEventHistoryProps = {
  delivery: Delivery;
};

export default function TrackingEventHistory({ delivery }: TrackingEventHistoryProps) {
  const events = delivery.trackingEvents ?? [];

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-body font-bold text-foreground">Tracking updates</h2>
      <p className="mt-1 text-caption text-muted-foreground">
        Location and status updates from your delivery partner.
      </p>
      <ol className="mt-4 space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <span className="text-small font-medium text-foreground">
              {event.label}
            </span>
            <span className="shrink-0 text-caption text-muted-foreground">
              {event.time ?? "—"}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
