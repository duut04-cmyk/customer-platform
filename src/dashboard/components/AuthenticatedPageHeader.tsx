"use client";

import type { ReactNode } from "react";
import DashboardMobileToolbar from "./DashboardMobileToolbar";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

/** Desktop notification + user menu cluster for authenticated pages */
export function AuthenticatedDesktopActions() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <NotificationBell />
      <UserMenu />
    </div>
  );
}

type AuthenticatedMobilePageHeaderProps = {
  children?: ReactNode;
  className?: string;
  /** Stack spacing for content rendered below the toolbar row */
  contentClassName?: string;
};

/**
 * Shared mobile/tablet (< xl) header: bordered hamburger toolbar on top,
 * optional page content stacked below — same on phone, tablet portrait, and tablet landscape.
 */
export function AuthenticatedMobilePageHeader({
  children,
  className = "",
  contentClassName = "space-y-3",
}: AuthenticatedMobilePageHeaderProps) {
  return (
    <div className={`xl:hidden ${className}`}>
      <DashboardMobileToolbar />
      {children ? <div className={contentClassName}>{children}</div> : null}
    </div>
  );
}
