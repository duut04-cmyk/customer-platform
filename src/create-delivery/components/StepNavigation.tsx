import Button from "@/common/components/Button";
import { IconArrowRight } from "@/dashboard/components/icons";

type StepNavigationProps = {
  showBack: boolean;
  continueDisabled?: boolean;
  continueLabel: string;
  onBack: () => void;
  onContinue: () => void;
};

export default function StepNavigation({
  showBack,
  continueDisabled = false,
  continueLabel,
  onBack,
  onContinue,
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
      {showBack ? (
        <Button
          type="button"
          variant="secondary"
          className="h-10 rounded-[6px] px-5 text-small font-semibold sm:mr-auto sm:w-auto"
          onClick={onBack}
        >
          Back
        </Button>
      ) : null}
      <Button
        type="button"
        className="h-11 gap-2 rounded-[6px] px-6 text-small font-semibold shadow-[0_6px_16px_-6px_rgba(255,107,10,0.4)] disabled:opacity-50"
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueLabel}
        <IconArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
