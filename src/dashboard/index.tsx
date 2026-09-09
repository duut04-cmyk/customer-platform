import { Suspense } from "react";
import DashboardHomeTopSection from "./components/DashboardHomeTopSection";
import DashboardStats from "./components/DashboardStats";
import DeliveryNetworkCard from "./components/DeliveryNetworkCard";
import DeliveryPerformanceCard from "./components/DeliveryPerformanceCard";
import RecentDeliveries from "./components/RecentDeliveries";
import SafetyComplianceCard from "./components/SafetyComplianceCard";
import { DASHBOARD_MAIN } from "./components/layout";

export default function Dashboard() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <DashboardHomeTopSection />
        <DashboardStats />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
            }
          >
            <RecentDeliveries />
          </Suspense>

          <aside className="flex flex-col gap-4">
            <DeliveryNetworkCard />
            <DeliveryPerformanceCard />
            <SafetyComplianceCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
