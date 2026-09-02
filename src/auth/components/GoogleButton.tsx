"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/common/components/Button";
import { mockGoogleAuth } from "@/auth/mockAuth";
import { GoogleIcon, LoadingSpinner } from "./icons";

type GoogleButtonProps = {
  disabled?: boolean;
};

export default function GoogleButton({ disabled = false }: GoogleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await mockGoogleAuth(router);
    } finally {
      setLoading(false);
    }
  };

  const loadingLabel = "Connecting...";

  return (
    <Button
      type="button"
      variant="secondary"
      className="h-11 w-full gap-2.5 text-body font-medium"
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
