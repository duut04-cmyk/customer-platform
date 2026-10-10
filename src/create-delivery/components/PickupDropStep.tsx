"use client";

import { useEffect, useRef, type ReactNode } from "react";
import AddressLocationField from "@/common/components/AddressLocationField";
import Input from "@/common/components/Input";
import PhoneInput from "@/common/components/PhoneInput";
import { IconMapPinFilled, IconUserFilled } from "@/dashboard/components/icons";
import { getPhoneValidationError } from "@/auth/phone-mapper";
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

function ContactSection({
  iconClassName,
  title,
  subtitle,
  children,
}: {
  iconClassName: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        <IconUserFilled className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <h2 className="text-body font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-caption text-muted-foreground">{subtitle}</p>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
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
      <PhoneInput
        id={id}
        value={value}
        onChange={onChange}
        error={!!error}
        placeholder="Enter phone number"
      />
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
      <section>
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-accent">
            <IconMapPinFilled className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <h2 className="text-body font-bold text-foreground">Pickup location</h2>
              <p className="mt-1 text-caption text-muted-foreground">
                Where should we collect the package from?
              </p>
            </div>
            <AddressLocationField
              id="pickupAddress"
              hideLabel
              placeholder="Enter pickup address"
              value={{
                address: data.pickupAddress,
                latitude: data.pickupLatitude,
                longitude: data.pickupLongitude,
              }}
              onChange={({ address, latitude, longitude }) =>
                onChange({
                  pickupAddress: address,
                  pickupLatitude: latitude,
                  pickupLongitude: longitude,
                })
              }
              error={errors.pickupAddress}
            />
          </div>
        </div>
      </section>

      <section ref={dropoffSectionRef}>
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <IconMapPinFilled className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <h2 className="text-body font-bold text-foreground">Drop-off location</h2>
              <p className="mt-1 text-caption text-muted-foreground">
                Where should we deliver the package?
              </p>
            </div>
            <AddressLocationField
              id="dropAddress"
              hideLabel
              placeholder="Enter drop-off address"
              value={{
                address: data.dropAddress,
                latitude: data.dropLatitude,
                longitude: data.dropLongitude,
              }}
              onChange={({ address, latitude, longitude }) =>
                onChange({
                  dropAddress: address,
                  dropLatitude: latitude,
                  dropLongitude: longitude,
                })
              }
              error={errors.dropAddress}
            />
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-border bg-white p-4 sm:p-5">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <ContactSection
            iconClassName="bg-[#fff7ed] text-accent"
            title="Pickup contact"
            subtitle="Person who will hand over the package"
          >
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
          </ContactSection>

          <ContactSection
            iconClassName="bg-blue-50 text-blue-600"
            title="Drop-off contact"
            subtitle="Person who will receive the package"
          >
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
          </ContactSection>
        </div>
      </div>
    </div>
  );
}

export function validatePickupStep(
  data: DeliveryFormData,
): Partial<Record<keyof DeliveryFormData, string>> {
  const errors: Partial<Record<keyof DeliveryFormData, string>> = {};
  if (!data.pickupAddress.trim()) {
    errors.pickupAddress = "This field is required.";
  } else if (
    data.pickupLatitude == null ||
    data.pickupLongitude == null ||
    !Number.isFinite(data.pickupLatitude) ||
    !Number.isFinite(data.pickupLongitude)
  ) {
    errors.pickupAddress =
      "Select pickup from the suggestions so we can pin it on the map.";
  }
  if (!data.dropAddress.trim()) {
    errors.dropAddress = "This field is required.";
  } else if (
    data.dropLatitude == null ||
    data.dropLongitude == null ||
    !Number.isFinite(data.dropLatitude) ||
    !Number.isFinite(data.dropLongitude)
  ) {
    errors.dropAddress =
      "Select drop-off from the suggestions so we can pin it on the map.";
  }
  if (!data.pickupContactName.trim())
    errors.pickupContactName = "This field is required.";
  const pickupPhoneError = getPhoneValidationError(data.pickupContactPhone);
  if (pickupPhoneError) errors.pickupContactPhone = pickupPhoneError;
  if (!data.dropContactName.trim()) errors.dropContactName = "This field is required.";
  const dropPhoneError = getPhoneValidationError(data.dropContactPhone);
  if (dropPhoneError) errors.dropContactPhone = dropPhoneError;
  return errors;
}
