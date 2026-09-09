import DeliveryTimeline from "../../detail/components/DeliveryTimeline";
import type { Delivery } from "../../types";

type TrackingDetailsProps = {
  delivery: Delivery;
};

export default function TrackingDetails({ delivery }: TrackingDetailsProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-body-lg font-bold text-foreground">Timeline</h2>
      <DeliveryTimeline events={delivery.timeline} compact />
    </section>
  );
}
