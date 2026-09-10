"use client";

import { useEffect, useState } from "react";
import { FINDING_PROVIDERS } from "../findingProviders";

type ProviderStatus = "pending" | "in_progress" | "complete";

type FindingProvidersListProps = {
  onAllChecked?: () => void;
  slotLabel: string;
};

function StatusSpinner({ className = "text-current" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

function StatusPill({ status }: { status: ProviderStatus }) {
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
        <StatusSpinner />
        In progress
      </span>
    );
  }

  if (status === "complete") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-caption font-semibold text-emerald-700">
        Available
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-2.5 py-1 text-caption font-semibold text-muted-foreground">
      <StatusSpinner className="opacity-60" />
      Pending
    </span>
  );
}

export default function FindingProvidersList({
  onAllChecked,
  slotLabel,
}: FindingProvidersListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    for (let index = 0; index < FINDING_PROVIDERS.length; index++) {
      timers.push(
        window.setTimeout(() => {
          setActiveIndex(index);
        }, 500 * index),
      );
    }

    timers.push(
      window.setTimeout(
        () => {
          onAllChecked?.();
        },
        500 * FINDING_PROVIDERS.length + 400,
      ),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [onAllChecked]);

  function getStatus(index: number): ProviderStatus {
    if (index < activeIndex) return "complete";
    if (index === activeIndex) return "in_progress";
    return "pending";
  }

  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        Checking providers
      </p>

      <ul
        className="mt-4 divide-y divide-border rounded-lg border border-border"
        aria-live="polite"
        aria-label="Checking delivery providers"
      >
        {FINDING_PROVIDERS.map((provider, index) => {
          const LogoIcon = provider.icon;
          const status = getStatus(index);

          return (
            <li
              key={provider.id}
              className="flex items-center justify-between gap-3 px-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white shadow-sm">
                  <LogoIcon className={`h-5 w-5 ${provider.iconClassName}`} />
                </span>
                <div className="min-w-0">
                  <p className="text-small font-semibold text-foreground">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 truncate text-caption text-muted-foreground">
                    {slotLabel}
                  </p>
                </div>
              </div>
              <StatusPill status={status} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
