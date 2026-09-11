import { IconCheck } from "@/dashboard/components/icons";
import type { Delivery } from "../../types";

type TrackingHorizontalTimelineProps = {
  delivery: Delivery;
};

type Milestone = {
  label: string;
  time: string;
  state: "complete" | "current" | "upcoming";
};

function buildMilestones(delivery: Delivery): Milestone[] {
  const defaults = {
    pickedUp: "4:12 PM",
    onTheWay: "4:28 PM",
    arrivingSoon: delivery.deliveryEta ?? `~${delivery.estimatedArrival}`,
  };
  const times = { ...defaults, ...delivery.trackingMilestones };

  const currentStep =
    delivery.status === "picked_up"
      ? 1
      : delivery.status === "in_transit"
        ? 2
        : delivery.status === "delivered"
          ? 3
          : 0;

  const stepState = (index: number): Milestone["state"] => {
    if (currentStep > index) return "complete";
    if (currentStep === index) return "current";
    return "upcoming";
  };

  return [
    {
      label: "Picked up",
      time: times.pickedUp,
      state: stepState(0),
    },
    {
      label: "On the way",
      time: times.onTheWay,
      state: stepState(1),
    },
    {
      label: "Arriving soon",
      time: times.arrivingSoon.replace(/^ETA\s/, ""),
      state: stepState(2),
    },
  ];
}

export default function TrackingHorizontalTimeline({
  delivery,
}: TrackingHorizontalTimelineProps) {
  const milestones = buildMilestones(delivery);
  const progressPercent =
    delivery.status === "in_transit" ? 66 : delivery.status === "picked_up" ? 33 : 0;
  // currentStep 0 = awaiting pickup (booked / driver_assigned)

  return (
    <div className="mt-5">
      <div className="relative mx-2 mb-6 h-1 rounded-full bg-border">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
      <ol className="grid grid-cols-3 gap-2">
        {milestones.map((milestone) => (
          <li key={milestone.label} className="text-center">
            <div className="mb-2 flex justify-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-caption ${
                  milestone.state === "complete"
                    ? "bg-emerald-600 text-white"
                    : milestone.state === "current"
                      ? "bg-accent text-white"
                      : "border border-border bg-background text-muted-foreground"
                }`}
              >
                {milestone.state === "complete" ? (
                  <IconCheck className="h-3.5 w-3.5" />
                ) : milestone.state === "current" ? (
                  "●"
                ) : (
                  "○"
                )}
              </span>
            </div>
            <p
              className={`text-caption font-semibold ${
                milestone.state === "current" ? "text-accent" : "text-foreground"
              }`}
            >
              {milestone.label}
            </p>
            <p className="mt-0.5 text-caption text-muted-foreground">
              {milestone.time}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
