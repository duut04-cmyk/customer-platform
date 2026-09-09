import BackButton from "@/dashboard/components/BackButton";
import type { Delivery } from "../../types";
import { deliveryRoutePath } from "../../mockDeliveries";

type TrackingHeaderProps = {
  delivery: Delivery;
};

export default function TrackingHeader({ delivery }: TrackingHeaderProps) {
  return (
    <div className="space-y-4">
      <BackButton href={deliveryRoutePath(delivery.id)} label="Back to delivery" />
      <div className="space-y-2">
        <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Track your delivery
        </h1>
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {delivery.id}
        </p>
      </div>
    </div>
  );
}
