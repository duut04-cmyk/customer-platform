"use client";

import { Suspense } from "react";
import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "./AuthenticatedPageHeader";
import { DashboardMobileSearchFallback } from "./DashboardMobileToolbar";
import DashboardSearch from "./DashboardSearch";

export default function DashboardInPageTopSection() {
  return (
    <div className="bg-white">
      <div className="hidden items-center justify-between gap-4 xl:flex">
        <Suspense fallback={<DashboardMobileSearchFallback />}>
          <DashboardSearch variant="wide" className="max-w-xl min-w-0 flex-1" />
        </Suspense>
        <AuthenticatedDesktopActions />
      </div>

      <AuthenticatedMobilePageHeader />
    </div>
  );
}
