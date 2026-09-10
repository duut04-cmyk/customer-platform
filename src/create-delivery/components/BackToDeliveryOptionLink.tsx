import { IconArrowLeft } from "@/dashboard/components/icons";

type BackToDeliveryOptionLinkProps = {
  onClick: () => void;
};

export default function BackToDeliveryOptionLink({
  onClick,
}: BackToDeliveryOptionLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <IconArrowLeft className="h-4 w-4" />
      Back to delivery option
    </button>
  );
}
