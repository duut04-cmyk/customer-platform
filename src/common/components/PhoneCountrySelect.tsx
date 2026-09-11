"use client";

import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { getCountryCallingCode, type Country } from "react-phone-number-input";
import { IconChevronDown } from "@/dashboard/components/icons";

type CountryOption = {
  value?: string;
  label: string;
  divider?: boolean;
};

type CountryIconProps = {
  country?: string;
  label?: string;
  "aria-hidden"?: boolean;
};

type PhoneCountrySelectProps = {
  name?: string;
  value?: string;
  onChange: (value?: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  options: CountryOption[];
  iconComponent: ElementType<CountryIconProps>;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  "aria-label"?: string;
};

function getCallingCode(country?: string) {
  if (!country) return "";
  try {
    return `+${getCountryCallingCode(country as Country)}`;
  } catch {
    return "";
  }
}

export default function PhoneCountrySelect({
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  iconComponent: Icon,
  disabled = false,
  readOnly = false,
  "aria-label": ariaLabel = "Select country",
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isDisabled = disabled || readOnly;

  const selectableOptions = useMemo(
    () => options.filter((option) => !option.divider),
    [options],
  );

  const selectedOption = useMemo(
    () =>
      selectableOptions.find((option) =>
        value ? option.value === value : !option.value,
      ) ?? selectableOptions[0],
    [selectableOptions, value],
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return selectableOptions;

    return selectableOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [query, selectableOptions]);

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onBlur]);

  function handleToggle() {
    if (isDisabled) return;

    if (open) {
      setOpen(false);
      setQuery("");
      onBlur?.();
      return;
    }

    setOpen(true);
    onFocus?.();
  }

  function handleSelect(country?: string) {
    onChange(country);
    setOpen(false);
    setQuery("");
    onBlur?.();
  }

  return (
    <div ref={containerRef} className="PhoneInputCountry relative shrink-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isDisabled}
        onClick={handleToggle}
        className="flex h-11 min-w-[3.75rem] cursor-pointer items-center gap-1.5 rounded-[4px] border border-border bg-background px-2 transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60"
      >
        <Icon country={value} aria-hidden label={selectedOption?.label} />
        <IconChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 z-50 mb-1 w-72 overflow-hidden rounded-[4px] border border-border bg-background shadow-md">
          <div className="border-b border-border p-2">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country..."
              className="h-9 w-full rounded-[4px] border border-border bg-background px-3 text-small text-foreground placeholder:text-muted-foreground outline-none focus:border-border focus:outline-none focus:ring-0"
            />
          </div>

          <ul
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-56 overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-small text-muted-foreground">
                No countries found
              </li>
            ) : (
              filteredOptions.map((option) => {
                const selected = option.value === value;
                const callingCode = getCallingCode(option.value);

                return (
                  <li
                    key={option.value ?? "international"}
                    role="option"
                    aria-selected={selected}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-small transition-colors hover:bg-surface ${
                        selected
                          ? "bg-surface-accent font-semibold text-accent"
                          : "text-foreground"
                      }`}
                    >
                      <Icon country={option.value} aria-hidden label={option.label} />
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      {callingCode ? (
                        <span className="shrink-0 text-muted-foreground">
                          {callingCode}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
