"use client";

import type { ReactNode } from "react";
import Button from "@/common/components/Button";
import type { DeliveryFormData, FormStep } from "../types";
import { PACKAGE_LABELS, TIMING_LABELS } from "../types";
import { formatRequirements } from "./RequirementsStep";

type ReviewStepProps = {
  data: DeliveryFormData;
  onEdit: (step: FormStep) => void;
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

export default function ReviewStep({
  data,
  onEdit,
  onFindDelivery,
}: ReviewStepProps) {
  const packageLabel = data.packageType
    ? PACKAGE_LABELS[data.packageType]
    : "—";
  const dimensions =
    data.length && data.width && data.height
      ? `${data.length} × ${data.width} × ${data.height} cm`
      : "—";
  const timingLabel = data.timing ? TIMING_LABELS[data.timing] : "—";

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-body-lg font-bold text-foreground md:text-subheading">
          Review your delivery
        </h2>
        <p className="text-body text-muted-foreground">
          Make sure everything looks right before Dutt finds the best option.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReviewSection title="Pickup" onEdit={() => onEdit("pickup")}>
          <ReviewRow label="Address" value={data.pickupAddress} />
          <ReviewRow label="Contact" value={data.pickupContactName} />
          <ReviewRow label="Phone" value={data.pickupContactPhone} />
        </ReviewSection>

        <ReviewSection title="Drop-off" onEdit={() => onEdit("pickup")}>
          <ReviewRow label="Address" value={data.dropAddress} />
          <ReviewRow label="Contact" value={data.dropContactName} />
          <ReviewRow label="Phone" value={data.dropContactPhone} />
        </ReviewSection>

        <ReviewSection title="Package" onEdit={() => onEdit("package")}>
          <ReviewRow label="Type" value={packageLabel} />
          <ReviewRow label="Dimensions" value={dimensions} />
          <ReviewRow
            label="Weight"
            value={data.weight ? `${data.weight} kg` : "—"}
          />
        </ReviewSection>

        <ReviewSection title="Delivery requirements" onEdit={() => onEdit("requirements")}>
          <ReviewRow label="Timing" value={timingLabel} />
          <ReviewRow
            label="Requirements"
            value={formatRequirements(data.requirements)}
          />
          {data.instructions && (
            <ReviewRow label="Instructions" value={data.instructions} />
          )}
        </ReviewSection>
      </div>

      <div className="rounded-xl border border-border bg-surface/50 p-6 md:p-8">
        <h3 className="text-body-lg font-bold text-foreground">
          Dutt will find the best option
        </h3>
        <p className="mt-2 max-w-xl text-body text-muted-foreground">
          We check available delivery options against your package, route,
          requirements and timing. You don&apos;t need to compare providers.
          We&apos;ll handle that for you.
        </p>
        <Button
          type="button"
          className="mt-6 h-12 w-full px-8 text-body font-semibold sm:w-auto"
          onClick={onFindDelivery}
        >
          Find the best delivery
        </Button>
      </div>
    </div>
  );
}
