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
  return (
    <DeliveryRouteMap
      pickupAddress={formatLocation(delivery.pickup)}
      dropAddress={formatLocation(delivery.dropoff)}
    />
  );
}
