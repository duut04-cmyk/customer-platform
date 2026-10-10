"use client";

import { useEffect, useMemo, useState } from "react";
import LiveDeliveryJsMap from "@/common/components/LiveDeliveryJsMap";
import { geocodeAddress } from "@/lib/google-maps/geocode-address";
import { isGoogleMapsEnabled } from "@/lib/google-maps/google-maps-env";

type DeliveryRouteMapProps = {
  pickupAddress: string;
  dropAddress: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  dropLatitude?: number | null;
  dropLongitude?: number | null;
  driverLatitude?: number | null;
  driverLongitude?: number | null;
  className?: string;
};

const MAP_HEIGHT_CLASS =
  "h-[min(55vh,480px)] w-full sm:h-[360px] md:h-[420px] lg:h-[480px]";

/**
 * Prefer coordinates for Directions/Embed so vague typed addresses (e.g. "vpo gangar 123")
 * do not collapse the map to a world view. Fall back to address text only when coords are missing.
 */
function formatOriginDestination(input: {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}): string | null {
  if (
    input.latitude != null &&
    input.longitude != null &&
    Number.isFinite(input.latitude) &&
    Number.isFinite(input.longitude)
  ) {
    return `${input.latitude},${input.longitude}`;
  }
  const address = input.address.trim();
  return address || null;
}

