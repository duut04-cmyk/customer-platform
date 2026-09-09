import type { ProgressStep } from "../types";

const steps: { id: ProgressStep; label: string; number: string }[] = [
  { id: "pickup", number: "01", label: "Pickup & drop" },
  { id: "package", number: "02", label: "Package" },
  { id: "requirements", number: "03", label: "Timing" },
  { id: "consent", number: "04", label: "Consent" },
  { id: "review", number: "05", label: "Review" },
];

const stepOrder: ProgressStep[] = [
  "pickup",
  "package",
  "requirements",
  "consent",
  "review",
];

type DeliveryProgressProps = {
  current: ProgressStep;
};

export default function DeliveryProgress({ current }: DeliveryProgressProps) {
  const currentIndex = stepOrder.indexOf(current);

  return (
    <nav className="overflow-x-auto pb-1" aria-label="Delivery creation progress">
      <ol className="flex min-w-[640px] items-center sm:min-w-0">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === current;

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption font-bold transition-colors ${
                    isCurrent
                      ? "bg-accent text-white"
                      : isComplete
                        ? "bg-foreground text-background"
                        : "border-2 border-border bg-white text-muted-foreground"
                  }`}
                >
                  {isComplete ? "✓" : step.number}
                </span>
                <span
                  className={`hidden truncate text-small font-medium sm:inline ${
                    isCurrent
                      ? "text-accent"
                      : isComplete
                        ? "text-foreground/80"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  className={`mx-2 hidden h-px flex-1 sm:block ${
                    index < currentIndex ? "bg-foreground/30" : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-small font-medium text-accent sm:hidden">
        {steps.find((s) => s.id === current)?.label}
      </p>
    </nav>
  );
}
