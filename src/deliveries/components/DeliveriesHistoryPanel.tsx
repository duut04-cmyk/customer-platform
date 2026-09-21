"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import Button from "@/common/components/Button";
import DatePeriodSelect from "@/dashboard/components/DatePeriodSelect";
import DeliveryCard from "@/dashboard/components/DeliveryCard";
import DashboardSearch from "@/dashboard/components/DashboardSearch";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { filterByDatePeriod, type DatePeriod } from "@/utils/datePeriods";
import { getFilterCounts, searchDeliveries } from "@/utils/dashboardStats";
import { filterDeliveries, MOCK_DELIVERIES } from "../mockDeliveries";
import type { DeliveryFilter } from "../types";

const filterOptions: { id: DeliveryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_transit", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled" },
];

const FILTER_LABELS: Record<Exclude<DeliveryFilter, "all">, string> = {
  in_transit: "active",
  delivered: "delivered",
  failed: "failed",
  cancelled: "cancelled",
};

function DeliveriesHistoryPanelContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [filter, setFilter] = useState<DeliveryFilter>("all");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("last_7_days");

  const dateFiltered = useMemo(
    () => filterByDatePeriod(MOCK_DELIVERIES, datePeriod),
    [datePeriod],
  );

  const filterCounts = useMemo(() => getFilterCounts(dateFiltered), [dateFiltered]);

  const deliveries = useMemo(() => {
    let list = dateFiltered;
    list = filterDeliveries(list, filter);
    list = searchDeliveries(list, searchQuery);
    return list;
  }, [dateFiltered, filter, searchQuery]);

  const isEmpty = deliveries.length === 0;

  return (
    <section className="min-w-0 rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2 px-4 py-3 sm:px-5 lg:landscape:gap-3">
        <Suspense
          fallback={
            <div className="h-10 w-full min-w-0 flex-1 rounded-[4px] border border-border bg-white lg:landscape:max-w-md xl:max-w-md" />
          }
        >
          <DashboardSearch
            variant="flex"
            className="w-full min-w-0 flex-1 lg:landscape:max-w-md xl:max-w-md"
          />
        </Suspense>

        {/* Mobile + tablet portrait: calendar icon */}
        <DatePeriodSelect
          value={datePeriod}
          onChange={setDatePeriod}
          variant="icon"
          className="shrink-0 lg:landscape:hidden xl:hidden"
        />

        {/* Tablet landscape + desktop: labeled date dropdown */}
        <DatePeriodSelect
          value={datePeriod}
          onChange={setDatePeriod}
          className="ml-auto hidden w-[11.5rem] shrink-0 lg:landscape:block xl:block"
        />
      </div>

      <div className="max-w-full overflow-x-auto px-4 pb-3 sm:px-5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
        <div
          className="mb-2.5 flex min-w-0 gap-2"
          role="tablist"
          aria-label="Filter deliveries"
        >
          {filterOptions.map((option) => {
            const selected = filter === option.id;
            const count = filterCounts[option.id];

            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(option.id)}
                className={`shrink-0 cursor-pointer rounded-[5px] border px-3 py-1.5 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-accent text-white"
                    : "border-slate-200 bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {option.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex min-h-64 flex-col items-center justify-center border-t border-border px-4 py-12 text-center sm:min-h-[280px] sm:px-5">
          <p className="text-body font-medium text-foreground">
            {searchQuery
              ? "No deliveries match your search."
              : filter !== "all"
                ? `No ${FILTER_LABELS[filter]} deliveries.`
                : "No deliveries yet."}
          </p>
          {!searchQuery && filter !== "all" && (
            <p className="mt-2 max-w-sm text-small text-muted-foreground">
              Try another filter to see more of your delivery history.
            </p>
          )}
          {!searchQuery && filter === "all" && (
            <Link href={CREATE_DELIVERY_PATH} className="mt-5">
              <Button className="h-10 gap-2 rounded-[10px] px-5 text-small font-semibold">
                <span aria-hidden="true">+</span>
                Create a delivery
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              <DeliveryCard delivery={delivery} variant="row" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function DeliveriesHistoryPanel() {
  return (
    <Suspense
      fallback={
        <div className="h-64 animate-pulse rounded-xl border border-border bg-background" />
      }
    >
      <DeliveriesHistoryPanelContent />
    </Suspense>
  );
}
