"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardShell from "@/dashboard/components/DashboardShell";
import { useAuthStore } from "@/stores/auth.store";
import PrivateAuthLoadingSkeleton from "./PrivateAuthLoadingSkeleton";

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
      <DashboardShell>
        <PrivateAuthLoadingSkeleton />
      </DashboardShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
