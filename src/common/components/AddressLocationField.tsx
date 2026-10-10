"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { toast } from "sonner";
import Input from "@/common/components/Input";
import { IconMapPinFilled } from "@/dashboard/components/icons";
import { isGoogleMapsEnabled } from "@/lib/google-maps/google-maps-env";
import {
  importPlacesLibrary,
  loadGoogleMaps,
} from "@/lib/google-maps/load-google-maps";
import type {
  GoogleMapsPlaceAutocompleteElement,
  GoogleMapsPlaceSelectEvent,
} from "@/lib/google-maps/google-maps-types";
import {
  DeviceLocationError,
  requestDeviceLocation,
} from "@/lib/geolocation/request-device-location";
import { reverseGeocodeLatLng } from "@/lib/google-maps/reverse-geocode";

export type AddressLocationValue = {
  address: string;
  latitude: number | null;
  longitude: number | null;
};

type AddressLocationFieldProps = {
  id: string;
  placeholder: string;
  value: AddressLocationValue;
  onChange: (value: AddressLocationValue) => void;
  error?: string;
  label?: string;
  hideLabel?: boolean;
  /** Grey routing hint beside “Use my current location” (off on create-delivery mock). */
  showRoutingHint?: boolean;
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-small font-medium text-foreground"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-caption text-red-600" role="alert">
      {message}
    </p>
  );
}

export default function AddressLocationField({
  id,
  label,
  hideLabel = false,
  placeholder,
  value,
  onChange,
  error,
  showRoutingHint = false,
}: AddressLocationFieldProps) {
  const widgetHostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<GoogleMapsPlaceAutocompleteElement | null>(null);
  const onChangeRef = useRef(onChange);
  const [locating, setLocating] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const mapsDisabledHintId = useId();
  const mapsEnabled = isGoogleMapsEnabled();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!mapsEnabled) {
      return;
    }

    let cancelled = false;
    const hostElement = widgetHostRef.current;

    void (async () => {
      try {
        await loadGoogleMaps();
        const { PlaceAutocompleteElement } = await importPlacesLibrary();
        if (cancelled || !widgetHostRef.current) {
          return;
        }

        const widget = new PlaceAutocompleteElement({
          componentRestrictions: { country: "in" },
        });
        widget.id = id;
        widget.placeholder = placeholder;
        widget.className = "doot-place-autocomplete";
        widget.setAttribute("no-input-icon", "");
        widget.value = value.address;

        widget.addEventListener("gmp-select", (rawEvent) => {
          void (async () => {
            const event = rawEvent as GoogleMapsPlaceSelectEvent;
            try {
              const place = event.placePrediction.toPlace();
              await place.fetchFields({
                fields: ["formattedAddress", "displayName", "location"],
              });
              const location = place.location;
              if (!location) {
                return;
              }
              const address =
                place.formattedAddress?.trim() ||
                place.displayName?.trim() ||
                widget.value.trim() ||
                "";

              onChangeRef.current({
                address,
                latitude: location.lat(),
                longitude: location.lng(),
              });
            } catch {
              toast.error("Could not read the selected place.");
            }
          })();
        });

        widget.addEventListener("input", () => {
          onChangeRef.current({
            address: widget.value,
            latitude: null,
            longitude: null,
          });
        });

        widgetHostRef.current.replaceChildren(widget);
        widgetRef.current = widget;
        setWidgetReady(true);
      } catch {
        setWidgetReady(false);
      }
    })();

    return () => {
      cancelled = true;
      widgetRef.current = null;
      setWidgetReady(false);
      hostElement?.replaceChildren();
    };
    // Mount once per field id; placeholder/error sync in separate effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- value.address synced below
  }, [mapsEnabled, id]);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) {
      return;
    }
    widget.placeholder = placeholder;
    widget.setAttribute("aria-invalid", error ? "true" : "false");
  }, [placeholder, error]);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget || !widgetReady) {
      return;
    }
    if (widget.value !== value.address) {
      widget.value = value.address;
    }
  }, [value.address, widgetReady]);

  const handleAddressInput = useCallback(
    (nextAddress: string) => {
      onChange({
        address: nextAddress,
        latitude: null,
        longitude: null,
      });
    },
    [onChange],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true);
    try {
      const coords = await requestDeviceLocation({
        onAwaitingPermission: () => {
          toast.info(
            "Allow location access in your browser prompt to pin this address.",
          );
        },
        onPermissionPreviouslyDenied: () => {
          toast.info(
            "Location was blocked earlier. Allow Location for this site in your browser settings, then try again.",
          );
        },
      });

      const latitude = coords.latitude;
      const longitude = coords.longitude;
      let address: string;
      if (mapsEnabled) {
        try {
          address = await reverseGeocodeLatLng(latitude, longitude);
        } catch {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          toast.info("Could not resolve a street address; using coordinates instead.");
        }
      } else {
        address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        toast.info(
          "Location pinned. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to resolve GPS to a street address.",
        );
      }

      onChange({ address, latitude, longitude });
    } catch (cause) {
      const message =
        cause instanceof DeviceLocationError
          ? cause.message
          : cause instanceof Error
            ? cause.message
            : "Could not use your current location.";
      toast.error(message);
    } finally {
      setLocating(false);
    }
  }, [mapsEnabled, onChange]);

  const showPlacesWidget = mapsEnabled && widgetReady;
  const showFieldLabel = !hideLabel && Boolean(label?.trim());
  const showMapsDisabledHint = !mapsEnabled;

  return (
    <div className="space-y-1.5">
      {showFieldLabel ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <div className="relative h-10">
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground md:left-4">
          <IconMapPinFilled className="h-4 w-4" />
        </span>
        <div
          ref={widgetHostRef}
          className={`doot-place-autocomplete-host ${showPlacesWidget ? "" : "hidden"}`}
          data-testid={`${id}-autocomplete-host`}
        />
        {!showPlacesWidget ? (
          <Input
            id={id}
            name={id}
            placeholder={placeholder}
            value={value.address}
            onChange={(e) => handleAddressInput(e.target.value)}
            error={!!error}
            className="rounded-[6px]! pl-10!"
            autoComplete="street-address"
            aria-describedby={showMapsDisabledHint ? mapsDisabledHintId : undefined}
          />
        ) : null}
      </div>

      <button
        type="button"
        disabled={locating}
        onClick={() => void handleUseCurrentLocation()}
        className="inline-flex cursor-pointer items-center gap-1.5 text-caption font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaLocationCrosshairs className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {locating ? "Getting location…" : "Use my current location"}
      </button>

      {showRoutingHint && mapsEnabled ? (
        <p className="text-caption text-muted-foreground">
          Pick a suggested address or use current location for accurate routing.
        </p>
      ) : null}

      {showMapsDisabledHint ? (
        <p id={mapsDisabledHintId} className="text-caption text-muted-foreground">
          Enter address manually, or set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for
          autocomplete.
        </p>
      ) : null}

      <FieldError message={error} />
    </div>
  );
}
