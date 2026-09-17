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

function getMobileLabelPosition(index: number, total: number) {
  if (index === 0) {
    return "left-0 translate-x-0 text-left";
  }
  if (index === total - 1) {
    return "right-0 translate-x-0 text-right";
  }
  return "-translate-x-1/2 text-center";
}

export default function DeliveryProgress({ current }: DeliveryProgressProps) {
  const currentIndex = stepOrder.indexOf(current);
  const currentStep = steps[currentIndex];
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  return (
    <nav
      className="min-w-0 w-full max-w-full overflow-visible pb-1"
      aria-label="Delivery creation progress"
    >
      <ol className="flex w-full min-w-0 items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === current;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={`flex items-center ${isLast ? "shrink-0" : "min-w-0 flex-1"}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex shrink-0 items-center gap-2">
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
              {!isLast ? (
                <div className="flex h-8 min-w-0 flex-1 items-center">
                  <span
                    className={`mx-1 h-px min-w-0 flex-1 sm:mx-2 ${
                      index < currentIndex ? "bg-foreground/30" : "bg-border"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {currentStep ? (
        <div className="relative mt-1.5 min-h-10 w-full overflow-visible sm:hidden">
          <span
            className={`absolute top-0 max-w-[min(11rem,72%)] text-caption font-medium leading-tight text-accent ${getMobileLabelPosition(currentIndex, steps.length)}`}
            style={
              !isFirstStep && !isLastStep
                ? { left: `${(currentIndex / (steps.length - 1)) * 100}%` }
                : undefined
            }
          >
            {currentStep.label}
          </span>
        </div>
      ) : null}
    </nav>
  );
}
