"use client";

import { useDashboardShell } from "@/dashboard/components/DashboardShellContext";
import { IconMenu } from "@/dashboard/components/icons";
import NotificationBell from "@/dashboard/components/NotificationBell";
import UserMenu from "@/dashboard/components/UserMenu";
import CreateDeliveryHeader from "./CreateDeliveryHeader";

type CreateDeliveryPageTopSectionProps = {
  showHeader?: boolean;
};

export default function CreateDeliveryPageTopSection({
  showHeader = true,
}: CreateDeliveryPageTopSectionProps) {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-4">
          {showHeader ? <CreateDeliveryHeader /> : <div />}
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 lg:hidden">
        {showHeader ? <CreateDeliveryHeader /> : null}

        <div className="flex items-center gap-3">
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
    </div>
  );
}
