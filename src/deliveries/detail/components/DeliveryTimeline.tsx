"use client";

import { useState } from "react";
import { IconCheck, IconChevronDown, IconTruck } from "@/dashboard/components/icons";
import type { TimelineEvent } from "../../types";

type DeliveryTimelineProps = {
  events: TimelineEvent[];
  collapsible?: boolean;
  compact?: boolean;
};

function StepIndicator({
  event,
  stepNumber,
}: {
  event: TimelineEvent;
  stepNumber: number;
}) {
  if (event.state === "complete") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <IconCheck className="h-4 w-4" />
      </span>
    );
  }

  if (event.state === "current") {
    return (
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-accent"
          aria-hidden="true"
        />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
          <IconTruck className="h-4 w-4" />
        </span>
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-caption font-bold text-muted-foreground">
      {stepNumber}
    </span>
  );
}

function CompactTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
              event.state === "complete"
                ? "bg-foreground text-background"
                : event.state === "current"
                  ? "bg-accent text-accent-foreground"
                  : "border border-border bg-background text-muted-foreground"
            }`}
            aria-hidden="true"
          >
            {event.state === "complete" ? "✓" : event.state === "current" ? "●" : "○"}
          </span>
          <div className="min-w-0">
            <p className="text-body font-medium text-foreground">{event.label}</p>
            {event.time && (
              <p className="text-caption text-muted-foreground">{event.time}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function DeliveryTimeline({
  events,
  collapsible = true,
  compact = false,
}: DeliveryTimelineProps) {
  const [expanded, setExpanded] = useState(true);

  if (compact) {
    return <CompactTimeline events={events} />;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <button
        type="button"
        onClick={() => collapsible && setExpanded((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 p-5 text-left md:p-6 ${collapsible ? "cursor-pointer" : "cursor-default"}`}
        aria-expanded={collapsible ? expanded : undefined}
      >
        <h2 className="text-body-lg font-bold text-foreground">Timeline</h2>
        {collapsible && (
          <IconChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {expanded && (
        <ol
          className="space-y-0 px-5 pb-5 md:px-6 md:pb-6"
          aria-label="Delivery timeline"
        >
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
                <StepIndicator event={event} stepNumber={index + 1} />
                <div className="min-w-0 pt-0.5">
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
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
