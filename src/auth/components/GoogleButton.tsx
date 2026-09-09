"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/common/components/Button";
import { mockGoogleAuth } from "@/auth/mockAuth";
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
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await mockGoogleAuth(router, redirectTo);
    } finally {
      setLoading(false);
    }
  };

  const loadingLabel = "Connecting...";

  return (
    <Button
      type="button"
      variant="secondary"
      className="h-12 w-full gap-2.5 text-body font-medium"
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
