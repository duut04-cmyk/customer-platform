"use client";

import DeliveryMapView from "@/common/components/DeliveryMapView";
import type { Delivery, DeliveryLocation } from "../../types";

function formatFullLocation(location: DeliveryLocation): string {
  const address = location.address.trim();
  const city = location.city.trim();
  if (!city || address.toLowerCase().includes(city.toLowerCase())) {
    return address;
  }
  return [address, city].filter(Boolean).join(", ");
}

type TrackingMapProps = {
  delivery: Delivery;
};

export default function TrackingMap({ delivery }: TrackingMapProps) {
  const driver =
    delivery.trackingLatitude != null && delivery.trackingLongitude != null
      ? {
          address: "Driver",
          latitude: delivery.trackingLatitude,
          longitude: delivery.trackingLongitude,
        }
      : null;

  return (
    <DeliveryMapView
      title="Live delivery map"
      pickup={{
        address: formatFullLocation(delivery.pickup),
        latitude: delivery.pickup.latitude,
        longitude: delivery.pickup.longitude,
      }}
      drop={{
        address: formatFullLocation(delivery.dropoff),
        latitude: delivery.dropoff.latitude,
        longitude: delivery.dropoff.longitude,
      }}
      driver={driver}
    />
  );
}
