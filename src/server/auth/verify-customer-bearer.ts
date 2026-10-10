import "server-only";

import { getApiBaseUrl } from "@/config/env";

/** Matches backend GET /auth/me — `{ data: { user: { id, role, ... } } }`. */
type MeResponse = {
  success?: boolean;
  data?: {
    user?: {
      id: string;
      role?: string;
    };
  };
};

/** Validates Authorization bearer token against the backend and returns the customer user id. */
export async function verifyCustomerBearer(
  authorizationHeader: string | null,
): Promise<string | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authorizationHeader.slice("Bearer ".length).trim();
  if (!token) {
    return null;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as MeResponse;
  const user = body.data?.user;
  if (!user?.id || user.role !== "CUSTOMER") {
    return null;
  }

  return user.id;
}
