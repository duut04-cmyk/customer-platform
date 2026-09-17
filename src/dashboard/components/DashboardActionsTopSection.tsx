"use client";

import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";

export default function DashboardActionsTopSection() {
  return (
    <div className="bg-white">
      <div className="hidden xl:block">
        <div className="flex items-center justify-end">
          <AuthenticatedDesktopActions />
        </div>
      </div>

      <AuthenticatedMobilePageHeader />
    </div>
  );
}
