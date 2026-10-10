"use client";

import DeliveryRouteMap from "@/common/components/DeliveryRouteMap";

export type DeliveryMapPoint = {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};

type DeliveryMapViewProps = {
  pickup: DeliveryMapPoint;
  drop: DeliveryMapPoint;
  driver?: DeliveryMapPoint | null;
  className?: string;
  title?: string;
};

function hasRouteEndpoints(pickup: DeliveryMapPoint, drop: DeliveryMapPoint): boolean {
  const pickupReady = Boolean(pickup.address.trim()) || hasCoords(pickup);
  const dropReady = Boolean(drop.address.trim()) || hasCoords(drop);
  return pickupReady && dropReady;
}

function hasCoords(point: DeliveryMapPoint): boolean {
  return (
    point.latitude != null &&
    point.longitude != null &&
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude)
  );
}

export default function DeliveryMapView({
  pickup,
  drop,
  driver,
  className,
  title = "Route map",
}: DeliveryMapViewProps) {
  if (!hasRouteEndpoints(pickup, drop)) {
    return null;
  }

  return (
    <section aria-label={title}>
      <DeliveryRouteMap
        pickupAddress={pickup.address}
        dropAddress={drop.address}
        pickupLatitude={pickup.latitude}
        pickupLongitude={pickup.longitude}
        dropLatitude={drop.latitude}
        dropLongitude={drop.longitude}
        driverLatitude={driver?.latitude}
        driverLongitude={driver?.longitude}
        className={className}
      />
    </section>
  );
}
