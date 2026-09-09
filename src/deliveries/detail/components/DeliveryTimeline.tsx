import type { TimelineEvent } from "../../types";

type DeliveryTimelineProps = {
  events: TimelineEvent[];
  compact?: boolean;
};

export default function DeliveryTimeline({
  events,
  compact = false,
}: DeliveryTimelineProps) {
  return (
    <ol className={compact ? "space-y-3" : "space-y-0"}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li
            key={event.id}
            className={`relative flex gap-3 ${compact ? "" : "pb-6"} ${!isLast && !compact ? "" : ""}`}
          >
            {!isLast && !compact && (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-border"
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
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
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-body font-medium ${
                  event.state === "current"
                    ? "text-foreground"
                    : event.state === "complete"
                      ? "text-foreground/85"
                      : "text-muted-foreground"
                }`}
              >
                {event.label}
              </p>
              {event.time && (
                <p className="text-caption text-muted-foreground">{event.time}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
