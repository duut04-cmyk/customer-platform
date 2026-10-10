"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeAddress } from "@/lib/google-maps/geocode-address";
import {
  importMapsLibrary,
  importRoutesLibrary,
  loadGoogleMaps,
} from "@/lib/google-maps/load-google-maps";
import type {
  GoogleMapsDirectionsRenderer,
  GoogleMapsDirectionsResult,
  GoogleMapsLatLngLiteral,
  GoogleMapsMap,
  GoogleMapsMarker,
  GoogleMapsMarkerConstructor,
} from "@/lib/google-maps/google-maps-types";

export type LiveDeliveryEndpoint = {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};

type LiveDeliveryJsMapProps = {
  pickup: LiveDeliveryEndpoint;
  drop: LiveDeliveryEndpoint;
  driver?: LiveDeliveryEndpoint | null;
  className?: string;
  heightClassName?: string;
  onUnavailable?: () => void;
};

function hasCoords(latitude?: number | null, longitude?: number | null): boolean {
  return (
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

function toLatLng(
  latitude?: number | null,
  longitude?: number | null,
): GoogleMapsLatLngLiteral | null {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  return { lat: latitude, lng: longitude };
}

async function resolveEndpointLatLng(
  endpoint: LiveDeliveryEndpoint,
): Promise<GoogleMapsLatLngLiteral | null> {
  const fromProps = toLatLng(endpoint.latitude, endpoint.longitude);
  if (fromProps) return fromProps;

  const address = endpoint.address.trim();
  if (!address) return null;

  const geocoded = await geocodeAddress(address);
  if (!geocoded) return null;
  return { lat: geocoded.latitude, lng: geocoded.longitude };
}

function placeMarker(
  Marker: GoogleMapsMarkerConstructor,
  map: GoogleMapsMap,
  position: GoogleMapsLatLngLiteral,
  label: string,
  title: string,
): GoogleMapsMarker {
  return new Marker({
    map,
    position,
    title,
    label: { text: label, color: "#ffffff", fontWeight: "700" },
  });
}

function routeDirections(
  service: {
    route: (
      request: {
        origin: GoogleMapsLatLngLiteral;
        destination: GoogleMapsLatLngLiteral;
        travelMode: string;
        region?: string;
      },
      callback: (result: GoogleMapsDirectionsResult | null, status: string) => void,
    ) => void;
  },
  request: {
    origin: GoogleMapsLatLngLiteral;
    destination: GoogleMapsLatLngLiteral;
    travelMode: string;
    region?: string;
  },
): Promise<GoogleMapsDirectionsResult | null> {
  return new Promise((resolve) => {
    service.route(request, (result, status) => {
      resolve(status === "OK" ? result : null);
    });
  });
}

function clearDirectionsRenderer(renderer: GoogleMapsDirectionsRenderer | null): void {
  if (!renderer) return;
  renderer.setMap(null);
}

export default function LiveDeliveryJsMap({
  pickup,
  drop,
  driver,
  className = "",
  heightClassName = "h-[min(55vh,480px)] w-full sm:h-[360px] md:h-[420px] lg:h-[480px]",
  onUnavailable,
}: LiveDeliveryJsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMapsMap | null>(null);
  const rendererRef = useRef<GoogleMapsDirectionsRenderer | null>(null);
  const pickupMarkerRef = useRef<GoogleMapsMarker | null>(null);
  const dropMarkerRef = useRef<GoogleMapsMarker | null>(null);
  const driverMarkerRef = useRef<GoogleMapsMarker | null>(null);
  const MarkerCtorRef = useRef<GoogleMapsMarkerConstructor | null>(null);
  const onUnavailableRef = useRef(onUnavailable);
  const [routeSummary, setRouteSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [markersOnly, setMarkersOnly] = useState(false);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  const pickupKey = `${pickup.latitude ?? ""},${pickup.longitude ?? ""},${pickup.address}`;
  const dropKey = `${drop.latitude ?? ""},${drop.longitude ?? ""},${drop.address}`;
  const driverKey =
    driver && hasCoords(driver.latitude, driver.longitude)
      ? `${driver.latitude},${driver.longitude}`
      : "";

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!containerRef.current) {
        setFailed(true);
        setLoading(false);
        onUnavailableRef.current?.();
        return;
      }

      setLoading(true);
      setFailed(false);
      setMarkersOnly(false);
      setRouteSummary(null);

      try {
        const [pickupPos, dropPos] = await Promise.all([
          resolveEndpointLatLng(pickup),
          resolveEndpointLatLng(drop),
        ]);

        if (cancelled || !containerRef.current) return;

        if (!pickupPos && !dropPos) {
          setFailed(true);
          setLoading(false);
          onUnavailableRef.current?.();
          return;
        }

        const bootstrap = await loadGoogleMaps();
        const mapsLib = await importMapsLibrary();
        const routesLib = await importRoutesLibrary();
        if (cancelled || !containerRef.current) return;

        const markerCtor =
          mapsLib.Marker ??
          (
            bootstrap.maps as typeof bootstrap.maps & {
              Marker?: GoogleMapsMarkerConstructor;
            }
          ).Marker;
        if (!markerCtor) {
          throw new Error("Google Maps Marker is unavailable.");
        }
        MarkerCtorRef.current = markerCtor;

        const mapCenter = pickupPos ?? dropPos ?? { lat: 28.6139, lng: 77.209 };

        if (!mapRef.current) {
          mapRef.current = new mapsLib.Map(containerRef.current, {
            center: mapCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            clickableIcons: false,
            gestureHandling: "greedy",
          });
        }

        const map = mapRef.current;

        clearDirectionsRenderer(rendererRef.current);
        rendererRef.current = null;

        pickupMarkerRef.current?.setMap(null);
        dropMarkerRef.current?.setMap(null);
        pickupMarkerRef.current = null;
        dropMarkerRef.current = null;

        let directions: GoogleMapsDirectionsResult | null = null;

        if (pickupPos && dropPos) {
          rendererRef.current = new routesLib.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#2563eb",
              strokeWeight: 5,
              strokeOpacity: 0.9,
            },
          });

          directions = await routeDirections(new routesLib.DirectionsService(), {
            origin: pickupPos,
            destination: dropPos,
            travelMode: routesLib.TravelMode.DRIVING,
            region: "in",
          });

          if (cancelled) return;

          if (directions?.routes?.[0]) {
            rendererRef.current.setDirections(directions);
            const leg = directions.routes[0]?.legs?.[0];
            const distance = leg?.distance?.text;
            const duration = leg?.duration?.text;
            if (distance && duration) {
              setRouteSummary(`${distance} · about ${duration} by road`);
            } else if (distance) {
              setRouteSummary(distance);
            }
          } else {
            clearDirectionsRenderer(rendererRef.current);
            rendererRef.current = null;
            setMarkersOnly(true);
            const bounds = new mapsLib.LatLngBounds();
            bounds.extend(pickupPos);
            bounds.extend(dropPos);
            map.fitBounds(bounds, 56);
          }
        } else {
          setMarkersOnly(true);
          map.setCenter(mapCenter);
          map.setZoom(14);
        }

        if (pickupPos) {
          pickupMarkerRef.current = placeMarker(
            markerCtor,
            map,
            pickupPos,
            "P",
            pickup.address || "Pickup",
          );
        }
        if (dropPos) {
          dropMarkerRef.current = placeMarker(
            markerCtor,
            map,
            dropPos,
            "D",
            drop.address || "Drop-off",
          );
        }

        setLoading(false);
      } catch {
        if (cancelled) return;
        setFailed(true);
        setLoading(false);
        onUnavailableRef.current?.();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by serialized endpoint values
  }, [pickupKey, dropKey]);

  useEffect(() => {
    const map = mapRef.current;
    const Marker = MarkerCtorRef.current;
    if (!map || !Marker) return;

    const driverPos = driver ? toLatLng(driver.latitude, driver.longitude) : null;

    if (!driverPos) {
      driverMarkerRef.current?.setMap(null);
      driverMarkerRef.current = null;
      return;
    }

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = placeMarker(
        Marker,
        map,
        driverPos,
        "V",
        "Delivery partner",
      );
    } else {
      driverMarkerRef.current.setPosition(driverPos);
      driverMarkerRef.current.setMap(map);
    }
  }, [driverKey, driver]);

  useEffect(() => {
    return () => {
      pickupMarkerRef.current?.setMap(null);
      dropMarkerRef.current?.setMap(null);
      driverMarkerRef.current?.setMap(null);
      clearDirectionsRenderer(rendererRef.current);
      rendererRef.current = null;
      mapRef.current = null;
    };
  }, []);

  if (failed) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface/60">
        <div ref={containerRef} className={heightClassName} />
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
            <p className="px-4 text-center text-small text-muted-foreground">
              Loading road route…
            </p>
          </div>
        ) : null}
      </div>
      {routeSummary ? (
        <p className="text-caption text-muted-foreground">
          Driving route: {routeSummary}
          {driverKey ? " · Live driver position shown as V" : ""}.
        </p>
      ) : markersOnly ? (
        <p className="text-caption text-muted-foreground">
          Showing pickup (P) and drop-off (D)
          {driverKey ? " with delivery partner (V)" : ""}. Road directions unavailable
          for this address pair — pin locations from suggestions when booking for an
          accurate route.
        </p>
      ) : (
        <p className="text-caption text-muted-foreground">
          Pickup (P) and drop-off (D)
          {driverKey ? "; delivery partner (V)" : ""}.
        </p>
      )}
    </div>
  );
}
