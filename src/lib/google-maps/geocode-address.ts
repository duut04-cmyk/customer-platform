import { importGeocodingLibrary } from "./load-google-maps";

export type GeocodedPoint = {
  latitude: number;
  longitude: number;
};

function withIndiaBias(address: string): string {
  if (/\bindia\b/i.test(address)) {
    return address;
  }
  return `${address}, India`;
}

export async function geocodeAddress(address: string): Promise<GeocodedPoint | null> {
  const trimmed = address.trim();
  if (!trimmed) {
    return null;
  }

  const { Geocoder } = await importGeocodingLibrary();
  const geocoder = new Geocoder();
  const query = withIndiaBias(trimmed);

  return new Promise((resolve) => {
    geocoder.geocode({ address: query, region: "IN" }, (results, status) => {
      if (status !== "OK" || !results?.[0]?.geometry?.location) {
        resolve(null);
        return;
      }
      const location = results[0].geometry.location;
      resolve({
        latitude: location.lat(),
        longitude: location.lng(),
      });
    });
  });
}
