"use client";

import { Suspense, useMemo } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "./AuthenticatedPageHeader";
import { DashboardMobileSearchFallback } from "./DashboardMobileToolbar";
import DashboardSearch from "./DashboardSearch";
import { IconWave } from "./icons";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function firstNameFrom(fullName: string | undefined): string {
  const trimmed = fullName?.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? "there";
}

function GreetingBlock({ compact = false }: { compact?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const greeting = useMemo(() => getTimeGreeting(), []);
  const firstName = firstNameFrom(user?.name);

  return (
    <div className={compact ? undefined : "space-y-1"}>
      <h1
        className={`font-bold tracking-tight text-foreground ${
          compact
            ? "flex flex-col gap-0.5 text-[1.75rem] leading-tight"
            : "flex items-center gap-1.5 text-body-lg sm:text-heading"
        }`}
      >
        {compact ? (
          <>
            <span className="flex items-center gap-1.5">
              {greeting},
              <IconWave className="h-6 w-6 shrink-0" />
            </span>
            {firstName}
          </>
        ) : (
          <>
            {greeting}, {firstName}
            <IconWave className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          </>
        )}
      </h1>
      {!compact && (
        <p className="text-small text-muted-foreground sm:text-body">
          Here&apos;s what&apos;s happening with your deliveries today.
        </p>
      )}
    </div>
  );
}

export default function DashboardHomeTopSection() {
  return (
    <div className="bg-white">
      <div className="hidden space-y-4 xl:block">
        <div className="flex items-start justify-between gap-4">
          <GreetingBlock />
          <AuthenticatedDesktopActions />
        </div>

        <Suspense fallback={<DashboardMobileSearchFallback />}>
          <DashboardSearch variant="wide" className="max-w-xl" />
        </Suspense>
      </div>

      <AuthenticatedMobilePageHeader>
        <GreetingBlock compact />
      </AuthenticatedMobilePageHeader>
    </div>
  );
}
