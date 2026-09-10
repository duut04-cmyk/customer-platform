"use client";

import { IconCheck, IconTruck } from "@/dashboard/components/icons";

const bookingSteps = [
  "Delivery option selected",
  "Price confirmed",
  "Booking delivery service",
  "Confirming delivery partner",
] as const;

type BookingProgressStepperProps = {
  activeIndex: number;
};

type StepState = "complete" | "active" | "upcoming";

function getStepState(index: number, activeIndex: number): StepState {
  if (index < activeIndex) return "complete";
  if (index === activeIndex) return "active";
  return "upcoming";
}

function StepIndicator({ index, state }: { index: number; state: StepState }) {
  if (state === "complete") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <IconCheck className="h-4 w-4" />
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-accent"
          aria-hidden="true"
        />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
          <IconTruck className="h-4 w-4" />
        </span>
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-white text-caption font-bold text-muted-foreground">
      {index + 1}
    </span>
  );
}

export default function BookingProgressStepper({
  activeIndex,
}: BookingProgressStepperProps) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex min-w-[560px] items-start sm:min-w-0">
        {bookingSteps.map((label, index) => {
          const state = getStepState(index, activeIndex);
          const isLast = index === bookingSteps.length - 1;

          return (
            <li key={label} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-col items-center">
                <StepIndicator index={index} state={state} />
                <p
                  className={`mt-2 w-[5.5rem] text-center text-[11px] leading-snug sm:w-auto sm:max-w-[7rem] ${
                    state === "complete"
                      ? "font-medium text-emerald-700"
                      : state === "active"
                        ? "font-semibold text-accent"
                        : "text-muted-foreground"
                  }`}
                >
                  {label}
                </p>
              </div>
              {!isLast && (
                <span
                  className={`mx-1 mt-4 h-px flex-1 sm:mx-2 ${
                    index < activeIndex ? "bg-emerald-400" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { bookingSteps };
