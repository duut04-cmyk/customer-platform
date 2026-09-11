import Link from "next/link";
import Button from "@/common/components/Button";
import { DELIVERIES_PATH } from "@/deliveries/paths";
import type { Delivery } from "../../types";
import TrackingPageHeader from "./TrackingPageHeader";

type TrackingFailedViewProps = {
  delivery: Delivery;
};

export default function TrackingFailedView({ delivery }: TrackingFailedViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <TrackingPageHeader delivery={delivery} variant="failed" />

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <p className="text-body text-muted-foreground">
          Something went wrong while completing this delivery. Please contact support if
          you need help or a refund.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={DELIVERIES_PATH}>
            <Button
              type="button"
              className="h-11 rounded-[6px] px-6 text-body font-semibold"
            >
              Back to deliveries
            </Button>
          </Link>
          <a href="mailto:support@doot.com">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-[6px] px-6 text-body font-semibold"
            >
              Contact support
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
