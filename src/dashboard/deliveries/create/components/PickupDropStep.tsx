"use client";

import type { ReactNode } from "react";
import Input from "@/common/components/Input";
import type { DeliveryFormData } from "../types";

function LocationPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M8 14s4.5-3 4.5-6.5A4.5 4.5 0 1 0 3.5 7.5C3.5 11 8 14 8 14z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
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

type PickupDropStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
};

export default function PickupDropStep({
  data,
  errors,
  onChange,
}: PickupDropStepProps) {
  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          Where should we pick it up?
        </h2>
        <p className="text-body text-muted-foreground">
          Tell us where the delivery starts and where it needs to go.
        </p>
      </div>

      <div className="space-y-5 rounded-xl border border-border bg-background p-5 shadow-sm md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-2.5 text-accent">
            <LocationPin />
          </span>
          <div className="min-w-0 flex-1">
            <FieldLabel htmlFor="pickupAddress">Pickup address</FieldLabel>
            <Input
              id="pickupAddress"
              name="pickupAddress"
              placeholder="Enter pickup address"
              value={data.pickupAddress}
              onChange={(e) => onChange({ pickupAddress: e.target.value })}
              error={!!errors.pickupAddress}
            />
            <FieldError message={errors.pickupAddress} />
          </div>
        </div>

        <div className="ml-2 border-l border-dashed border-border pl-6">
          <div className="flex items-start gap-3">
            <span className="mt-2.5 text-foreground/70">
              <LocationPin />
            </span>
            <div className="min-w-0 flex-1">
              <FieldLabel htmlFor="dropAddress">Drop-off address</FieldLabel>
              <Input
                id="dropAddress"
                name="dropAddress"
                placeholder="Enter drop-off address"
                value={data.dropAddress}
                onChange={(e) => onChange({ dropAddress: e.target.value })}
                error={!!errors.dropAddress}
              />
              <FieldError message={errors.dropAddress} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-background p-5 shadow-sm">
          <h3 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">
            Pickup contact
          </h3>
          <div>
            <FieldLabel htmlFor="pickupContactName">Name</FieldLabel>
            <Input
              id="pickupContactName"
              placeholder="Contact name"
              value={data.pickupContactName}
              onChange={(e) => onChange({ pickupContactName: e.target.value })}
              error={!!errors.pickupContactName}
            />
            <FieldError message={errors.pickupContactName} />
          </div>
          <div>
            <FieldLabel htmlFor="pickupContactPhone">Phone number</FieldLabel>
            <Input
              id="pickupContactPhone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={data.pickupContactPhone}
              onChange={(e) => onChange({ pickupContactPhone: e.target.value })}
              error={!!errors.pickupContactPhone}
            />
            <FieldError message={errors.pickupContactPhone} />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-background p-5 shadow-sm">
          <h3 className="text-small font-semibold uppercase tracking-wide text-muted-foreground">
            Drop-off contact
          </h3>
          <div>
            <FieldLabel htmlFor="dropContactName">Name</FieldLabel>
            <Input
              id="dropContactName"
              placeholder="Contact name"
              value={data.dropContactName}
              onChange={(e) => onChange({ dropContactName: e.target.value })}
              error={!!errors.dropContactName}
            />
            <FieldError message={errors.dropContactName} />
          </div>
          <div>
            <FieldLabel htmlFor="dropContactPhone">Phone number</FieldLabel>
            <Input
              id="dropContactPhone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={data.dropContactPhone}
              onChange={(e) => onChange({ dropContactPhone: e.target.value })}
              error={!!errors.dropContactPhone}
            />
            <FieldError message={errors.dropContactPhone} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function validatePickupStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.pickupAddress.trim()) errors.pickupAddress = "This field is required.";
  if (!data.dropAddress.trim()) errors.dropAddress = "This field is required.";
  if (!data.pickupContactName.trim())
    errors.pickupContactName = "This field is required.";
  if (!data.pickupContactPhone.trim())
    errors.pickupContactPhone = "This field is required.";
  if (!data.dropContactName.trim())
    errors.dropContactName = "This field is required.";
  if (!data.dropContactPhone.trim())
    errors.dropContactPhone = "This field is required.";
  return errors;
}
