"use client";

import type { ReactNode } from "react";
import Button from "@/common/components/Button";
import {
  IconArrowRight,
  IconCheck,
  IconMapPinFilled,
  IconPackageFilled,
  IconShieldFilled,
} from "@/dashboard/components/icons";
import type { DeliveryFormData, FormStep } from "../types";
import {
  formatDimensions,
  formatPackageSizeSummary,
  formatRequirements,
  formatWeight,
  hasComplianceConsent,
  PACKAGE_LABELS,
} from "../types";

type PickupEditFocus = "pickup" | "dropoff";

type ReviewStepProps = {
  data: DeliveryFormData;
  onEdit: (step: FormStep, pickupFocus?: PickupEditFocus) => void;
  onFindDelivery: () => void;
};

function SectionHeader({
  eyebrow,
  title,
  onEdit,
}: {
  eyebrow: string;
  title: string;
  onEdit: () => void;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
        <h3 className="mt-0.5 text-body font-bold text-foreground">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 cursor-pointer text-caption font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Edit
      </button>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-small text-muted-foreground">
      <span className="text-foreground/70">{label}:</span> {value}
    </p>
  );
}

function RouteEndpoint({
  accent,
  label,
  address,
  contactName,
  contactPhone,
}: {
  accent: "pickup" | "dropoff";
  label: string;
  address: string;
  contactName: string;
  contactPhone: string;
}) {
  const isPickup = accent === "pickup";
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${
            isPickup ? "bg-accent/10 text-accent" : "bg-sky-100 text-sky-600"
          }`}
        >
          <IconMapPinFilled className="h-3.5 w-3.5" />
        </span>
        <p
          className={`text-[0.625rem] font-bold uppercase tracking-[0.14em] ${
            isPickup ? "text-accent" : "text-sky-600"
          }`}
        >
          {label}
        </p>
      </div>
      <p className="mt-2 text-small font-semibold leading-snug text-foreground">
        {address || "—"}
      </p>
      <div className="mt-1.5 space-y-0.5">
        <MetaLine label="Contact" value={contactName} />
        <MetaLine label="Phone" value={contactPhone} />
      </div>
    </div>
  );
}

function DetailChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-[#FFFBF5] px-2.5 py-1 text-caption font-medium text-foreground">
      {children}
    </span>
  );
}

export default function ReviewStep({ data, onEdit, onFindDelivery }: ReviewStepProps) {
  const packageLabel = data.packageType ? PACKAGE_LABELS[data.packageType] : "—";
  const requirementsLabel = formatRequirements(data.requirements);
  const sizeLabel = formatPackageSizeSummary(data);
  const dimensionsLabel = formatDimensions(data);
  const weightLabel = formatWeight(data);
  const consentOk = hasComplianceConsent(data);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold tracking-tight text-foreground md:text-subheading">
          Review your delivery
        </h2>
        <p className="text-small text-muted-foreground md:text-body">
          Confirm the details — Doot will find the best option for this route.
        </p>
      </div>

      <section className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)] sm:p-5">
        <SectionHeader
          eyebrow="Route"
          title="Pickup to drop-off"
          onEdit={() => onEdit("pickup")}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
          <RouteEndpoint
            accent="pickup"
            label="Pickup"
            address={data.pickupAddress}
            contactName={data.pickupContactName}
            contactPhone={data.pickupContactPhone}
          />
          <div className="hidden shrink-0 items-center pt-8 sm:flex" aria-hidden="true">
            <IconArrowRight className="h-4 w-4 text-muted-foreground/60" />
          </div>
          <div className="flex items-center gap-2 sm:hidden" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            <IconArrowRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground/60" />
            <span className="h-px flex-1 bg-border" />
          </div>
          <RouteEndpoint
            accent="dropoff"
            label="Drop-off"
            address={data.dropAddress}
            contactName={data.dropContactName}
            contactPhone={data.dropContactPhone}
          />
        </div>
        <button
          type="button"
          onClick={() => onEdit("pickup", "dropoff")}
          className="mt-3 cursor-pointer text-caption font-medium text-sky-700 transition-colors hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Edit drop-off only
        </button>
      </section>

      <section className="rounded-[10px] border border-border bg-white p-4 shadow-[0_8px_24px_-16px_rgba(23,23,23,0.14)] sm:p-5">
        <SectionHeader
          eyebrow="Package"
          title={"What's being delivered"}
          onEdit={() => onEdit("package")}
        />
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-violet-50 text-violet-600">
            <IconPackageFilled className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-body font-semibold text-foreground">{packageLabel}</p>
              {data.packageDescription.trim() ? (
                <p className="mt-0.5 text-small text-muted-foreground">
                  {data.packageDescription.trim()}
                </p>
              ) : null}
              <p className="mt-1 text-caption text-muted-foreground">
                Pickup as soon as possible
              </p>
            </div>

            {data.packagePhotos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.packagePhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="h-14 w-14 overflow-hidden rounded-[8px] border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.previewUrl}
                      alt={`Package ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-1.5">
              {sizeLabel && sizeLabel !== "—" ? (
                <DetailChip>{sizeLabel}</DetailChip>
              ) : null}
              {dimensionsLabel && dimensionsLabel !== "—" ? (
                <DetailChip>{dimensionsLabel}</DetailChip>
              ) : null}
              {weightLabel && weightLabel !== "—" ? (
                <DetailChip>{weightLabel}</DetailChip>
              ) : null}
              {requirementsLabel ? <DetailChip>{requirementsLabel}</DetailChip> : null}
            </div>

            {data.instructions.trim() ? (
              <p className="rounded-[8px] border border-border bg-[#FFFBF5] px-3 py-2 text-small text-foreground">
                <span className="font-medium text-foreground/70">Instructions: </span>
                {data.instructions.trim()}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div
        className={`flex items-center justify-between gap-3 rounded-[10px] border px-4 py-3.5 sm:px-5 ${
          consentOk
            ? "border-emerald-200 bg-emerald-50/70"
            : "border-amber-200 bg-amber-50/70"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              consentOk
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {consentOk ? (
              <IconCheck className="h-4 w-4" />
            ) : (
              <IconShieldFilled className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-small font-semibold text-foreground">
              {consentOk ? "Safety terms confirmed" : "Safety terms not confirmed"}
            </p>
            <p className="text-caption text-muted-foreground">
              Required before Doot can search for options
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onEdit("consent")}
          className="shrink-0 cursor-pointer text-caption font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-caption text-muted-foreground sm:text-small">
          Doot compares available partners on price, ETA, and package fit — you
          don&apos;t need to shop around.
        </p>
        <Button
          type="button"
          className="h-12 w-full rounded-[6px] px-8 text-body font-semibold sm:w-auto"
          onClick={onFindDelivery}
          disabled={!consentOk}
        >
          Find best option
        </Button>
      </div>
    </div>
  );
}
