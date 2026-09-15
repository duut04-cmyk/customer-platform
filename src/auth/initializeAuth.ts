import { getCurrentUser, refreshSession } from "@/api/auth";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

let initializePromise: Promise<void> | null = null;

async function loadCurrentUser() {
  const response = await getCurrentUser();
  useAuthStore.getState().setUser(response.data.user);
}

async function refreshAndLoadUser() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await refreshSession({ refreshToken });
  setSessionTokens(response.data);
  await loadCurrentUser();
}

export async function initializeAuth(): Promise<void> {
  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    const store = useAuthStore.getState();
    store.setInitializing(true);
    store.setError(null);

    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        store.reset();
        clearSession();
        return;
      }

      if (accessToken) {
        await loadCurrentUser();
        return;
      }

      await refreshAndLoadUser();
    } catch {
      clearSession();
      store.reset();
    } finally {
      useAuthStore.getState().setInitializing(false);
    }
  })();

  try {
    await initializePromise;
  } finally {
    initializePromise = null;
  }
}

/** Test helper — resets single-flight initialization state. */
export function resetAuthInitializationForTests() {
  initializePromise = null;
}
