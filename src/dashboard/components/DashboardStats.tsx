import {
  DASHBOARD_TRENDS,
  formatTrendLineShort,
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
    compactLabel?: string;
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
      compactLabel: "Failed",
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
      compactLabel: "Failed",
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
    <div className="grid grid-cols-2 gap-2.5 md:portrait:grid-cols-4 md:portrait:gap-2 lg:landscape:grid-cols-4 lg:landscape:gap-2 xl:grid-cols-4 xl:gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = counts[card.key];
        const trend = DASHBOARD_TRENDS[card.trendKey];
        const tabletLabel = card.compactLabel ?? card.label;

        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-background p-3 shadow-sm md:portrait:p-2.5 lg:landscape:p-2.5 xl:p-4"
          >
            {/* Phone: 2×2. Tablet portrait/landscape: single-row compact cards. */}
            <div className="flex flex-col gap-2 md:portrait:gap-1.5 lg:landscape:gap-1.5 xl:hidden">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:portrait:h-8 md:portrait:w-8 lg:landscape:h-8 lg:landscape:w-8 ${card.iconBg}`}
              >
                <Icon className="h-4 w-4 md:portrait:h-3.5 md:portrait:w-3.5 lg:landscape:h-3.5 lg:landscape:w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-medium leading-snug text-muted-foreground">
                  <span className="md:portrait:hidden lg:landscape:hidden">
                    {card.label}
                  </span>
                  <span className="hidden md:portrait:inline lg:landscape:inline">
                    {tabletLabel}
                  </span>
                </p>
                <div className="mt-0.5 flex flex-wrap items-end gap-x-2 gap-y-0.5 md:portrait:gap-x-1.5 lg:landscape:gap-x-1.5">
                  <p className="text-subheading font-bold leading-none tracking-tight text-foreground md:portrait:text-body-lg lg:landscape:text-body-lg">
                    {value}
                  </p>
                  <p
                    className={`font-medium leading-none ${trendTextClass(trend.tone)} text-caption`}
                  >
                    {formatTrendLineShort(trend)}
                  </p>
                </div>
              </div>
            </div>

            {/* xl+ desktop: label beside icon, number below, two-line trend */}
            <div className="hidden xl:block">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="min-w-0 text-small font-medium leading-snug text-muted-foreground">
                      {card.label}
                    </p>
                  </div>
                  <p className="mt-2 text-heading font-bold leading-none tracking-tight text-foreground">
                    {value}
                  </p>
                </div>
                <div
                  className={`shrink-0 pb-0.5 text-right leading-tight ${trendTextClass(trend.tone)}`}
                >
                  <p className="text-small font-semibold">
                    {formatTrendLineShort(trend)}
                  </p>
                  <p className="mt-0.5 text-caption font-medium opacity-90">
                    vs. last 7 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
