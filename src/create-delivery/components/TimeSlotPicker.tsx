"use client";

import { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@/dashboard/components/icons";

type TimeSlotPickerProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  "aria-label": string;
};

export default function TimeSlotPicker({
  id,
  value,
  onChange,
  options,
  error,
  "aria-label": ariaLabel,
}: TimeSlotPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "Select time";

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
    <div ref={containerRef} className="relative min-w-0">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] border bg-background px-3 text-small text-foreground transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          error ? "border-foreground ring-1 ring-foreground/20" : "border-border"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <IconChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-[8px] border border-border bg-background py-1 shadow-md"
        >
          {options.map((option) => {
            const selected = value === option.value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full cursor-pointer px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                    selected ? "font-semibold text-accent" : "text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
