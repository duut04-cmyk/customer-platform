"use client";

import { usePathname } from "next/navigation";
import DashboardStatsSkeleton from "@/dashboard/components/DashboardStatsSkeleton";
import RecentDeliveriesSkeleton from "@/dashboard/components/RecentDeliveriesSkeleton";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import DeliveriesListSkeleton from "@/deliveries/components/DeliveriesListSkeleton";
import DeliveryDetailSkeleton from "@/deliveries/detail/components/DeliveryDetailSkeleton";
import LiveTrackingSkeleton from "@/deliveries/tracking/components/LiveTrackingSkeleton";

function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface ${className}`} />;
}

function GenericPrivateSkeleton() {
  return (
    <main
      className={`${DASHBOARD_MAIN} bg-white`}
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Pulse className="h-8 w-56" />
          <Pulse className="h-4 w-80 max-w-full" />
        </div>
        <Pulse className="h-48 w-full rounded-xl" />
        <Pulse className="h-64 w-full rounded-xl" />
      </div>
    </main>
  );
}

function DashboardPageSkeleton() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-2">
          <Pulse className="h-8 w-40" />
          <Pulse className="h-4 w-72 max-w-full" />
        </div>
        <DashboardStatsSkeleton />
        <RecentDeliveriesSkeleton />
      </div>
    </main>
  );
}

function DeliveriesPageSkeleton() {
  return (
    <main className={`${DASHBOARD_MAIN} bg-white`}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Pulse className="h-8 w-48" />
          <Pulse className="h-4 w-64 max-w-full" />
        </div>
        <DeliveriesListSkeleton />
      </div>
    </main>
  );
}

export default function PrivateAuthLoadingSkeleton() {
  const pathname = usePathname() ?? "";

  if (pathname.includes("/tracking")) {
    return (
      <main className={`${DASHBOARD_MAIN} bg-white`}>
        <LiveTrackingSkeleton />
      </main>
    );
  }

  if (/^\/deliveries\/[^/]+$/.test(pathname)) {
    return (
      <main className={`${DASHBOARD_MAIN} bg-white`}>
        <DeliveryDetailSkeleton />
      </main>
    );
  }

  if (pathname.startsWith("/deliveries")) {
    return <DeliveriesPageSkeleton />;
  }

  if (pathname.startsWith("/dashboard")) {
    return <DashboardPageSkeleton />;
  }

  return <GenericPrivateSkeleton />;
}
