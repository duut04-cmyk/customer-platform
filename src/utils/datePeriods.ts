import type { Delivery } from "@/deliveries/types";

export type DatePeriod =
  "today" | "this_week" | "last_7_days" | "last_week" | "this_month";

export const DATE_PERIODS: DatePeriod[] = [
  "today",
  "this_week",
  "last_7_days",
  "last_week",
  "this_month",
];

export const DATE_PERIOD_LABELS: Record<DatePeriod, string> = {
  today: "Today",
  this_week: "This week",
  last_7_days: "Last 7 days",
  last_week: "Last week",
  this_month: "This month",
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Week starts on Monday */
function startOfWeek(date: Date): Date {
  const dayStart = startOfDay(date);
  const weekday = dayStart.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  dayStart.setDate(dayStart.getDate() - daysFromMonday);
  return dayStart;
}

function startOfMonth(date: Date): Date {
  const dayStart = startOfDay(date);
  dayStart.setDate(1);
  return dayStart;
}

function getPeriodBounds(
  period: DatePeriod,
  reference = new Date(),
): {
  start: Date;
  end: Date;
} {
  const todayStart = startOfDay(reference);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  switch (period) {
    case "today":
      return { start: todayStart, end: tomorrowStart };
    case "this_week":
      return { start: startOfWeek(reference), end: tomorrowStart };
    case "last_7_days": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 7);
      return { start, end: tomorrowStart };
    }
    case "last_week": {
      const thisWeekStart = startOfWeek(reference);
      const start = new Date(thisWeekStart);
      start.setDate(start.getDate() - 7);
      return { start, end: thisWeekStart };
    }
    case "this_month":
      return { start: startOfMonth(reference), end: tomorrowStart };
  }
}

export function filterByDatePeriod(
  deliveries: Delivery[],
  period: DatePeriod,
): Delivery[] {
  const { start, end } = getPeriodBounds(period);

  return deliveries.filter((delivery) => {
    if (!delivery.createdAt) return true;
    const created = new Date(delivery.createdAt);
    return created >= start && created < end;
  });
}

/** @deprecated Use filterByDatePeriod */
export function filterByDateRange(
  deliveries: Delivery[],
  range: "7d" | "30d" | "all",
): Delivery[] {
  if (range === "all") return deliveries;
  const period: DatePeriod = range === "7d" ? "last_7_days" : "this_month";
  return filterByDatePeriod(deliveries, period);
}
