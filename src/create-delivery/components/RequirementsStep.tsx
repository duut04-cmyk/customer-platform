"use client";

import type { ReactNode } from "react";
import {
  IconCalendarFilled,
  IconCheck,
  IconClockFilled,
  IconFragile,
  IconHandCare,
  IconKeepUpright,
  IconLightningFilled,
  IconRequirementNone,
  IconShieldFilled,
} from "@/dashboard/components/icons";
import type { DeliveryFormData, Timing } from "../types";
import {
  getDefaultScheduledFields,
  getPickupTimeSlotOptions,
  REQUIREMENT_OPTIONS,
  syncScheduledAt,
  TIMING_LABELS,
} from "../types";
import ReadyToGoNowPanel from "./ReadyToGoNowPanel";
import ScheduledDatePicker from "./ScheduledDatePicker";
import Textarea from "./Textarea";
import TimeSlotPicker from "./TimeSlotPicker";
import WhatHappensNextStepper from "./WhatHappensNextStepper";

const timingOptions: {
  id: Exclude<Timing, "">;
  label: string;
  description: string;
  Icon: typeof IconLightningFilled;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "asap",
    label: TIMING_LABELS.asap,
    description: "We'll find the best available delivery option now.",
    Icon: IconLightningFilled,
    iconBg: "bg-[#fff7ed]",
    iconColor: "text-accent",
  },
  {
    id: "scheduled",
    label: TIMING_LABELS.scheduled,
    description: "Choose a date and time for pickup.",
    Icon: IconCalendarFilled,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

const requirementIcons = {
  "handle-with-care": IconHandCare,
  fragile: IconFragile,
  "keep-upright": IconKeepUpright,
  none: IconRequirementNone,
} as const;

const timeSlotOptions = getPickupTimeSlotOptions();

type RequirementsStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2.5 text-small font-semibold text-foreground">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-caption text-red-600" role="alert">
      {message}
    </p>
  );
}

