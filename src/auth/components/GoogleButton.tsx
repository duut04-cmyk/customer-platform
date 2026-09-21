"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { completeGoogleLogin } from "@/auth/complete-google-login";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import {
  getGoogleClientIdFromEnv,
  initializeGoogleIdentity,
  renderGoogleSignInButton,
} from "@/auth/google-identity";
import { GoogleIcon, LoadingSpinner } from "./icons";

type GoogleButtonProps = {
  disabled?: boolean;
  redirectTo?: string;
};

export default function GoogleButton({
  disabled = false,
  redirectTo = "/dashboard",
}: GoogleButtonProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const signingInRef = useRef(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const clientId = getGoogleClientIdFromEnv();

  const handleCredential = useCallback(
    async (credential: string) => {
      if (signingInRef.current) return;

      signingInRef.current = true;
      setSigningIn(true);
      try {
        await completeGoogleLogin(credential, router, redirectTo);
        toast.success("Signed in successfully.");
      } catch (cause) {
        toast.error(getAuthErrorMessage(cause, "Google sign-in failed."));
      } finally {
        signingInRef.current = false;
        setSigningIn(false);
      }
    },
    [redirectTo, router],
  );

  const canUseGoogle = Boolean(clientId) && !disabled;

  useEffect(() => {
    if (!canUseGoogle || !clientId) {
      return;
    }

    let cancelled = false;
    const container = overlayRef.current;

    initializeGoogleIdentity({
      clientId,
      onCredential: (credential) => {
        void handleCredential(credential);
      },
    })
      .then(() => {
        if (cancelled || !overlayRef.current) return;

        const width = overlayRef.current.offsetWidth || 400;
        renderGoogleSignInButton(overlayRef.current, { width });
        setSdkReady(true);
        setSdkError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setSdkReady(false);
          setSdkError(true);
          overlayRef.current?.replaceChildren();
        }
      });

    return () => {
      cancelled = true;
      container?.replaceChildren();
      setSdkReady(false);
      setSdkError(false);
    };
  }, [canUseGoogle, clientId, handleCredential]);

  const isLoadingSdk = canUseGoogle && !sdkReady && !sdkError;
  const isBusy = disabled || signingIn || isLoadingSdk;
  const showGoogleOverlay = canUseGoogle && sdkReady && !sdkError;

  const handleFallbackClick = () => {
    if (isBusy || showGoogleOverlay) return;

    if (!clientId) {
      toast.error(
        "Google sign-in is not configured yet. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
      );
      return;
    }

    toast.error("Google sign-in failed to load. Refresh and try again.");
  };

  return (
    <div className="relative h-11 w-full sm:h-12">
      <div
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[6px] border border-border bg-background text-small font-medium text-foreground sm:h-12 sm:text-body"
        aria-hidden
      >
        {signingIn || isLoadingSdk ? (
          <>
            <LoadingSpinner />
            {signingIn ? "Signing in..." : "Loading Google..."}
          </>
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </div>

      <div
        ref={overlayRef}
        className={
          showGoogleOverlay
            ? "absolute inset-0 overflow-hidden opacity-[0.011] [&_div]:!h-full [&_iframe]:!h-full [&_iframe]:!w-full"
            : "pointer-events-none absolute inset-0"
        }
        aria-label="Continue with Google"
      />

      {!showGoogleOverlay ? (
        <button
          type="button"
          className="absolute inset-0 cursor-pointer rounded-[6px] disabled:cursor-not-allowed"
          onClick={handleFallbackClick}
          disabled={isBusy}
          aria-busy={signingIn}
          aria-label="Continue with Google"
        />
      ) : null}
    </div>
  );
}

export { completeGoogleLogin } from "@/auth/complete-google-login";
