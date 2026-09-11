import Link from "next/link";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import type { Delivery } from "../../types";
import TrackingPageHeader from "./TrackingPageHeader";

type TrackingCancelledViewProps = {
  delivery: Delivery;
};

export default function TrackingCancelledView({
  delivery,
}: TrackingCancelledViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <TrackingPageHeader delivery={delivery} variant="cancelled" />

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <p className="text-body text-muted-foreground">
          {delivery.cancelledAtLabel
            ? `Cancelled on ${delivery.cancelledAtLabel}.`
            : "This delivery was cancelled before pickup."}
        </p>
        {delivery.cancelReason && (
          <p className="mt-3 text-small font-medium text-foreground">
            Reason: {delivery.cancelReason}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={CREATE_DELIVERY_PATH}>
            <Button
              type="button"
              className="h-11 rounded-[6px] px-6 text-body font-semibold"
            >
              Book again
            </Button>
          </Link>
          <Link href={DELIVERIES_PATH}>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-[6px] px-6 text-body font-semibold"
            >
              Back to deliveries
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
