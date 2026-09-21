export type DashboardTrend = {
  direction: "up" | "down";
  percent: number;
  tone: "green" | "orange" | "red";
};

export type DashboardTrends = {
  total: DashboardTrend;
  completed: DashboardTrend;
  inTransit: DashboardTrend;
  failedCancelled: DashboardTrend;
};

export function formatTrendLine(trend: DashboardTrend): string {
  const arrow = trend.direction === "up" ? "↑" : "↓";
  return `${arrow} ${trend.percent}% vs. last 7 days`;
}

/** Compact trend for tight mobile cells. */
export function formatTrendLineShort(trend: DashboardTrend): string {
  const arrow = trend.direction === "up" ? "↑" : "↓";
  return `${arrow} ${trend.percent}%`;
}

export const DASHBOARD_TRENDS: DashboardTrends = {
  total: { direction: "up", percent: 25, tone: "green" },
  completed: { direction: "up", percent: 40, tone: "green" },
  inTransit: { direction: "up", percent: 0, tone: "orange" },
  failedCancelled: { direction: "down", percent: 50, tone: "red" },
};
