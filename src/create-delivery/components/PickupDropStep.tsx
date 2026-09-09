"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Input from "@/common/components/Input";
import {
  IconChevronDown,
  IconCrosshair,
  IconMapPinFilled,
  IconUserFilled,
} from "@/dashboard/components/icons";
import type { DeliveryFormData } from "../types";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
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
    <p className="mt-1.5 text-caption text-red-600" role="alert">
      {message}
    </p>
  );
}

function AddressField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <IconMapPinFilled className="h-4 w-4" />
        </span>
        <Input
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          className="pl-11"
        />
      </div>
      <button
        type="button"
        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-caption font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        <span aria-hidden="true">+</span>
        <IconCrosshair className="h-3.5 w-3.5" />
        Use my current location
      </button>
      <FieldError message={error} />
    </div>
  );
}

function PhoneField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <select
            aria-label="Country code"
            className="h-11 cursor-pointer appearance-none rounded-md border border-border bg-background py-0 pl-3 pr-8 text-small text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            defaultValue="+91"
            disabled
          >
            <option value="+91">+91</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Input
          id={id}
          type="tel"
          placeholder="Enter phone number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          className="min-w-0 flex-1"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

type PickupDropStepProps = {
  data: DeliveryFormData;
  errors: Partial<Record<keyof DeliveryFormData, string>>;
  onChange: (updates: Partial<DeliveryFormData>) => void;
  focusSection?: "pickup" | "dropoff" | null;
  onFocusHandled?: () => void;
};

export default function PickupDropStep({
  data,
  errors,
  onChange,
  focusSection,
  onFocusHandled,
}: PickupDropStepProps) {
  const dropoffSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusSection !== "dropoff") return;

    dropoffSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const dropInput = document.getElementById("dropAddress");
    dropInput?.focus({ preventScroll: true });
    onFocusHandled?.();
  }, [focusSection, onFocusHandled]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7ed] text-accent">
            <IconMapPinFilled className="h-4 w-4" />
          </span>
          <h2 className="text-body font-bold text-foreground">Pickup location</h2>
        </div>
        <AddressField
          id="pickupAddress"
          label="Address"
          placeholder="Enter pickup address"
          value={data.pickupAddress}
          onChange={(value) => onChange({ pickupAddress: value })}
          error={errors.pickupAddress}
        />
      </section>

      <section ref={dropoffSectionRef} className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <IconMapPinFilled className="h-4 w-4" />
          </span>
          <h2 className="text-body font-bold text-foreground">Drop-off location</h2>
        </div>
        <AddressField
          id="dropAddress"
          label="Address"
          placeholder="Enter drop-off address"
          value={data.dropAddress}
          onChange={(value) => onChange({ dropAddress: value })}
          error={errors.dropAddress}
        />
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7ed] text-accent">
              <IconUserFilled className="h-4 w-4" />
            </span>
            <h3 className="text-small font-semibold text-foreground">Pickup contact</h3>
          </div>
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
          <PhoneField
            id="pickupContactPhone"
            label="Phone number"
            value={data.pickupContactPhone}
            onChange={(value) => onChange({ pickupContactPhone: value })}
            error={errors.pickupContactPhone}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <IconUserFilled className="h-4 w-4" />
            </span>
            <h3 className="text-small font-semibold text-foreground">
              Drop-off contact
            </h3>
          </div>
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
          <PhoneField
            id="dropContactPhone"
            label="Phone number"
            value={data.dropContactPhone}
            onChange={(value) => onChange({ dropContactPhone: value })}
            error={errors.dropContactPhone}
          />
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
  if (!data.dropContactName.trim()) errors.dropContactName = "This field is required.";
  if (!data.dropContactPhone.trim())
    errors.dropContactPhone = "This field is required.";
  return errors;
}
