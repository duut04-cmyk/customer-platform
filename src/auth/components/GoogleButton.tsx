"use client";

import { useState } from "react";
import { toast } from "sonner";
import { googleLogin } from "@/api/auth";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import { establishSession } from "@/auth/establishSession";
import Button from "@/common/components/Button";
import { GoogleIcon, LoadingSpinner } from "./icons";

type GoogleButtonProps = {
  disabled?: boolean;
  redirectTo?: string;
};

function getGoogleClientId(): string | null {
  const value = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return value || null;
}

export default function GoogleButton({
  disabled = false,
  redirectTo: _redirectTo = "/dashboard",
}: GoogleButtonProps) {
  void _redirectTo;
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;

    const clientId = getGoogleClientId();
    if (!clientId) {
      toast.error(
        "Google sign-in is not configured yet. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
      );
      return;
    }

    setLoading(true);
    try {
      // Integration boundary: Google Identity Services SDK is not installed yet.
      // When configured, obtain a credential JWT and pass it to googleLogin().
      void clientId;
      toast.error(
        "Google sign-in SDK is not integrated yet. Use email and password for now.",
      );
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Google sign-in failed."));
    } finally {
      setLoading(false);
    }
  };

  const loadingLabel = "Connecting...";

  return (
    <Button
      type="button"
      variant="secondary"
      className="h-12 w-full gap-2.5 rounded-[6px] text-body font-medium"
      onClick={handleClick}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {loadingLabel}
        </>
      ) : (
        <>
          <GoogleIcon />
          Continue with Google
        </>
      )}
    </Button>
  );
}

/** Called by future Google SDK callback once credential is available. */
export async function completeGoogleLogin(
  credential: string,
  router: { push: (href: string) => void },
  redirectTo = "/dashboard",
) {
  const response = await googleLogin({ credential });
  establishSession(response.data, response.data.user);
  router.push(redirectTo);
}
