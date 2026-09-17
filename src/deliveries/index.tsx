import { Suspense } from "react";
import DashboardStats from "@/dashboard/components/DashboardStats";
import DeliveryNetworkCard from "@/dashboard/components/DeliveryNetworkCard";
import DeliveryPerformanceCard from "@/dashboard/components/DeliveryPerformanceCard";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import {
  DASHBOARD_MAIN,
  DASHBOARD_SIDEBAR_FULL_SPAN,
  DASHBOARD_SIDEBAR_STACK,
  DASHBOARD_TWO_COL_GRID,
} from "@/dashboard/components/layout";
import DeliveriesHistoryPanel from "./components/DeliveriesHistoryPanel";
import DeliveriesPageTopSection from "./components/DeliveriesPageTopSection";

export default function DeliveriesHistory() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="min-w-0 space-y-4 lg:space-y-5">
        <DeliveriesPageTopSection />
        <DashboardStats variant="deliveries" />

        <div className={`grid gap-4 xl:gap-5 ${DASHBOARD_TWO_COL_GRID}`}>
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
              }
            >
              <DeliveriesHistoryPanel />
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
