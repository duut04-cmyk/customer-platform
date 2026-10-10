export class DeviceLocationError extends Error {
  constructor(
    message: string,
    readonly code: "unsupported" | "blocked" | "denied" | "unavailable" | "timeout",
  ) {
    super(message);
    this.name = "DeviceLocationError";
  }
}

const PERMISSION_BLOCKED_MESSAGE =
  "Location is blocked for this site. Use the lock or site icon in your browser address bar, allow Location access for localhost, then try again.";

async function readGeolocationPermission(): Promise<PermissionState | null> {
  if (!navigator.permissions?.query) {
    return null;
  }
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state;
  } catch {
    return null;
  }
}

export async function requestDeviceLocation(options?: {
  onAwaitingPermission?: () => void;
  onPermissionPreviouslyDenied?: () => void;
}): Promise<GeolocationCoordinates> {
  if (!navigator.geolocation) {
    throw new DeviceLocationError(
      "Your browser does not support location access.",
      "unsupported",
    );
  }

  const permission = await readGeolocationPermission();
  if (permission === "prompt") {
    options?.onAwaitingPermission?.();
  } else if (permission === "denied") {
    options?.onPermissionPreviouslyDenied?.();
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new DeviceLocationError(
              permission === "denied"
                ? PERMISSION_BLOCKED_MESSAGE
                : "Location permission was denied. Allow location for this site in browser settings and try again.",
              permission === "denied" ? "blocked" : "denied",
            ),
          );
          return;
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(
            new DeviceLocationError(
              "Your device could not determine a location. Check that location services are enabled.",
              "unavailable",
            ),
          );
          return;
        }
        if (error.code === error.TIMEOUT) {
          reject(
            new DeviceLocationError(
              "Finding your location took too long. Try again near a window or with Wi‑Fi enabled.",
              "timeout",
            ),
          );
          return;
        }
        reject(
          new DeviceLocationError(
            "Could not use your current location.",
            "unavailable",
          ),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 60_000,
      },
    );
  });
}
