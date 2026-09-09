"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "@/common/components/Button";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import DatePeriodSelect from "@/dashboard/components/DatePeriodSelect";
import { filterByDatePeriod, type DatePeriod } from "@/utils/datePeriods";
import { getFilterCounts, searchDeliveries } from "@/utils/dashboardStats";
import {
  filterDeliveries,
  getRecentDeliveries,
  MOCK_DELIVERIES,
} from "@/deliveries/mockDeliveries";
import type { DeliveryFilter } from "@/deliveries/types";
import DeliveryCard from "./DeliveryCard";
import { IconChevronRight } from "./icons";

const filterOptions: { id: DeliveryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_transit", label: "In transit" },
  { id: "delivered", label: "Delivered" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function RecentDeliveries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [filter, setFilter] = useState<DeliveryFilter>("all");
  const [datePeriod, setDatePeriod] = useState<DatePeriod>("last_7_days");

  const filterCounts = useMemo(() => {
    const dateFiltered = filterByDatePeriod(MOCK_DELIVERIES, datePeriod);
    return getFilterCounts(dateFiltered);
  }, [datePeriod]);

  const deliveries = useMemo(() => {
    let list = getRecentDeliveries(10);
    list = filterByDatePeriod(list, datePeriod);
    list = filterDeliveries(list, filter);
    list = searchDeliveries(list, searchQuery);
    return list;
  }, [filter, datePeriod, searchQuery]);

  const isEmpty = deliveries.length === 0;

  return (
    <section className="rounded-xl border border-border bg-background shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-body-lg font-bold text-foreground">Recent deliveries</h2>
          <p className="mt-0.5 text-small text-muted-foreground">
            Track your latest deliveries and their status.
          </p>
        </div>
        <Link href="/deliveries">
          <Button
            variant="secondary"
            className="h-9 gap-1.5 rounded-[10px] px-4 text-small font-semibold"
          >
            View all deliveries
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="overflow-x-auto pb-1">
          <div
            className="flex min-w-0 gap-2"
            role="tablist"
            aria-label="Filter recent deliveries"
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
                  className={`shrink-0 cursor-pointer rounded-pill border px-3 py-1.5 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {option.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <DatePeriodSelect
          value={datePeriod}
          onChange={setDatePeriod}
          className="shrink-0"
        />
      </div>

      {isEmpty ? (
        <div className="flex min-h-56 flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[240px] sm:px-5">
          <p className="text-body font-medium text-foreground">
            {searchQuery
              ? "No deliveries match your search."
              : filter !== "all"
                ? "No deliveries in this filter."
                : "No deliveries yet."}
          </p>
          {!searchQuery && filter !== "all" && (
            <p className="mt-2 max-w-sm text-small text-muted-foreground">
              Try another filter to see more of your delivery history.
            </p>
          )}
          {!searchQuery && filter === "all" && (
            <Button
              className="mt-5 h-10 gap-2 rounded-[10px] px-5 text-small font-semibold"
              onClick={() => router.push(CREATE_DELIVERY_PATH)}
            >
              <span aria-hidden="true">+</span>
              Create a delivery
            </Button>
          )}
        </div>
      ) : (
        <ul className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              <DeliveryCard delivery={delivery} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
