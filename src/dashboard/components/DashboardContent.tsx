"use client";

import { Suspense, useMemo, useState } from "react";
import { filterByDatePeriod, type DatePeriod } from "@/utils/datePeriods";
import { useDeliveriesList } from "@/deliveries/hooks/useDeliveriesList";
import {
  DASHBOARD_SIDEBAR_FULL_SPAN,
  DASHBOARD_SIDEBAR_STACK,
  DASHBOARD_TWO_COL_GRID,
} from "./layout";
import DashboardHomeTopSection from "./DashboardHomeTopSection";
import { DashboardStatsForPeriod } from "./DashboardStats";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import DeliveryNetworkCard from "./DeliveryNetworkCard";
import RecentDeliveries from "./RecentDeliveries";
import RecentDeliveriesSkeleton from "./RecentDeliveriesSkeleton";
import SafetyComplianceCard from "./SafetyComplianceCard";

function DashboardBody() {
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("last_7_days");
  const { deliveries, loading, error } = useDeliveriesList(100);

  const dateFiltered = useMemo(
    () => filterByDatePeriod(deliveries, datePeriod),
    [deliveries, datePeriod],
  );

  return (
    <div className="min-w-0 space-y-4 md:space-y-5 lg:space-y-5">
      <DashboardHomeTopSection />
      {loading && deliveries.length === 0 ? (
        <DashboardStatsSkeleton />
      ) : (
        <DashboardStatsForPeriod deliveries={dateFiltered} loading={loading} />
      )}

      <div className={`grid gap-4 xl:gap-5 ${DASHBOARD_TWO_COL_GRID}`}>
        <div className="min-w-0">
          {loading && deliveries.length === 0 ? (
            <RecentDeliveriesSkeleton />
          ) : (
            <RecentDeliveries
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

export default function DashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="min-w-0 space-y-4 md:space-y-5">
          <div className="space-y-2">
            <div className="h-8 w-56 animate-pulse rounded-md bg-surface" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-surface" />
          </div>
          <DashboardStatsSkeleton />
          <RecentDeliveriesSkeleton />
        </div>
      }
    >
      <DashboardBody />
    </Suspense>
  );
}
