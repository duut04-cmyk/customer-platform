"use client";

import { useEffect, useState } from "react";

type FindingDeliveryProps = {
  onComplete: () => void;
};

const evaluationSteps = [
  "Checking delivery availability",
  "Checking package compatibility",
  "Comparing delivery times",
  "Comparing prices",
  "Selecting the best option",
];

export default function FindingDelivery({ onComplete }: FindingDeliveryProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    evaluationSteps.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => {
            setCompletedCount(index + 1);
          },
          450 * (index + 1),
        ),
      );
    });

    timers.push(
      window.setTimeout(() => {
        onComplete();
      }, 2800),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [onComplete]);

  return (
    <div className="mx-auto mt-10 max-w-lg space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Finding the best delivery option
        </h2>
        <p className="text-body leading-relaxed text-muted-foreground">
          Doot is checking available delivery services based on price, delivery time,
          package compatibility, and your requirements.
        </p>
      </div>

      <ul
        className="space-y-3 text-left"
        aria-live="polite"
        aria-label="Finding the best delivery option"
      >
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
                aria-hidden="true"
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
