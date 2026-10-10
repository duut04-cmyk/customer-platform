"use client";

import { Suspense, useMemo, useState } from "react";
import { DashboardStatsForDeliveries } from "@/dashboard/components/DashboardStats";
import DashboardStatsSkeleton from "@/dashboard/components/DashboardStatsSkeleton";
import DeliveryNetworkCard from "@/dashboard/components/DeliveryNetworkCard";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import {
  DASHBOARD_SIDEBAR_FULL_SPAN,
  DASHBOARD_SIDEBAR_STACK,
  DASHBOARD_TWO_COL_GRID,
} from "@/dashboard/components/layout";
import { filterByDatePeriod, type DatePeriod } from "@/utils/datePeriods";
import { useDeliveriesList } from "../hooks/useDeliveriesList";
import DeliveriesHistoryPanel from "./DeliveriesHistoryPanel";
import DeliveriesListSkeleton from "./DeliveriesListSkeleton";
import DeliveriesPageTopSection from "./DeliveriesPageTopSection";

function DeliveriesHistoryBody() {
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("last_7_days");
  const { deliveries, loading, error } = useDeliveriesList(100);

  const dateFiltered = useMemo(
    () => filterByDatePeriod(deliveries, datePeriod),
    [deliveries, datePeriod],
  );

  const showInitialSkeleton = loading && deliveries.length === 0;

  return (
    <div className="min-w-0 space-y-4 lg:space-y-5">
      <DeliveriesPageTopSection />
      {showInitialSkeleton ? (
        <DashboardStatsSkeleton />
      ) : (
        <DashboardStatsForDeliveries deliveries={dateFiltered} />
      )}

      <div className={`grid gap-4 xl:gap-5 ${DASHBOARD_TWO_COL_GRID}`}>
        <div className="min-w-0">
          {showInitialSkeleton ? (
            <DeliveriesListSkeleton />
          ) : (
            <DeliveriesHistoryPanel
              deliveries={deliveries}
              datePeriod={datePeriod}
              onDatePeriodChange={setDatePeriod}
              loading={loading}
              error={error}
            />
          )}
        </div>

        <aside className={DASHBOARD_SIDEBAR_STACK}>
          <DeliveryNetworkCard />
          <SafetyComplianceCard className={DASHBOARD_SIDEBAR_FULL_SPAN} />
        </aside>
      </div>
    </div>
  );
}

export default function DeliveriesHistoryContent() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-surface" />
          <DashboardStatsSkeleton />
          <DeliveriesListSkeleton />
        </div>
      }
    >
      <DeliveriesHistoryBody />
    </Suspense>
  );
}
