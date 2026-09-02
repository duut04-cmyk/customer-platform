"use client";

import type { ReactNode } from "react";
import type { DeliveryFormData, Timing } from "../types";
import { REQUIREMENT_OPTIONS, TIMING_LABELS } from "../types";
import Textarea from "./Textarea";

const timingOptions: { id: Exclude<Timing, "">; label: string }[] = [
  { id: "asap", label: TIMING_LABELS.asap },
  { id: "today", label: TIMING_LABELS.today },
  { id: "scheduled", label: TIMING_LABELS.scheduled },
];

type RequirementsStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-small font-medium text-foreground">{children}</p>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-caption text-foreground" role="alert">
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

  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          What does this delivery need?
        </h2>
        <p className="text-body text-muted-foreground">
          These details help Dutt choose the best available option.
        </p>
      </div>

      <div>
        <FieldLabel>Delivery timing</FieldLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {timingOptions.map((option) => {
            const selected = data.timing === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ timing: option.id })}
                className={`cursor-pointer rounded-xl border px-4 py-3.5 text-left text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-surface-accent text-foreground"
                    : "border-border bg-background text-foreground hover:border-foreground/20"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.timing} />
      </div>

      <div>
        <FieldLabel>Special requirements</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {REQUIREMENT_OPTIONS.map((option) => {
            const selected = data.requirements.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleRequirement(option.id)}
                className={`cursor-pointer rounded-pill border px-4 py-2 text-small font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-surface-accent text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="instructions"
          className="mb-1.5 block text-small font-medium text-foreground"
        >
          Additional instructions{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="instructions"
          placeholder="Any extra details for the delivery..."
          value={data.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
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
