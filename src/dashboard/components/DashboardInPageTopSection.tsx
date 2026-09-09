"use client";

import { Suspense } from "react";
import DashboardSearch from "@/dashboard/components/DashboardSearch";
import { useDashboardShell } from "@/dashboard/components/DashboardShellContext";
import { IconMenu } from "@/dashboard/components/icons";
import NotificationBell from "@/dashboard/components/NotificationBell";
import UserMenu from "@/dashboard/components/UserMenu";

export default function DashboardInPageTopSection() {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      <div className="hidden items-center justify-between gap-4 lg:flex">
        <Suspense
          fallback={
            <div className="h-10 w-full max-w-xl rounded-[4px] border border-border bg-white" />
          }
        >
          <DashboardSearch variant="wide" className="max-w-xl" />
        </Suspense>

        <div className="flex shrink-0 items-center gap-2">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          className="rounded-[4px] p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
          aria-label="Open navigation menu"
          onClick={openMobileNav}
        >
          <IconMenu />
        </button>

        <Suspense
          fallback={
            <div className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-white" />
          }
        >
          <DashboardSearch variant="flex" />
        </Suspense>

        <NotificationBell />
        <UserMenu compact />
      </div>
    </div>
  );
}
