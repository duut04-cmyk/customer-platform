import { googleLogin } from "@/api/auth";
import { establishSession } from "@/auth/establishSession";

export async function completeGoogleLogin(
  credential: string,
  router: { push: (href: string) => void },
  redirectTo = "/dashboard",
) {
  const response = await googleLogin({ credential });
  establishSession(response.data, response.data.user);
  router.push(redirectTo);
}
