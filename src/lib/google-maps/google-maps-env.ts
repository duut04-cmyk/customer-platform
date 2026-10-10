export function getGoogleMapsApiKey(): string | null {
  const value = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return value || null;
}

export function isGoogleMapsEnabled(): boolean {
  return Boolean(getGoogleMapsApiKey());
}
