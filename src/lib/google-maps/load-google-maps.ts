import { getGoogleMapsApiKey } from "./google-maps-env";
import {
  readGoogleMapsBootstrap,
  type GoogleMapsBootstrap,
  type GoogleMapsGeocodingLibrary,
  type GoogleMapsMapsLibrary,
  type GoogleMapsPlacesLibrary,
  type GoogleMapsRoutesLibrary,
} from "./google-maps-types";

const SCRIPT_ID = "google-maps-js";

let loadPromise: Promise<GoogleMapsBootstrap> | null = null;

function waitForGoogleMapsBootstrap(): Promise<GoogleMapsBootstrap> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const bootstrap = readGoogleMapsBootstrap();
      if (bootstrap) {
        resolve(bootstrap);
        return;
      }
      if (Date.now() - started > 15_000) {
        reject(new Error("Google Maps failed to initialize."));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

export async function loadGoogleMaps(): Promise<GoogleMapsBootstrap> {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only load in the browser.");
  }

  const existing = readGoogleMapsBootstrap();
  if (existing) {
    return existing;
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured.");
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      void waitForGoogleMapsBootstrap().then(resolve).catch(reject);
      return;
    }

    const callbackName = `__dootMapsInit_${Date.now()}`;
    const win = window as unknown as Record<string, () => void>;

    win[callbackName] = () => {
      delete win[callbackName];
      void waitForGoogleMapsBootstrap().then(resolve).catch(reject);
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&libraries=places&callback=${callbackName}`;
    script.onerror = () => {
      loadPromise = null;
      delete win[callbackName];
      reject(new Error("Failed to load Google Maps JavaScript API."));
    };
    document.head.appendChild(script);
  });

  try {
    return await loadPromise;
  } catch (error) {
    loadPromise = null;
    throw error;
  }
}

export async function importPlacesLibrary(): Promise<GoogleMapsPlacesLibrary> {
  const bootstrap = await loadGoogleMaps();
  return (await bootstrap.maps.importLibrary("places")) as GoogleMapsPlacesLibrary;
}

export async function importGeocodingLibrary(): Promise<GoogleMapsGeocodingLibrary> {
  const bootstrap = await loadGoogleMaps();
  return (await bootstrap.maps.importLibrary(
    "geocoding",
  )) as GoogleMapsGeocodingLibrary;
}

export async function importMapsLibrary(): Promise<GoogleMapsMapsLibrary> {
  const bootstrap = await loadGoogleMaps();
  return (await bootstrap.maps.importLibrary("maps")) as GoogleMapsMapsLibrary;
}

export async function importRoutesLibrary(): Promise<GoogleMapsRoutesLibrary> {
  const bootstrap = await loadGoogleMaps();
  return (await bootstrap.maps.importLibrary("routes")) as GoogleMapsRoutesLibrary;
}

/** @internal Resets loader state for tests. */
export function resetGoogleMapsLoaderForTests(): void {
  loadPromise = null;
}
