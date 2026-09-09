import type { ComponentType } from "react";
import { DASHBOARD_PERFORMANCE } from "@/utils/dashboardStats";
import {
  IconCheck,
  IconChevronRight,
  IconClock,
  IconPackage,
  IconTruck,
} from "./icons";

type MetricRowProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  percent?: number;
};

function ProgressRing({ percent }: { percent: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="h-9 w-9 shrink-0" viewBox="0 0 36 36" aria-hidden="true">
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

function MetricRow({ icon: Icon, label, value, percent }: MetricRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <p className="min-w-0 flex-1 text-small text-foreground">{label}</p>
      <div className="flex shrink-0 items-center gap-2">
        {percent !== undefined && <ProgressRing percent={percent} />}
        <span className="text-small font-semibold text-foreground">{value}</span>
        <IconChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export default function DeliveryPerformanceCard() {
  const perf = DASHBOARD_PERFORMANCE;

  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <h3 className="text-body font-bold text-foreground">Delivery performance</h3>
      <p className="mt-0.5 text-small text-muted-foreground">Last 7 days</p>

      <div className="mt-2 divide-y divide-border">
        <MetricRow
          icon={IconTruck}
          label="On-time delivery rate"
          value={`${perf.onTimePercent.toFixed(1)}%`}
          percent={perf.onTimePercent}
        />
        <MetricRow
          icon={IconClock}
          label="Avg. delivery time"
          value={perf.avgDeliveryTime}
          percent={72}
        />
        <MetricRow
          icon={IconCheck}
          label="Successful bookings"
          value={perf.successfulBookings}
          percent={90}
        />
        <MetricRow
          icon={IconPackage}
          label="Service availability rate"
          value={`${perf.availabilityPercent.toFixed(1)}%`}
          percent={perf.availabilityPercent}
        />
      </div>
    </section>
  );
}