function hasCoords(latitude?: number | null, longitude?: number | null): boolean {
  return (
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

function buildMapEmbedUrl(
  pickupAddress: string,
  dropAddress: string,
  pickupLatitude?: number | null,
  pickupLongitude?: number | null,
  dropLatitude?: number | null,
  dropLongitude?: number | null,
): string | null {
  const pickup = formatOriginDestination({
    address: pickupAddress,
    latitude: pickupLatitude,
    longitude: pickupLongitude,
  });
  const drop = formatOriginDestination({
    address: dropAddress,
    latitude: dropLatitude,
    longitude: dropLongitude,
  });
  if (!pickup || !drop) return null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (apiKey) {
    const params = new URLSearchParams({
      key: apiKey,
      origin: pickup,
      destination: drop,
      mode: "driving",
    });
    return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
  }

  const params = new URLSearchParams({
    f: "d",
    saddr: pickup,
    daddr: drop,
    hl: "en",
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

function buildStaticMapUrl(input: {
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  dropLatitude?: number | null;
  dropLongitude?: number | null;
  driverLatitude?: number | null;
  driverLongitude?: number | null;
}): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const markers: string[] = [];
  const visiblePoints: string[] = [];

  if (hasCoords(input.pickupLatitude, input.pickupLongitude)) {
    markers.push(
      `color:0x16a34a|label:P|${input.pickupLatitude},${input.pickupLongitude}`,
    );
    visiblePoints.push(`${input.pickupLatitude},${input.pickupLongitude}`);
  }
  if (hasCoords(input.dropLatitude, input.dropLongitude)) {
    markers.push(`color:0xdc2626|label:D|${input.dropLatitude},${input.dropLongitude}`);
    visiblePoints.push(`${input.dropLatitude},${input.dropLongitude}`);
  }
  if (hasCoords(input.driverLatitude, input.driverLongitude)) {
    markers.push(
      `color:0x2563eb|label:V|${input.driverLatitude},${input.driverLongitude}`,
    );
    visiblePoints.push(`${input.driverLatitude},${input.driverLongitude}`);
  }

  if (markers.length === 0) {
    return null;
  }

  const params = new URLSearchParams({
    key: apiKey,
    size: "640x480",
    scale: "2",
    maptype: "roadmap",
  });

  for (const marker of markers) {
    params.append("markers", marker);
  }

  if (visiblePoints.length >= 2) {
    params.set("visible", visiblePoints.join("|"));
  } else if (visiblePoints.length === 1) {
    params.set("center", visiblePoints[0]!);
    params.set("zoom", "15");
  }

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function hasEndpointCoords(input: {
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  dropLatitude?: number | null;
  dropLongitude?: number | null;
}): boolean {
  return (
    hasCoords(input.pickupLatitude, input.pickupLongitude) &&
    hasCoords(input.dropLatitude, input.dropLongitude)
  );
}

export default function DeliveryRouteMap({
  pickupAddress,
  dropAddress,
  pickupLatitude,
  pickupLongitude,
  dropLatitude,
  dropLongitude,
  driverLatitude,
  driverLongitude,
  className = "",
}: DeliveryRouteMapProps) {
  const propsHaveEndpointCoords = hasEndpointCoords({
    pickupLatitude,
    pickupLongitude,
    dropLatitude,
    dropLongitude,
  });

  const [geocodedPickup, setGeocodedPickup] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geocodedDrop, setGeocodedDrop] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [jsMapFailed, setJsMapFailed] = useState(false);

  const pickupNeedsGeocode =
    !hasCoords(pickupLatitude, pickupLongitude) && pickupAddress.trim().length > 0;
  const dropNeedsGeocode =
    !hasCoords(dropLatitude, dropLongitude) && dropAddress.trim().length > 0;
  const needsGeocode = pickupNeedsGeocode || dropNeedsGeocode;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setGeocodedPickup(null);
      setGeocodedDrop(null);
      setJsMapFailed(false);
      if (!isGoogleMapsEnabled() || !needsGeocode) {
        setGeocoding(false);
        return;
      }

      setGeocoding(true);
      try {
        const [pickup, drop] = await Promise.all([
          pickupNeedsGeocode ? geocodeAddress(pickupAddress) : Promise.resolve(null),
          dropNeedsGeocode ? geocodeAddress(dropAddress) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        if (pickup) setGeocodedPickup(pickup);
        if (drop) setGeocodedDrop(drop);
      } finally {
        if (!cancelled) {
          setGeocoding(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    dropAddress,
    dropLatitude,
    dropLongitude,
    dropNeedsGeocode,
    pickupAddress,
    pickupLatitude,
    pickupLongitude,
    pickupNeedsGeocode,
    needsGeocode,
  ]);

  const resolvedPickupLat = pickupLatitude ?? geocodedPickup?.latitude ?? null;
  const resolvedPickupLng = pickupLongitude ?? geocodedPickup?.longitude ?? null;
  const resolvedDropLat = dropLatitude ?? geocodedDrop?.latitude ?? null;
  const resolvedDropLng = dropLongitude ?? geocodedDrop?.longitude ?? null;

  const endpointsReady = hasEndpointCoords({
    pickupLatitude: resolvedPickupLat,
    pickupLongitude: resolvedPickupLng,
    dropLatitude: resolvedDropLat,
    dropLongitude: resolvedDropLng,
  });

  const showDriverOnMap = hasCoords(driverLatitude, driverLongitude);
  const apiKey = isGoogleMapsEnabled();
  const geocodeReady = !needsGeocode || !geocoding;
  const hasBothAddresses =
    pickupAddress.trim().length > 0 && dropAddress.trim().length > 0;
  const canUseJsMap =
    apiKey &&
    !jsMapFailed &&
    geocodeReady &&
    hasBothAddresses &&
    (endpointsReady || needsGeocode);

  const hasAnyResolvedCoord =
    hasCoords(resolvedPickupLat, resolvedPickupLng) ||
    hasCoords(resolvedDropLat, resolvedDropLng) ||
    showDriverOnMap;

  const { mapMode, staticMapUrl, embedUrl } = useMemo(() => {
    if (canUseJsMap) {
      return { mapMode: "js" as const, staticMapUrl: null, embedUrl: null };
    }

    const directionsUrl =
      endpointsReady || (pickupAddress.trim() && dropAddress.trim())
        ? buildMapEmbedUrl(
            pickupAddress,
            dropAddress,
            resolvedPickupLat,
            resolvedPickupLng,
            resolvedDropLat,
            resolvedDropLng,
          )
        : null;

    const staticUrl = apiKey
      ? buildStaticMapUrl({
          pickupLatitude: resolvedPickupLat,
          pickupLongitude: resolvedPickupLng,
          dropLatitude: resolvedDropLat,
          dropLongitude: resolvedDropLng,
          driverLatitude,
          driverLongitude,
        })
      : null;

    // Prefer embed directions (road path) when JS map is unavailable.
    // Static markers when we only have points / driver and no embed.
    if (directionsUrl) {
      return {
        mapMode: "directions" as const,
        staticMapUrl: null,
        embedUrl: directionsUrl,
      };
    }
    if (staticUrl) {
      return { mapMode: "static" as const, staticMapUrl: staticUrl, embedUrl: null };
    }
    return { mapMode: "none" as const, staticMapUrl: null, embedUrl: null };
  }, [
    apiKey,
    canUseJsMap,
    driverLatitude,
    driverLongitude,
    endpointsReady,
    pickupAddress,
    dropAddress,
    resolvedDropLat,
    resolvedDropLng,
    resolvedPickupLat,
    resolvedPickupLng,
  ]);

  if (
    (geocoding && needsGeocode) ||
    (!hasAnyResolvedCoord && !propsHaveEndpointCoords && mapMode === "none")
  ) {
    return (
      <div
        className={`flex ${MAP_HEIGHT_CLASS} animate-pulse items-center justify-center rounded-lg border border-border bg-surface/60 ${className}`}
      >
        <p className="px-4 text-center text-small text-muted-foreground">
          Loading map for pickup and drop-off…
        </p>
      </div>
    );
  }

  if (mapMode === "js") {
    return (
      <LiveDeliveryJsMap
        className={className}
        heightClassName={MAP_HEIGHT_CLASS}
        pickup={{
          address: pickupAddress,
          latitude: resolvedPickupLat,
          longitude: resolvedPickupLng,
        }}
        drop={{
          address: dropAddress,
          latitude: resolvedDropLat,
          longitude: resolvedDropLng,
        }}
        driver={
          showDriverOnMap
            ? {
                address: "Driver",
                latitude: driverLatitude,
                longitude: driverLongitude,
              }
            : null
        }
        onUnavailable={() => setJsMapFailed(true)}
      />
    );
  }

  if (mapMode === "none") {
    return (
      <div
        className={`flex ${MAP_HEIGHT_CLASS} items-center justify-center rounded-lg border border-border bg-surface/60 ${className}`}
      >
        <p className="px-4 text-center text-small text-muted-foreground">
          Add pickup and drop-off addresses to preview the route.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="overflow-hidden rounded-lg border border-border bg-surface/60">
        {mapMode === "directions" && embedUrl ? (
          <iframe
            title="Delivery route map"
            src={embedUrl}
            className={`${MAP_HEIGHT_CLASS} border-0`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : staticMapUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Google Static Maps URL
          <img
            src={staticMapUrl}
            alt="Pickup and drop-off locations on map"
            className={`${MAP_HEIGHT_CLASS} w-full object-cover`}
            loading="lazy"
          />
        ) : null}
      </div>
      {mapMode === "static" && showDriverOnMap ? (
        <p className="text-caption text-muted-foreground">
          Map markers: P pickup, D drop-off, V driver (latest tracking coordinates).
        </p>
      ) : mapMode === "directions" ? (
        <p className="text-caption text-muted-foreground">
          Driving route from pickup to drop-off.
        </p>
      ) : null}
    </div>
  );
}
