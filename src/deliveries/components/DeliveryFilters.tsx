"use client";

import type { DeliveryFilter } from "../types";
import { getFilterCounts } from "@/utils/dashboardStats";
import { MOCK_DELIVERIES } from "../mockDeliveries";

const filters: { id: DeliveryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_transit", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled" },
];

type DeliveryFiltersProps = {
  value: DeliveryFilter;
  onChange: (filter: DeliveryFilter) => void;
};

export default function DeliveryFilters({ value, onChange }: DeliveryFiltersProps) {
  const counts = getFilterCounts(MOCK_DELIVERIES);

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-0 gap-2" role="tablist" aria-label="Filter deliveries">
        {filters.map((filter) => {
          const selected = value === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(filter.id)}
              className={`shrink-0 cursor-pointer rounded-pill border px-4 py-2 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected
                  ? "border-accent bg-surface-accent text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {filter.label} ({counts[filter.id]})
            </button>
          );
        })}
      </div>
    </div>
  );
}
