import Button from "@/common/components/Button";

type StepNavigationProps = {
  showBack: boolean;
  continueDisabled?: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export default function StepNavigation({
  showBack,
  continueDisabled = false,
  onBack,
  onContinue,
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
      {showBack ? (
        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full px-6 text-body font-semibold sm:w-auto"
          onClick={onBack}
        >
          Back
        </Button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Button
        type="button"
        className="h-11 w-full px-8 text-body font-semibold sm:ml-auto sm:w-auto"
        onClick={onContinue}
        disabled={continueDisabled}
      >
        Continue
      </Button>
    </div>
  );
}
