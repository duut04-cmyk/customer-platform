"use client";

import { IconCheck } from "@/dashboard/components/icons";
import { buildCustomerTrackingProgressTimeline } from "../../timeline-builder";
import { isActiveTrackingStatus, type Delivery } from "../../types";

type TrackingUnifiedTimelineProps = {
  delivery: Delivery;
};

function StepDot({ state }: { state: "complete" | "current" | "upcoming" }) {
  if (state === "complete") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <IconCheck className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-accent"
          aria-hidden="true"
        />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent text-caption font-bold text-white">
          ●
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-caption text-muted-foreground">
      ○
    </span>
  );
}

export default function TrackingUnifiedTimeline({
  delivery,
}: TrackingUnifiedTimelineProps) {
  if (!isActiveTrackingStatus(delivery.status)) {
    return null;
  }

  const events = buildCustomerTrackingProgressTimeline(delivery);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
      <h2 className="text-body font-bold text-foreground">Delivery progress</h2>
      <p className="mt-1 text-caption text-muted-foreground">
        From pickup through drop-off — one timeline for status and partner updates.
      </p>

      <ol className="mt-5 space-y-0" aria-label="Delivery progress">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const connectorColor =
            event.state === "complete" ? "bg-emerald-400" : "bg-border";

          return (
            <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-4 top-8 h-[calc(100%-8px)] w-px ${connectorColor}`}
                  aria-hidden="true"
                />
              )}
              <StepDot state={event.state} />
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-small font-semibold ${
                    event.state === "current"
                      ? "text-accent"
                      : event.state === "complete"
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {event.label}
                </p>
                {event.time && (
                  <p className="mt-0.5 text-caption text-muted-foreground">
                    {event.time}
                  </p>
                )}
                {event.description && (
                  <p className="mt-1 text-caption leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
