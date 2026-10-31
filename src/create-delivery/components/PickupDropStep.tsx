"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
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

function LocationCard({
  accent,
  title,
  subtitle,
  children,
  sectionRef,
}: {
  accent: "pickup" | "dropoff";
  title: string;
  subtitle: string;
  children: ReactNode;
  sectionRef?: RefObject<HTMLDivElement | null>;
}) {
  const isPickup = accent === "pickup";

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-visible rounded-[10px] border bg-white shadow-[0_8px_24px_-16px_rgba(23,23,23,0.18)] ${
        isPickup ? "border-accent/20" : "border-sky-200/80"
      }`}
    >
      <div
        className={`pointer-events-none absolute top-0 bottom-0 left-0 z-0 w-1 rounded-l-[10px] ${isPickup ? "bg-accent" : "bg-sky-500"}`}
        aria-hidden="true"
      />
      <div
        className={`relative z-[1] overflow-hidden rounded-t-[10px] border-b px-4 py-3.5 sm:px-5 ${
          isPickup ? "border-accent/10 bg-[#FFF8F1]" : "border-sky-100 bg-sky-50/70"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] ${
              isPickup ? "bg-accent/10 text-accent" : "bg-sky-100 text-sky-600"
            }`}
          >
            <IconMapPinFilled className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p
              className={`text-[0.625rem] font-bold uppercase tracking-[0.14em] ${
                isPickup ? "text-accent" : "text-sky-600"
              }`}
            >
              {isPickup ? "Pickup" : "Drop-off"}
            </p>
            <h2 className="mt-0.5 text-body font-bold text-foreground">{title}</h2>
            <p className="mt-0.5 text-caption text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="relative z-20 space-y-2 px-4 py-4 sm:px-5 sm:py-5">
        {children}
      </div>
    </section>
  );
}

function ContactCard({
  accent,
  title,
  subtitle,
  children,
}: {
  accent: "pickup" | "dropoff";
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const isPickup = accent === "pickup";

  return (
    <div
      className={`rounded-[10px] border bg-[#FFFBF5]/80 p-4 sm:p-5 ${
        isPickup ? "border-accent/15" : "border-sky-200/70"
      }`}
    >
      <div className="mb-4 flex items-start gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${
            isPickup ? "bg-accent/10 text-accent" : "bg-sky-100 text-sky-600"
          }`}
        >
          <IconUserFilled className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-small font-bold text-foreground md:text-body">{title}</h3>
          <p className="mt-0.5 text-caption text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
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
    <div className="space-y-6 md:space-y-7">
      <div>
        <h2 className="text-body-lg font-bold tracking-tight text-foreground">
          Where is this delivery going?
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          Add pickup and drop-off addresses, then the people we should contact at each
          end.
        </p>
      </div>

      {/* Location journey */}
      <div className="grid gap-4 overflow-visible lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-3">
        <LocationCard
          accent="pickup"
          title="Pickup location"
          subtitle="Where should we collect the package from?"
        >
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
        </LocationCard>

        <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-accent shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <LocationCard
          accent="dropoff"
          title="Drop-off location"
          subtitle="Where should we deliver the package?"
          sectionRef={dropoffSectionRef}
        >
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
        </LocationCard>
      </div>

      {/* Contacts */}
      <section className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.12)] sm:p-5 md:p-6">
        <div className="mb-4 md:mb-5">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
            Contacts
          </p>
          <h3 className="mt-1 text-body font-bold text-foreground">
            Who&apos;s involved?
          </h3>
          <p className="mt-0.5 text-caption text-muted-foreground md:text-small">
            People who will hand over and receive the package.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <ContactCard
            accent="pickup"
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
          </ContactCard>

          <ContactCard
            accent="dropoff"
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
          </ContactCard>
        </div>
      </section>
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
