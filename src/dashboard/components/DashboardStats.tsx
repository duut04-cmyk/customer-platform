"use client";

import type { Delivery } from "@/deliveries/types";
import { useDeliveriesList } from "@/deliveries/hooks/useDeliveriesList";
import { getDashboardCounts, type DashboardCounts } from "@/utils/dashboardStats";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import { IconAlert, IconCheck, IconClock, IconTruck } from "./icons";

type StatCardKey = "total" | "completed" | "inTransit" | "failedCancelled";

type StatsVariant = "dashboard" | "deliveries";

const statCardsByVariant: Record<
  StatsVariant,
  {
    key: StatCardKey;
    label: string;
    compactLabel?: string;
    icon: typeof IconTruck;
    iconBg: string;
  }[]
> = {
  dashboard: [
    {
      key: "total",
      label: "Total Deliveries",
      icon: IconTruck,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      key: "completed",
      label: "Completed",
      icon: IconCheck,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      key: "inTransit",
      label: "In Transit",
      icon: IconClock,
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      key: "failedCancelled",
      label: "Failed / Cancelled",
      compactLabel: "Failed / Cancelled",
      icon: IconAlert,
      iconBg: "bg-red-50 text-red-600",
    },
  ],
  deliveries: [
    {
      key: "total",
      label: "Total deliveries",
      icon: IconTruck,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      key: "completed",
      label: "Delivered",
      icon: IconCheck,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      key: "inTransit",
      label: "Active",
      icon: IconClock,
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      key: "failedCancelled",
      label: "Failed / Cancelled",
      compactLabel: "Failed / Cancelled",
      icon: IconAlert,
      iconBg: "bg-red-50 text-red-600",
    },
  ],
};

function DashboardStatsGrid({
  variant,
  counts,
  loading,
}: {
  variant: StatsVariant;
  counts: DashboardCounts;
  loading?: boolean;
}) {
  const statCards = statCardsByVariant[variant];

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 md:portrait:grid-cols-4 md:portrait:gap-2 lg:landscape:grid-cols-4 lg:landscape:gap-2 xl:grid-cols-4 xl:gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = counts[card.key];
        const tabletLabel = card.compactLabel ?? card.label;

        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-background p-3 shadow-sm md:portrait:p-2.5 lg:landscape:p-2.5 xl:p-4"
          >
            <div className="flex flex-col gap-2 md:portrait:gap-1.5 lg:landscape:gap-1.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:portrait:h-8 md:portrait:w-8 lg:landscape:h-8 lg:landscape:w-8 xl:h-10 xl:w-10 ${card.iconBg}`}
              >
                <Icon className="h-4 w-4 md:portrait:h-3.5 md:portrait:w-3.5 lg:landscape:h-3.5 lg:landscape:w-3.5 xl:h-5 xl:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-medium leading-snug text-muted-foreground xl:text-small">
                  <span className="md:portrait:hidden lg:landscape:hidden xl:inline">
                    {card.label}
                  </span>
                  <span className="hidden md:portrait:inline lg:landscape:inline xl:hidden">
                    {tabletLabel}
                  </span>
                </p>
                <p className="mt-0.5 text-subheading font-bold leading-none tracking-tight text-foreground md:portrait:text-body-lg lg:landscape:text-body-lg xl:mt-2 xl:text-heading">
                  {value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Stats for a pre-filtered delivery list (e.g. deliveries history date range). */
export function DashboardStatsForDeliveries({
  deliveries,
  loading = false,
}: {
  deliveries: Delivery[];
  loading?: boolean;
}) {
  const counts = getDashboardCounts(deliveries);
  return <DashboardStatsGrid variant="deliveries" counts={counts} loading={loading} />;
}

/** Dashboard home stats for a shared date-filtered list. */
export function DashboardStatsForPeriod({
  deliveries,
  loading = false,
}: {
  deliveries: Delivery[];
  loading?: boolean;
}) {
  const counts = getDashboardCounts(deliveries);
  return <DashboardStatsGrid variant="dashboard" counts={counts} loading={loading} />;
}

export default function DashboardStats() {
  const { deliveries, loading } = useDeliveriesList(100);
  const counts = getDashboardCounts(deliveries);
  return <DashboardStatsGrid variant="dashboard" counts={counts} loading={loading} />;
}
