import { googleLogin } from "@/api/auth";
import { establishSession } from "@/auth/establishSession";

type AuthRouter = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

export async function completeGoogleLogin(
  credential: string,
  router: AuthRouter,
  redirectTo = "/dashboard",
  onAuthSuccess?: () => void,
) {
  const response = await googleLogin({ credential });
  establishSession(response.data, response.data.user);
  onAuthSuccess?.();
  router.replace(redirectTo);
}
