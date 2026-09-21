import { logout } from "@/api/auth";
import { clearSession, getRefreshToken } from "@/auth/session";
import { useAuthStore } from "@/stores/auth.store";

type RouterLike = {
  replace: (href: string) => void;
};

export async function performLogout(router?: RouterLike) {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await logout({ refreshToken });
    }
  } catch {
    // Logout must clear local session even when the backend call fails.
  } finally {
    clearSession();
    useAuthStore.getState().reset();
    router?.replace("/");
  }
}
