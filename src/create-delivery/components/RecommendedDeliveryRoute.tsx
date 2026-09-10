import { IconTruck } from "@/dashboard/components/icons";

type RecommendedDeliveryRouteProps = {
  pickupAddress: string;
  dropAddress: string;
  pickupTime: string;
  deliveryEta: string;
};

function RouteMapIllustration() {
  return (
    <div
      className="relative h-28 overflow-hidden rounded-lg bg-surface/60 md:h-32"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="route-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/60"
            />
          </pattern>
        </defs>
        <rect width="400" height="120" fill="url(#route-grid)" />
        <path
          d="M 60 70 Q 140 30, 200 55 T 340 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="text-accent/70"
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-sm">
        <IconTruck className="h-4 w-4 text-foreground/70" />
      </div>
    </div>
  );
}

export default function RecommendedDeliveryRoute({
  pickupAddress,
  dropAddress,
  pickupTime,
  deliveryEta,
}: RecommendedDeliveryRouteProps) {
  return (
    <section
      className="rounded-lg border border-border bg-background p-4 md:p-5"
      aria-labelledby="recommended-route-heading"
    >
      <h3
        id="recommended-route-heading"
        className="text-body font-semibold text-foreground"
      >
        Delivery route
      </h3>

      <div className="mt-4">
        <RouteMapIllustration />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
            Pickup
          </p>
          <p className="mt-2 text-small font-medium text-foreground">{pickupAddress}</p>
          <p className="mt-1 text-caption text-muted-foreground">{pickupTime}</p>
        </div>

        <div className="min-w-0 sm:border-l sm:border-border sm:pl-4">
          <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
            Delivery
          </p>
          <p className="mt-2 text-small font-medium text-foreground">{dropAddress}</p>
          <p className="mt-1 text-caption text-muted-foreground">{deliveryEta}</p>
        </div>
      </div>
    </section>
  );
}
