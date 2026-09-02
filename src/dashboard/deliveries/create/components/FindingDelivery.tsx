"use client";

import { useEffect, useState } from "react";

type FindingDeliveryProps = {
  onComplete: () => void;
};

const evaluationSteps = [
  "Checking availability",
  "Checking package fit",
  "Comparing delivery time",
  "Evaluating price",
  "Matching requirements",
];

const signals = [
  "Availability",
  "Package fit",
  "Delivery time",
  "Price",
  "Requirements",
];

export default function FindingDelivery({ onComplete }: FindingDeliveryProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    evaluationSteps.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setCompletedCount(index + 1);
        }, 400 * (index + 1)),
      );
    });

    timers.push(
      window.setTimeout(() => {
        onComplete();
      }, 2600),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [onComplete]);

  return (
    <div className="mt-10 space-y-10 text-center">
      <div className="space-y-2">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Finding the best delivery
        </h2>
        <p className="text-body text-muted-foreground">
          Dutt is checking available options for your package.
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-background p-6 shadow-sm">
        {["Your delivery", "Dutt", "Evaluating options", "Best option"].map(
          (label, index, arr) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className={`rounded-lg px-4 py-2 text-small font-semibold ${
                  index === arr.length - 1 && completedCount >= evaluationSteps.length
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface text-foreground"
                }`}
              >
                {label}
              </span>
              {index < arr.length - 1 && (
                <span
                  className="my-2 text-muted-foreground"
                  aria-hidden="true"
                >
                  ↓
                </span>
              )}
            </div>
          ),
        )}
      </div>

      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {signals.map((signal, index) => {
          const done = completedCount > index;
          return (
            <span
              key={signal}
              className={`rounded-pill border px-3 py-1.5 text-caption font-medium transition-colors ${
                done
                  ? "border-accent/30 bg-surface-accent text-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {signal}
            </span>
          );
        })}
      </div>

      <ul className="mx-auto max-w-md space-y-3 text-left">
        {evaluationSteps.map((step, index) => {
          const done = completedCount > index;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-body transition-opacity ${
                done ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
                  done
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                {done ? "✓" : "○"}
              </span>
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
