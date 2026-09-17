"use client";

import { useDashboardShell } from "./DashboardShellContext";
import { IconMenu } from "./icons";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

type DashboardMobileToolbarProps = {
  className?: string;
};

type DashboardNavMenuButtonProps = {
  className?: string;
};

export function DashboardNavMenuButton({
  className = "",
}: DashboardNavMenuButtonProps) {
  const { openMobileNav } = useDashboardShell();

  return (
    <button
      type="button"
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-[4px] border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      aria-label="Open navigation menu"
      onClick={openMobileNav}
    >
      <IconMenu />
    </button>
  );
}

export default function DashboardMobileToolbar({
  className = "",
}: DashboardMobileToolbarProps) {
  return (
    <div
      className={`-mx-4 -mt-4 flex items-center justify-between gap-2 px-4 pb-[9px] pt-[9px] md:-mx-6 md:px-6 ${className}`}
    >
      <DashboardNavMenuButton />

      <div className="flex items-center gap-0.5">
        <NotificationBell />
        <UserMenu compact />
      </div>
    </div>
  );
}

export function DashboardMobileSearchFallback() {
  return <div className="h-10 w-full rounded-[6px] border border-border bg-white" />;
}
