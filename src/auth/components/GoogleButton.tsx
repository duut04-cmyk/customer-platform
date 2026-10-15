"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { completeGoogleLogin } from "@/auth/complete-google-login";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import {
  attachGlobalGoogleSignInHost,
  detachGlobalGoogleSignInHostToPark,
  getGoogleClientIdFromEnv,
  subscribeGoogleCredential,
} from "@/auth/google-identity";
import { GoogleIcon, LoadingSpinner } from "./icons";

type GoogleButtonProps = {
  disabled?: boolean;
  redirectTo?: string;
  onAuthSuccess?: () => void;
  onBusyChange?: (busy: boolean) => void;
};

export default function GoogleButton({
  disabled = false,
  redirectTo = "/dashboard",
  onAuthSuccess,
  onBusyChange,
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
        await completeGoogleLogin(credential, router, redirectTo, onAuthSuccess);
        toast.success("Signed in successfully.");
      } catch (cause) {
        toast.error(getAuthErrorMessage(cause, "Google sign-in failed."));
      } finally {
        signingInRef.current = false;
        setSigningIn(false);
      }
    },
    [onAuthSuccess, redirectTo, router],
  );

  const handleCredentialRef = useRef(handleCredential);

  useEffect(() => {
    handleCredentialRef.current = handleCredential;
  }, [handleCredential]);

  useEffect(() => {
    return subscribeGoogleCredential((credential) => {
      void handleCredentialRef.current(credential);
    });
  }, []);

  const canUseGoogle = Boolean(clientId) && !disabled;

  useLayoutEffect(() => {
    if (!canUseGoogle || !clientId) {
      return;
    }

    let cancelled = false;

    const container = overlayRef.current;
    if (!container) {
      return;
    }

    void attachGlobalGoogleSignInHost(
      container,
      Math.max(container.offsetWidth, 320),
      clientId,
    )
      .then(() => {
        if (cancelled) return;
        setSdkReady(true);
        setSdkError(false);
      })
      .catch(() => {
        if (!cancelled) {
          setSdkReady(false);
          setSdkError(true);
        }
      });

    return () => {
      cancelled = true;
      detachGlobalGoogleSignInHostToPark();
      setSdkReady(false);
      setSdkError(false);
    };
  }, [canUseGoogle, clientId]);

  const isLoadingSdk = canUseGoogle && !sdkReady && !sdkError;
  const isBusy = disabled || signingIn || isLoadingSdk;
  const showGoogleOverlay = canUseGoogle && sdkReady && !sdkError;

  useEffect(() => {
    onBusyChange?.(isBusy);
  }, [isBusy, onBusyChange]);

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
        className={
          showGoogleOverlay
            ? "pointer-events-none flex h-11 w-full items-center justify-center gap-2.5 rounded-[6px] border border-border bg-background text-small font-medium text-foreground sm:h-12 sm:text-body"
            : "flex h-11 w-full items-center justify-center gap-2.5 rounded-[6px] border border-border bg-background text-small font-medium text-foreground sm:h-12 sm:text-body"
        }
        aria-hidden={showGoogleOverlay}
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
            ? "absolute inset-0 z-[1] cursor-pointer overflow-hidden opacity-[0.011] [&_div]:!h-full [&_iframe]:!h-full [&_iframe]:!w-full"
            : "pointer-events-none absolute inset-0"
        }
        aria-label="Continue with Google"
      />

      {!showGoogleOverlay ? (
        <button
          type="button"
          className="absolute inset-0 z-[1] cursor-pointer rounded-[6px] disabled:cursor-not-allowed"
          onClick={handleFallbackClick}
          disabled={isBusy}
          aria-busy={signingIn || isLoadingSdk}
          aria-label="Continue with Google"
        />
      ) : null}
    </div>
  );
}

export { completeGoogleLogin } from "@/auth/complete-google-login";
