"use client";

import type { ReactNode } from "react";
import Input from "@/common/components/Input";
import type { DeliveryFormData, PackageType } from "../types";
import { PACKAGE_LABELS } from "../types";

const packageOptions: {
  id: Exclude<PackageType, "">;
  label: string;
  description: string;
}[] = [
  { id: "parcel", label: "Parcel", description: "Small to medium items" },
  { id: "document", label: "Document", description: "Papers and envelopes" },
  { id: "box", label: "Box", description: "Packed goods or cartons" },
  { id: "other", label: "Other", description: "Something else" },
];

type PackageStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-small font-medium text-foreground"
    >
      {children}
    </label>
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

export default function PackageStep({
  data,
  errors,
  onChange,
}: PackageStepProps) {
  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          What are you sending?
        </h2>
        <p className="text-body text-muted-foreground">
          A few details help Dutt find the right delivery option.
        </p>
      </div>

      <div className="space-y-3">
        <FieldLabel>Package type</FieldLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {packageOptions.map((option) => {
            const selected = data.packageType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ packageType: option.id })}
                className={`cursor-pointer rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-surface-accent"
                    : "border-border bg-background hover:border-foreground/20"
                }`}
              >
                <p className="text-body font-semibold text-foreground">
                  {option.label}
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.packageType} />
      </div>

      <div className="rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
        <FieldLabel>Dimensions</FieldLabel>
        <p className="mb-3 text-caption text-muted-foreground">Unit: cm</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <FieldLabel htmlFor="length">Length</FieldLabel>
            <Input
              id="length"
              inputMode="decimal"
              placeholder="30"
              value={data.length}
              onChange={(e) => onChange({ length: e.target.value })}
              error={!!errors.length}
            />
            <FieldError message={errors.length} />
          </div>
          <div>
            <FieldLabel htmlFor="width">Width</FieldLabel>
            <Input
              id="width"
              inputMode="decimal"
              placeholder="20"
              value={data.width}
              onChange={(e) => onChange({ width: e.target.value })}
              error={!!errors.width}
            />
            <FieldError message={errors.width} />
          </div>
          <div>
            <FieldLabel htmlFor="height">Height</FieldLabel>
            <Input
              id="height"
              inputMode="decimal"
              placeholder="15"
              value={data.height}
              onChange={(e) => onChange({ height: e.target.value })}
              error={!!errors.height}
            />
            <FieldError message={errors.height} />
          </div>
        </div>
      </div>

      <div className="max-w-xs rounded-xl border border-border bg-background p-5 shadow-sm">
        <FieldLabel htmlFor="weight">Weight</FieldLabel>
        <p className="mb-3 text-caption text-muted-foreground">Unit: kg</p>
        <Input
          id="weight"
          inputMode="decimal"
          placeholder="2.5"
          value={data.weight}
          onChange={(e) => onChange({ weight: e.target.value })}
          error={!!errors.weight}
        />
        <FieldError message={errors.weight} />
      </div>
    </div>
  );
}

export function validatePackageStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.packageType) errors.packageType = "Select a package type.";
  if (!data.length.trim()) errors.length = "Required.";
  if (!data.width.trim()) errors.width = "Required.";
  if (!data.height.trim()) errors.height = "Required.";
  if (!data.weight.trim()) errors.weight = "Required.";
  return errors;
}

export { PACKAGE_LABELS };
