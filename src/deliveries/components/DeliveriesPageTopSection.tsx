"use client";

import { Suspense } from "react";
import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";
import { DashboardMobileSearchFallback } from "@/dashboard/components/DashboardMobileToolbar";
import DashboardSearch from "@/dashboard/components/DashboardSearch";
import DeliveriesHeader from "./DeliveriesHeader";

export default function DeliveriesPageTopSection() {
  return (
    <div className="bg-white">
      <div className="hidden space-y-4 xl:block">
        <div className="flex items-start justify-between gap-4">
          <DeliveriesHeader />
          <AuthenticatedDesktopActions />
        </div>

        <Suspense fallback={<DashboardMobileSearchFallback />}>
          <DashboardSearch variant="wide" className="max-w-xl" />
        </Suspense>
      </div>

      <AuthenticatedMobilePageHeader contentClassName="space-y-4">
        <DeliveriesHeader />
        <Suspense fallback={<DashboardMobileSearchFallback />}>
          <DashboardSearch variant="wide" className="max-w-xl" />
        </Suspense>
      </AuthenticatedMobilePageHeader>
    </div>
  );
}
