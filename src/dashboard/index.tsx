import { Suspense } from "react";
import DashboardHomeTopSection from "./components/DashboardHomeTopSection";
import DashboardStats from "./components/DashboardStats";
import DeliveryNetworkCard from "./components/DeliveryNetworkCard";
import DeliveryPerformanceCard from "./components/DeliveryPerformanceCard";
import RecentDeliveries from "./components/RecentDeliveries";
import SafetyComplianceCard from "./components/SafetyComplianceCard";
import {
  DASHBOARD_MAIN,
  DASHBOARD_SIDEBAR_FULL_SPAN,
  DASHBOARD_SIDEBAR_STACK,
  DASHBOARD_TWO_COL_GRID,
} from "./components/layout";

export default function Dashboard() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="min-w-0 space-y-4 md:space-y-5 lg:space-y-5">
        <DashboardHomeTopSection />
        <DashboardStats />

        <div className={`grid gap-4 xl:gap-5 ${DASHBOARD_TWO_COL_GRID}`}>
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
              }
            >
              <RecentDeliveries />
            </Suspense>
          </div>

          <aside className={DASHBOARD_SIDEBAR_STACK}>
            <DeliveryNetworkCard />
            <DeliveryPerformanceCard />
            <SafetyComplianceCard className={DASHBOARD_SIDEBAR_FULL_SPAN} />
          </aside>
        </div>
      </div>
    </main>
  );
}
