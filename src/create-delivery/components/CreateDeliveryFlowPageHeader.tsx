"use client";

import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import { useDashboardShell } from "@/dashboard/components/DashboardShellContext";
import { IconArrowLeft, IconMenu } from "@/dashboard/components/icons";
import NotificationBell from "@/dashboard/components/NotificationBell";
import UserMenu from "@/dashboard/components/UserMenu";

type CreateDeliveryFlowPageHeaderProps = {
  title: string;
  subtitle: string;
};

function HeaderContent({ title, subtitle }: CreateDeliveryFlowPageHeaderProps) {
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
      </div>
    </div>
  );
}

export default function CreateDeliveryFlowPageHeader({
  title,
  subtitle,
}: CreateDeliveryFlowPageHeaderProps) {
  const { openMobileNav } = useDashboardShell();

  return (
    <div className="bg-white">
      <div className="hidden lg:block">
        <div className="flex items-start justify-between gap-4">
          <HeaderContent title={title} subtitle={subtitle} />
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        <HeaderContent title={title} subtitle={subtitle} />

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
