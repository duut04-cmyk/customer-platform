import { Suspense } from "react";
import DashboardStats from "@/dashboard/components/DashboardStats";
import DeliveryNetworkCard from "@/dashboard/components/DeliveryNetworkCard";
import DeliveryPerformanceCard from "@/dashboard/components/DeliveryPerformanceCard";
import SafetyComplianceCard from "@/dashboard/components/SafetyComplianceCard";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import DeliveriesHeader from "./components/DeliveriesHeader";
import DeliveriesHistoryPanel from "./components/DeliveriesHistoryPanel";
import DeliveriesPageTopSection from "./components/DeliveriesPageTopSection";

export default function DeliveriesHistory() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-4 lg:space-y-5">
        <DeliveriesPageTopSection />
        <DeliveriesHeader />
        <DashboardStats variant="deliveries" />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
            }
          >
            <DeliveriesHistoryPanel />
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
