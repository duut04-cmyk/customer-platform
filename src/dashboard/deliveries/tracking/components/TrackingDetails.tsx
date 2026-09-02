import DeliveryTimeline from "../../detail/components/DeliveryTimeline";
import type { Delivery } from "../../types";

type TrackingDetailsProps = {
  delivery: Delivery;
};

const compactLabels = [
  "Order booked",
  "Driver assigned",
  "Package picked up",
  "In transit",
  "Delivered",
];

export default function TrackingDetails({ delivery }: TrackingDetailsProps) {
  const events = delivery.timeline.map((event, index) => ({
    ...event,
    label: compactLabels[index] ?? event.label,
  }));

  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-body-lg font-bold text-foreground">Timeline</h2>
      <DeliveryTimeline events={events} compact />
    </section>
  );
}
