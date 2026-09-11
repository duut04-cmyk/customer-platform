"use client";

import { useDashboardShell } from "@/dashboard/components/DashboardShellContext";
import { IconMenu } from "@/dashboard/components/icons";
import NotificationBell from "@/dashboard/components/NotificationBell";
import UserMenu from "@/dashboard/components/UserMenu";

export default function DashboardActionsTopSection() {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      <div className="hidden items-center justify-end gap-2 lg:flex">
        <NotificationBell />
        <UserMenu />
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

        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <UserMenu compact />
        </div>
      </div>
    </div>
  );
}
