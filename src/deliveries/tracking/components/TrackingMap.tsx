"use client";

import DeliveryRouteMap from "@/common/components/DeliveryRouteMap";
import type { Delivery, DeliveryLocation } from "../../types";

function formatLocation(location: DeliveryLocation): string {
  return [location.address, location.city].filter(Boolean).join(", ");
}

type TrackingMapProps = {
  delivery: Delivery;
};

export default function TrackingMap({ delivery }: TrackingMapProps) {
  const pickup = formatLocation(delivery.pickup);
  const drop = formatLocation(delivery.dropoff);

  if (delivery.trackingUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface/60">
        <iframe
          title="Live delivery tracking"
          src={delivery.trackingUrl}
          className="h-[min(55vh,480px)] w-full border-0 sm:h-[360px] md:h-[420px] lg:h-[480px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return <DeliveryRouteMap pickupAddress={pickup} dropAddress={drop} />;
}
