"use client";

import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { useDashboardShell } from "@/dashboard/components/DashboardShellContext";
import { IconArrowLeft, IconMenu } from "@/dashboard/components/icons";
import NotificationBell from "@/dashboard/components/NotificationBell";
import UserMenu from "@/dashboard/components/UserMenu";
import type { Delivery } from "../../types";

type TrackingPageHeaderProps = {
  delivery: Delivery;
  variant: "in_progress" | "completed" | "cancelled" | "failed";
};

function HeaderContent({
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
    <div className="min-w-0">
      <Link
        href={DASHBOARD_PATH}
        className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div className="mt-3 space-y-1">
        <h1 className="text-heading font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-body text-muted-foreground">{subtitle}</p>
        {variant === "in_progress" && (
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            {delivery.id}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TrackingPageHeader({
  delivery,
  variant,
}: TrackingPageHeaderProps) {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-4">
          <HeaderContent delivery={delivery} variant={variant} />
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        <HeaderContent delivery={delivery} variant={variant} />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-[4px] p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Open navigation menu"
            onClick={openMobileNav}
          >
            <IconMenu />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <UserMenu compact />
          </div>
        </div>
      </div>
    </div>
  );
}
