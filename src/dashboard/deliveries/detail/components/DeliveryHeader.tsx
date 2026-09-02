import BackButton from "@/dashboard/components/BackButton";
import type { Delivery } from "../../types";

type DeliveryDetailHeaderProps = {
  delivery: Delivery;
};

export default function DeliveryDetailHeader({
  delivery,
}: DeliveryDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <BackButton href="/dashboard/deliveries" label="Back to deliveries" />
      <div className="space-y-2">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Delivery #{delivery.id}
        </p>
        <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          {delivery.statusLabel}
        </h1>
        <p className="text-body text-muted-foreground">
          {delivery.status === "delivered"
            ? "Your delivery has been completed."
            : delivery.status === "cancelled"
              ? "This delivery was cancelled."
              : "Your delivery is on the way."}
        </p>
      </div>
    </div>
  );
}
