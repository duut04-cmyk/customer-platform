import {
  DASHBOARD_TRENDS,
  formatTrendLine,
  type DashboardTrend,
} from "@/utils/dashboardTrends";
import { getDashboardCounts } from "@/utils/dashboardStats";
import { IconAlert, IconCheck, IconClock, IconTruck } from "./icons";

type StatCardKey = "total" | "completed" | "inTransit" | "failedCancelled";

type StatsVariant = "dashboard" | "deliveries";

type DashboardStatsProps = {
  variant?: StatsVariant;
};

const statCardsByVariant: Record<
  StatsVariant,
  {
    key: StatCardKey;
    label: string;
    icon: typeof IconTruck;
    iconBg: string;
    trendKey: StatCardKey;
  }[]
> = {
  dashboard: [
    {
      key: "total",
      label: "Total Deliveries",
      icon: IconTruck,
      iconBg: "bg-emerald-50 text-emerald-600",
      trendKey: "total",
    },
    {
      key: "completed",
      label: "Completed",
      icon: IconCheck,
      iconBg: "bg-blue-50 text-blue-600",
      trendKey: "completed",
    },
    {
      key: "inTransit",
      label: "In Transit",
      icon: IconClock,
      iconBg: "bg-orange-50 text-orange-600",
      trendKey: "inTransit",
    },
    {
      key: "failedCancelled",
      label: "Failed / Cancelled",
      icon: IconAlert,
      iconBg: "bg-red-50 text-red-600",
      trendKey: "failedCancelled",
    },
  ],
  deliveries: [
    {
      key: "total",
      label: "Total deliveries",
      icon: IconTruck,
      iconBg: "bg-emerald-50 text-emerald-600",
      trendKey: "total",
    },
    {
      key: "completed",
      label: "Delivered",
      icon: IconCheck,
      iconBg: "bg-blue-50 text-blue-600",
      trendKey: "completed",
    },
    {
      key: "inTransit",
      label: "Active",
      icon: IconClock,
      iconBg: "bg-orange-50 text-orange-600",
      trendKey: "inTransit",
    },
    {
      key: "failedCancelled",
      label: "Failed / Cancelled",
      icon: IconAlert,
      iconBg: "bg-red-50 text-red-600",
      trendKey: "failedCancelled",
    },
  ],
};

function trendTextClass(tone: DashboardTrend["tone"]): string {
  if (tone === "green") return "text-emerald-600";
  if (tone === "orange") return "text-orange-600";
  return "text-red-600";
}

export default function DashboardStats({ variant = "dashboard" }: DashboardStatsProps) {
  const counts = getDashboardCounts();
  const statCards = statCardsByVariant[variant];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = counts[card.key];
        const trend = DASHBOARD_TRENDS[card.trendKey];

        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-small font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-0.5 text-heading font-bold tracking-tight text-foreground">
                  {value}
                </p>
                <p
                  className={`mt-0.5 text-small font-medium ${trendTextClass(trend.tone)}`}
                >
                  {formatTrendLine(trend)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
