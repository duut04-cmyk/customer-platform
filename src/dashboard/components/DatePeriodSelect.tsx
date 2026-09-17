"use client";

import { useEffect, useRef, useState } from "react";
import { DATE_PERIOD_LABELS, DATE_PERIODS, type DatePeriod } from "@/utils/datePeriods";
import { IconCalendar, IconChevronDown } from "./icons";

type DatePeriodSelectProps = {
  value: DatePeriod;
  onChange: (value: DatePeriod) => void;
  className?: string;
  /** `icon` = calendar button only (mobile); `default` = labeled dropdown */
  variant?: "default" | "icon";
};

export default function DatePeriodSelect({
  value,
  onChange,
  className = "w-[11.5rem]",
  variant = "default",
}: DatePeriodSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isIcon = variant === "icon";

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isIcon ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Date period: ${DATE_PERIOD_LABELS[value]}`}
          title={DATE_PERIOD_LABELS[value]}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-border bg-background text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <IconCalendar className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select date period"
          className="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-[4px] border border-border bg-background px-3 text-caption font-medium text-foreground transition-colors hover:bg-surface"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <IconCalendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{DATE_PERIOD_LABELS[value]}</span>
          </span>
          <IconChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {open && (
        <ul
          role="listbox"
          aria-label="Date period"
          className={`absolute top-full z-20 mt-1 overflow-hidden rounded-[4px] border border-border bg-background py-1 shadow-md ${
            isIcon ? "right-0 w-[11.5rem]" : "left-0 right-0 w-full"
          }`}
        >
          {DATE_PERIODS.map((period) => {
            const selected = period === value;

            return (
              <li key={period} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(period);
                    setOpen(false);
                  }}
                  className={`w-full cursor-pointer px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                    selected ? "font-semibold text-accent" : "text-foreground"
                  }`}
                >
                  {DATE_PERIOD_LABELS[period]}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
