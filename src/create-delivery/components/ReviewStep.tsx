"use client";

import type { ReactNode } from "react";
import Button from "@/common/components/Button";
import type { DeliveryFormData, FormStep } from "../types";
import {
  formatDimensions,
  formatScheduledAt,
  formatTimingSummary,
  formatWeight,
  hasComplianceConsent,
  PACKAGE_LABELS,
} from "../types";
import { formatRequirements } from "./RequirementsStep";

type PickupEditFocus = "pickup" | "dropoff";

type ReviewStepProps = {
  data: DeliveryFormData;
  onEdit: (step: FormStep, pickupFocus?: PickupEditFocus) => void;
  onFindDelivery: () => void;
};

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer text-caption font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2 text-body text-foreground">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

export default function ReviewStep({ data, onEdit, onFindDelivery }: ReviewStepProps) {
  const packageLabel = data.packageType ? PACKAGE_LABELS[data.packageType] : "—";
  const timingLabel = formatTimingSummary(data);
  const timingDisplay = timingLabel === "Not specified" ? "—" : timingLabel;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          Review your delivery
        </h2>
        <p className="text-body text-muted-foreground">
          Make sure everything looks right before Doot finds the best option.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReviewSection title="Pickup" onEdit={() => onEdit("pickup")}>
          <ReviewRow label="Address" value={data.pickupAddress} />
          <ReviewRow label="Contact" value={data.pickupContactName} />
          <ReviewRow label="Phone" value={data.pickupContactPhone} />
        </ReviewSection>

        <ReviewSection title="Drop-off" onEdit={() => onEdit("pickup", "dropoff")}>
          <ReviewRow label="Address" value={data.dropAddress} />
          <ReviewRow label="Contact" value={data.dropContactName} />
          <ReviewRow label="Phone" value={data.dropContactPhone} />
        </ReviewSection>

        <ReviewSection title="Package" onEdit={() => onEdit("package")}>
          <ReviewRow label="Category" value={packageLabel} />
          {data.packagePhotoUrls.length > 0 && (
            <div>
              <p className="text-caption text-muted-foreground">Photos</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {data.packagePhotoUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="h-16 w-16 overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Package ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <ReviewRow label="Dimensions" value={formatDimensions(data)} />
          <ReviewRow label="Weight" value={formatWeight(data.weight)} />
        </ReviewSection>

        <ReviewSection
          title="Delivery requirements"
          onEdit={() => onEdit("requirements")}
        >
          <ReviewRow label="Timing" value={timingDisplay} />
          <ReviewRow
            label="Requirements"
            value={formatRequirements(data.requirements)}
          />
          {data.instructions && (
            <ReviewRow label="Instructions" value={data.instructions} />
          )}
        </ReviewSection>

        <ReviewSection title="Safety & compliance" onEdit={() => onEdit("consent")}>
          <ReviewRow
            label="Terms accepted"
            value={data.complianceConsent ? "Confirmed" : "Not confirmed"}
          />
          {data.consentAcceptedAt && (
            <ReviewRow
              label="Confirmed at"
              value={formatScheduledAt(data.consentAcceptedAt)}
            />
          )}
        </ReviewSection>
      </div>

      <div className="rounded-xl border border-border bg-surface/50 p-6 md:p-8">
        <h3 className="text-body-lg font-bold text-foreground">
          Doot will find the best option
        </h3>
        <p className="mt-2 max-w-xl text-body text-muted-foreground">
          We check available delivery options against your package, route, requirements
          and timing. You don&apos;t need to compare providers. We&apos;ll handle that
          for you.
        </p>
        <Button
          type="button"
          className="mt-6 h-12 w-full px-8 text-body font-semibold sm:w-auto"
          onClick={onFindDelivery}
          disabled={!hasComplianceConsent(data)}
        >
          Find best option
        </Button>
      </div>
    </div>
  );
}
