import type { ProgressStep } from "../types";

const steps: { id: ProgressStep; label: string; number: string }[] = [
  { id: "pickup", number: "01", label: "Pickup & drop" },
  { id: "package", number: "02", label: "Package" },
  { id: "requirements", number: "03", label: "Requirements" },
  { id: "review", number: "04", label: "Review" },
];

const stepOrder: ProgressStep[] = [
  "pickup",
  "package",
  "requirements",
  "review",
];

type DeliveryProgressProps = {
  current: ProgressStep;
};

export default function DeliveryProgress({ current }: DeliveryProgressProps) {
  const currentIndex = stepOrder.indexOf(current);

  return (
    <nav
      className="mt-8 overflow-x-auto pb-1"
      aria-label="Delivery creation progress"
    >
      <ol className="flex min-w-[520px] gap-2 sm:min-w-0 sm:justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === current;

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center gap-2 sm:gap-3"
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-bold transition-colors ${
                  isCurrent
                    ? "bg-accent text-accent-foreground"
                    : isComplete
                      ? "bg-foreground text-background"
                      : "bg-surface text-muted-foreground"
                }`}
              >
                {isComplete ? "✓" : step.number}
              </span>
              <span
                className={`hidden text-small font-medium sm:inline ${
                  isCurrent
                    ? "text-foreground"
                    : isComplete
                      ? "text-foreground/80"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={`mx-1 hidden h-px flex-1 sm:block ${
                    isComplete ? "bg-foreground/30" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-small font-medium text-foreground sm:hidden">
        {steps.find((s) => s.id === current)?.label}
      </p>
    </nav>
  );
}