export default function RequirementsStep({
  data,
  errors,
  onChange,
}: RequirementsStepProps) {
  const toggleRequirement = (id: string) => {
    if (id === "none") {
      onChange({ requirements: ["none"] });
      return;
    }

    const withoutNone = data.requirements.filter((r) => r !== "none");
    const next = withoutNone.includes(id)
      ? withoutNone.filter((r) => r !== id)
      : [...withoutNone, id];
    onChange({ requirements: next });
  };

  const handleTimingChange = (timing: Exclude<Timing, "">) => {
    if (timing === "asap") {
      onChange({
        timing,
        scheduledAt: "",
        scheduledDate: "",
        pickupWindowStart: "",
        pickupWindowEnd: "",
      });
      return;
    }

    const defaults =
      data.scheduledDate && data.pickupWindowStart && data.pickupWindowEnd
        ? {
            scheduledDate: data.scheduledDate,
            pickupWindowStart: data.pickupWindowStart,
            pickupWindowEnd: data.pickupWindowEnd,
            scheduledAt: syncScheduledAt(data.scheduledDate, data.pickupWindowStart),
          }
        : getDefaultScheduledFields();

    onChange({ timing, ...defaults });
  };

  const handleScheduledDateChange = (scheduledDate: string) => {
    onChange({
      scheduledDate,
      scheduledAt: syncScheduledAt(scheduledDate, data.pickupWindowStart),
    });
  };

  const handlePickupWindowStartChange = (pickupWindowStart: string) => {
    const startIndex = timeSlotOptions.findIndex(
      (slot) => slot.value === pickupWindowStart,
    );
    const nextEnd = timeSlotOptions[startIndex + 1]?.value ?? pickupWindowStart;
    onChange({
      pickupWindowStart,
      pickupWindowEnd: nextEnd,
      scheduledAt: syncScheduledAt(data.scheduledDate, pickupWindowStart),
    });
  };

  const handlePickupWindowEndChange = (pickupWindowEnd: string) => {
    onChange({
      pickupWindowEnd,
      scheduledAt: syncScheduledAt(data.scheduledDate, data.pickupWindowStart),
    });
  };

  const endTimeOptions = timeSlotOptions.filter(
    (slot) => slot.value > data.pickupWindowStart,
  );

  const scheduledDate = data.scheduledDate || getDefaultScheduledFields().scheduledDate;
  const pickupWindowStart = data.pickupWindowStart || "16:00";
  const pickupWindowEnd = data.pickupWindowEnd || "16:30";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground">
          When should we deliver?
        </h2>
        <p className="text-caption text-muted-foreground">
          Choose when you want Doot to pick up and deliver your package.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-caption font-medium text-muted-foreground">
          Delivery timing
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {timingOptions.map((option) => {
            const selected = data.timing === option.id;
            const { Icon } = option;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleTimingChange(option.id)}
                className={`relative cursor-pointer rounded-[8px] border px-3.5 pb-3 pt-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-[#fff7ed]"
                    : "border-border bg-white hover:border-foreground/20"
                }`}
              >
                {selected ? (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <IconCheck className="h-3 w-3 stroke-[2.5]" />
                  </span>
                ) : (
                  <span
                    className="absolute right-3 top-3 h-5 w-5 rounded-full border border-border bg-white"
                    aria-hidden="true"
                  />
                )}
                <div className="flex items-start gap-2.5 pr-6">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${option.iconBg} ${option.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-small font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.timing} />

        {data.timing === "asap" ? <ReadyToGoNowPanel /> : null}

        {data.timing === "scheduled" ? (
          <div className="space-y-3 pt-1">
            <div className="space-y-0.5">
              <h3 className="text-small font-semibold text-foreground">
                Choose a pickup time
              </h3>
              <p className="text-caption text-muted-foreground">
                We&apos;ll use this time window when finding the best delivery option.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="mb-1.5 block text-caption font-medium text-foreground"
                >
                  Date
                </label>
                <ScheduledDatePicker
                  value={scheduledDate}
                  onChange={handleScheduledDateChange}
                  error={errors.scheduledDate}
                />
              </div>

              <div>
                <p className="mb-1.5 block text-caption font-medium text-foreground">
                  Pickup window
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <TimeSlotPicker
                    id="pickupWindowStart"
                    value={pickupWindowStart}
                    onChange={handlePickupWindowStartChange}
                    options={timeSlotOptions.slice(0, -1)}
                    error={errors.pickupWindowStart}
                    aria-label="Pickup window start"
                  />
                  <span className="text-caption text-muted-foreground">to</span>
                  <TimeSlotPicker
                    id="pickupWindowEnd"
                    value={pickupWindowEnd}
                    onChange={handlePickupWindowEndChange}
                    options={
                      endTimeOptions.length > 0
                        ? endTimeOptions
                        : timeSlotOptions.slice(1)
                    }
                    error={errors.pickupWindowEnd}
                    aria-label="Pickup window end"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 rounded-[8px] bg-blue-50 px-3 py-2.5">
              <IconClockFilled className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-caption leading-relaxed text-muted-foreground">
                Doot will check provider availability for this time window. Your slot is
                confirmed only after booking.
              </p>
            </div>

            <div className="flex gap-2.5 rounded-[8px] bg-[#fff7ed] px-3 py-2.5">
              <IconShieldFilled className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-caption leading-relaxed text-muted-foreground">
                Scheduled availability depends on the delivery partners serving your
                route.
              </p>
            </div>

            <WhatHappensNextStepper />
            <FieldError message={errors.scheduledAt} />
          </div>
        ) : null}
      </div>

      <div>
        <FieldLabel>Special requirements</FieldLabel>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {REQUIREMENT_OPTIONS.map((option) => {
            const selected = data.requirements.includes(option.id);
            const ReqIcon = requirementIcons[option.id];
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleRequirement(option.id)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-[#fff7ed] font-medium text-foreground"
                    : "border-border bg-white font-normal text-muted-foreground hover:border-foreground/25"
                }`}
              >
                <ReqIcon
                  className={`h-3.5 w-3.5 shrink-0 ${selected ? "text-accent" : "text-muted-foreground"}`}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="instructions"
          className="mb-2 block text-small font-semibold text-foreground"
        >
          Additional instructions{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="instructions"
          placeholder="Any extra details for the delivery..."
          value={data.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          className="min-h-28 resize-none rounded-[8px]! text-small"
        />
      </div>
    </div>
  );
}

export function validateRequirementsStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.timing) errors.timing = "Select a delivery timing.";

  if (data.timing === "scheduled") {
    if (!data.scheduledDate) errors.scheduledDate = "Select a date.";
    if (!data.pickupWindowStart) errors.pickupWindowStart = "Select a start time.";
    if (!data.pickupWindowEnd) errors.pickupWindowEnd = "Select an end time.";
    if (
      data.pickupWindowStart &&
      data.pickupWindowEnd &&
      data.pickupWindowEnd <= data.pickupWindowStart
    ) {
      errors.pickupWindowEnd = "End time must be after start time.";
    }

    const scheduledIso =
      data.scheduledAt || syncScheduledAt(data.scheduledDate, data.pickupWindowStart);
    if (!scheduledIso) {
      errors.scheduledAt = "Select a valid pickup window.";
    } else {
      const scheduled = new Date(scheduledIso);
      if (Number.isNaN(scheduled.getTime())) {
        errors.scheduledAt = "Enter a valid date and time.";
      } else if (scheduled.getTime() <= Date.now()) {
        errors.scheduledAt = "Choose a future date and time.";
      }
    }
  }

  return errors;
}

export function formatRequirements(requirements: string[]) {
  if (requirements.length === 0 || requirements.includes("none")) {
    return "No special requirements";
  }
  return requirements
    .map((id) => REQUIREMENT_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(", ");
}
