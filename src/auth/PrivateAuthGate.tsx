"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

type PrivateAuthGateProps = {
  children: React.ReactNode;
};

export default function PrivateAuthGate({ children }: PrivateAuthGateProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    if (isInitializing || isAuthenticated) return;
    router.replace("/");
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-small text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
