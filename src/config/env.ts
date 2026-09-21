let cachedApiBaseUrl: string | null = null;

/**
 * Returns the validated public API base URL (includes /api/v1).
 * Throws when missing — call sites should invoke this at request time, not import time.
 */
export function getApiBaseUrl(): string {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is required (e.g. http://localhost:5000/api/v1).",
    );
  }

  cachedApiBaseUrl = value.replace(/\/+$/, "");
  return cachedApiBaseUrl;
}

/** @deprecated Prefer getApiBaseUrl() for lazy validation. */
export const env = {
  get apiBaseUrl() {
    return getApiBaseUrl();
  },
} as const;
