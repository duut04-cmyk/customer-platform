import { importGeocodingLibrary } from "./load-google-maps";

export async function reverseGeocodeLatLng(
  latitude: number,
  longitude: number,
): Promise<string> {
  const { Geocoder } = await importGeocodingLibrary();
  const geocoder = new Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status !== "OK" || !results?.[0]?.formatted_address) {
          reject(new Error("Could not resolve this location to an address."));
          return;
        }
        resolve(results[0].formatted_address);
      },
    );
  });
}
