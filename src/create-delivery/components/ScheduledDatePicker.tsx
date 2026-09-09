"use client";

import { useEffect, useRef, useState } from "react";
import { IconCalendar, IconChevronDown } from "@/dashboard/components/icons";
import {
  formatISODate,
  formatScheduledDateLabel,
  getScheduledDateOptions,
} from "../types";

export const CUSTOM_SCHEDULED_DATE = "__custom__";

type ScheduledDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function getDateBounds() {
  const min = new Date();
  min.setHours(0, 0, 0, 0);
  const max = new Date(min);
  max.setDate(max.getDate() + 60);
  return { min: formatISODate(min), max: formatISODate(max) };
}

export default function ScheduledDatePicker({
  value,
  onChange,
  error,
}: ScheduledDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const presetOptions = getScheduledDateOptions();
  const { min, max } = getDateBounds();
  const isPreset = presetOptions.some((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setCustomMode(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setCustomMode(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const displayLabel = value ? formatScheduledDateLabel(value) : "Select date";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id="scheduledDate"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] border bg-background px-3 text-small text-foreground transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          error ? "border-foreground ring-1 ring-foreground/20" : "border-border"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <IconCalendar className="h-4 w-4 shrink-0 text-blue-600" />
          <span className="truncate">{displayLabel}</span>
        </span>
        <IconChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[8px] border border-border bg-background py-1 shadow-md">
          {!customMode ? (
            <ul role="listbox" aria-label="Scheduled date">
              {presetOptions.map((option) => {
                const selected = value === option.value;
                return (
                  <li key={option.value} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setCustomMode(false);
                      }}
                      className={`w-full cursor-pointer px-3 py-2.5 text-left text-small transition-colors hover:bg-surface ${
                        selected ? "font-semibold text-accent" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
              <li role="option" aria-selected={!isPreset && !!value}>
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  className={`w-full cursor-pointer border-t border-border px-3 py-2.5 text-left text-small transition-colors hover:bg-surface ${
                    !isPreset && value ? "font-semibold text-accent" : "text-foreground"
                  }`}
                >
                  Choose custom date…
                </button>
              </li>
            </ul>
          ) : (
            <div className="space-y-2 p-3">
              <p className="text-caption font-medium text-foreground">Pick a date</p>
              <input
                type="date"
                min={min}
                max={max}
                value={value || min}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-full rounded-[8px] border border-border bg-background px-3 text-small text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCustomMode(false);
                }}
                className="w-full cursor-pointer rounded-[8px] bg-accent px-3 py-2 text-caption font-medium text-white transition-colors hover:bg-accent/90"
              >
                Done
              </button>
            </div>
          )}
        </div>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-caption text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
