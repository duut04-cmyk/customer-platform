"use client";

import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";
import type { Delivery } from "../../types";

type TrackingPageHeaderProps = {
  delivery: Delivery;
  variant: "in_progress" | "completed" | "cancelled" | "failed";
};

function TrackingTitle({
  delivery,
  variant,
}: {
  delivery: Delivery;
  variant: TrackingPageHeaderProps["variant"];
}) {
  const title =
    variant === "completed"
      ? "Delivery completed!"
      : variant === "cancelled"
        ? "Delivery cancelled"
        : variant === "failed"
          ? "Delivery failed"
          : "Delivery progress";

  const subtitle =
    variant === "completed"
      ? "Your package has been successfully delivered."
      : variant === "cancelled"
        ? delivery.cancelReason
          ? `Reason: ${delivery.cancelReason}`
          : "This delivery was cancelled before pickup."
        : variant === "failed"
          ? "We couldn't complete this delivery."
          : "Your delivery is currently in progress.";

  return (
    <div className="space-y-1">
      <h1 className="text-heading font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-body text-muted-foreground">{subtitle}</p>
      {variant === "in_progress" && (
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {delivery.id}
        </p>
      )}
    </div>
  );
}

export default function TrackingPageHeader({
  delivery,
  variant,
}: TrackingPageHeaderProps) {
  return (
    <div className="bg-white">
      <div className="hidden xl:block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <TrackingTitle delivery={delivery} variant={variant} />
          </div>
          <AuthenticatedDesktopActions />
        </div>
      </div>

      <AuthenticatedMobilePageHeader>
        <TrackingTitle delivery={delivery} variant={variant} />
      </AuthenticatedMobilePageHeader>
    </div>
  );
}
