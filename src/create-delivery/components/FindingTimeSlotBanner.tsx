import { IconClockFilled } from "@/dashboard/components/icons";
import {
  formatScheduledDateLabel,
  formatTime12Hour,
  TIMING_LABELS,
  type DeliveryFormData,
} from "../types";

type FindingTimeSlotBannerProps = {
  data: DeliveryFormData;
  onEdit: () => void;
};

function formatScheduledWindow(data: DeliveryFormData): string {
  if (!data.scheduledDate || !data.pickupWindowStart || !data.pickupWindowEnd) {
    return "Not specified";
  }
  return `${formatScheduledDateLabel(data.scheduledDate)}, ${formatTime12Hour(data.pickupWindowStart)} – ${formatTime12Hour(data.pickupWindowEnd)}`;
}

function IconPencil({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FindingTimeSlotBanner({
  data,
  onEdit,
}: FindingTimeSlotBannerProps) {
  const isScheduled = data.timing === "scheduled";

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-accent/20 bg-[#fff7ed] px-4 py-3">
      <div className="flex min-w-0 gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <IconClockFilled className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-small font-semibold text-accent">
            {isScheduled ? "Scheduled for later" : TIMING_LABELS.asap}
          </p>
          <p className="mt-0.5 text-small font-medium text-foreground">
            {isScheduled
              ? formatScheduledWindow(data)
              : "We'll find the best available option now"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-caption font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <IconPencil />
        Edit
      </button>
    </div>
  );
}
