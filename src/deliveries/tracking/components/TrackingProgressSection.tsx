import type { Delivery } from "../../types";
import TrackingHorizontalTimeline from "./TrackingHorizontalTimeline";

type TrackingProgressSectionProps = {
  delivery: Delivery;
};

export default function TrackingProgressSection({
  delivery,
}: TrackingProgressSectionProps) {
  const showTimeline =
    delivery.status === "picked_up" ||
    delivery.status === "in_transit" ||
    delivery.status === "driver_assigned";

  if (!showTimeline) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
      <TrackingHorizontalTimeline delivery={delivery} />
    </section>
  );
}
