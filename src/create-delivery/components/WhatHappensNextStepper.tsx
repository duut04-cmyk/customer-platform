const steps = [
  { number: "1", label: "Check availability" },
  { number: "2", label: "Find best option" },
  { number: "3", label: "Book delivery" },
] as const;

export default function WhatHappensNextStepper() {
  return (
    <div className="space-y-3">
      <p className="text-small font-semibold text-foreground">What happens next?</p>
      <ol className="flex items-start">
        {steps.map((step, index) => (
          <li key={step.number} className="flex items-start">
            {index > 0 ? (
              <span
                className="mt-3.5 h-px w-10 shrink-0 bg-border sm:w-20"
                aria-hidden="true"
              />
            ) : null}
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-caption font-bold text-muted-foreground">
                {step.number}
              </span>
              <span className="mt-1.5 w-[5.5rem] text-center text-[11px] leading-snug text-muted-foreground">
                {step.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
