"use client";

import { useEffect, useState } from "react";

type BookingDeliveryProps = {
  onComplete: () => void;
};

const bookingSteps = [
  "Delivery option selected",
  "Price confirmed",
  "Booking delivery service",
  "Confirming delivery partner",
];

export default function BookingDelivery({ onComplete }: BookingDeliveryProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    bookingSteps.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => {
            setCompletedCount(index + 1);
          },
          550 * (index + 1),
        ),
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
    <div className="mx-auto mt-10 max-w-lg space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
          Booking your delivery
        </h2>
        <p className="text-body text-muted-foreground">
          Your selected delivery option is being booked.
        </p>
      </div>

      <ul
        className="space-y-3 text-left"
        aria-live="polite"
        aria-label="Booking your delivery"
      >
        {bookingSteps.map((step, index) => {
          const done = completedCount > index;
          const inProgress = !done && completedCount === index;

          return (
            <li
              key={step}
              className={`flex items-center gap-3 text-body transition-opacity ${
                done || inProgress ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
                  done
                    ? "bg-accent text-accent-foreground"
                    : inProgress
                      ? "border-2 border-accent bg-background text-accent"
                      : "bg-surface text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {done ? "✓" : inProgress ? "•" : "○"}
              </span>
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
