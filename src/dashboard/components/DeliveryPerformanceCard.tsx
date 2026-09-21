import type { ComponentType } from "react";
import { DASHBOARD_PERFORMANCE } from "@/utils/dashboardStats";
import { IconCheck, IconClock, IconPackage, IconTruck } from "./icons";

type MetricRowProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  compactLabel: string;
  value: string;
  percent?: number;
};

function ProgressRing({ percent }: { percent: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg
      className="h-7 w-7 shrink-0 md:portrait:h-6 md:portrait:w-6 sm:h-8 sm:w-8 lg:landscape:h-6 lg:landscape:w-6 xl:h-6 xl:w-6"
      viewBox="0 0 36 36"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-surface"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
        className="text-teal-500"
      />
    </svg>
  );
}

function MetricRow({
  icon: Icon,
  label,
  compactLabel,
  value,
  percent,
}: MetricRowProps) {
  return (
    <div className="flex items-center gap-1.5 py-2 md:portrait:gap-1 md:portrait:py-1.5 sm:gap-2.5 sm:py-2.5 lg:landscape:gap-1 lg:landscape:py-1.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground md:portrait:h-6 md:portrait:w-6 sm:h-8 sm:w-8 lg:landscape:h-6 lg:landscape:w-6 xl:h-7 xl:w-7">
        <Icon className="h-3.5 w-3.5 md:portrait:h-3 md:portrait:w-3 sm:h-4 sm:w-4 lg:landscape:h-3 lg:landscape:w-3" />
      </span>
      <p className="min-w-0 flex-1 text-caption leading-snug text-foreground sm:text-small sm:leading-relaxed lg:landscape:text-caption lg:landscape:leading-snug">
        <span className="sm:hidden">{compactLabel}</span>
        <span className="hidden sm:inline md:portrait:hidden lg:landscape:hidden xl:hidden">
          {label}
        </span>
        <span className="hidden md:portrait:inline lg:landscape:inline xl:inline">
          {compactLabel}
        </span>
      </p>
      <div className="flex shrink-0 items-center gap-1 md:portrait:gap-0.5 sm:gap-1.5 lg:landscape:gap-0.5">
        {percent !== undefined && <ProgressRing percent={percent} />}
        <span className="whitespace-nowrap text-caption font-semibold tabular-nums text-foreground sm:text-small lg:landscape:text-caption">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function DeliveryPerformanceCard() {
  const perf = DASHBOARD_PERFORMANCE;

  return (
    <section className="min-w-0 w-full max-w-full rounded-xl border border-border bg-background p-3.5 shadow-sm sm:p-4 lg:landscape:p-3 xl:p-5">
      <h3 className="text-body font-bold text-foreground lg:landscape:text-small">
        Delivery performance
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted-foreground lg:landscape:mt-1 lg:landscape:text-caption">
        Last 7 days
      </p>

      <div className="mt-5 divide-y divide-border lg:landscape:mt-3">
        <MetricRow
          icon={IconTruck}
          label="On-time delivery rate"
          compactLabel="On-time rate"
          value={`${perf.onTimePercent.toFixed(1)}%`}
          percent={perf.onTimePercent}
        />
        <MetricRow
          icon={IconClock}
          label="Avg. delivery time"
          compactLabel="Avg. time"
          value={perf.avgDeliveryTime}
          percent={72}
        />
        <MetricRow
          icon={IconCheck}
          label="Successful bookings"
          compactLabel="Successful"
          value={perf.successfulBookings}
          percent={90}
        />
        <MetricRow
          icon={IconPackage}
          label="Service availability rate"
          compactLabel="Availability"
          value={`${perf.availabilityPercent.toFixed(1)}%`}
          percent={perf.availabilityPercent}
        />
      </div>
    </section>
  );
}
