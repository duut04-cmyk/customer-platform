"use client";

import { useMemo, useState } from "react";
import DashboardHeader from "@/dashboard/components/DashboardHeader";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import { filterDeliveries, MOCK_DELIVERIES } from "./mockDeliveries";
import type { DeliveryFilter } from "./types";
import DeliveriesHeader from "./components/DeliveriesHeader";
import DeliveryFilters from "./components/DeliveryFilters";
import DeliveryList from "./components/DeliveryList";

export default function DeliveriesHistory() {
  const [filter, setFilter] = useState<DeliveryFilter>("all");

  const filtered = useMemo(
    () => filterDeliveries(MOCK_DELIVERIES, filter),
    [filter],
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeNav="deliveries" />
      <main className={`${DASHBOARD_MAIN} space-y-6 lg:space-y-8`}>
        <DeliveriesHeader />
        <DeliveryFilters value={filter} onChange={setFilter} />
        <DeliveryList deliveries={filtered} />
      </main>
    </div>
  );
}
