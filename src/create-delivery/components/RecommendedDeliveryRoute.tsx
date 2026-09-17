import DeliveryRouteMap from "@/common/components/DeliveryRouteMap";

type RecommendedDeliveryRouteProps = {
  pickupAddress: string;
  dropAddress: string;
  pickupTime: string;
  deliveryEta: string;
};

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

      <div className="mt-4 -mx-4 sm:mx-0">
        <DeliveryRouteMap
          pickupAddress={pickupAddress}
          dropAddress={dropAddress}
          className="rounded-none border-x-0 sm:rounded-lg sm:border-x"
        />
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
