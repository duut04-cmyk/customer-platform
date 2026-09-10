import { IconCalendarFilled, IconClockFilled } from "@/dashboard/components/icons";
import {
  formatScheduledDateLabel,
  formatTime12Hour,
  TIMING_LABELS,
  type DeliveryFormData,
} from "../types";

type FindingTimeSlotCardProps = {
  data: DeliveryFormData;
};

function formatTimeSlotValue(data: DeliveryFormData): string {
  if (data.timing === "asap") {
    return TIMING_LABELS.asap;
  }
  if (data.scheduledDate && data.pickupWindowStart && data.pickupWindowEnd) {
    return `${formatScheduledDateLabel(data.scheduledDate)}, ${formatTime12Hour(data.pickupWindowStart)} – ${formatTime12Hour(data.pickupWindowEnd)}`;
  }
  return "Not specified";
}

export default function FindingTimeSlotCard({ data }: FindingTimeSlotCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <IconCalendarFilled className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-body font-bold text-foreground">Delivery time slot</h3>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Your selected pickup window
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3">
          <IconClockFilled className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            <p className="text-small font-semibold text-foreground">
              {formatTimeSlotValue(data)}
            </p>
            <p className="mt-0.5 text-caption text-muted-foreground">Pickup window</p>
          </div>
        </div>
      </div>
    </section>
  );
}
