"use client";

import Link from "next/link";
import { DASHBOARD_PATH } from "@/dashboard/paths";
import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";
import { IconArrowLeft } from "@/dashboard/components/icons";

type CreateDeliveryFlowPageHeaderProps = {
  title: string;
  subtitle: string;
  showBackToDashboard?: boolean;
};

function BackToDashboardLink() {
  return (
    <Link
      href={DASHBOARD_PATH}
      className="inline-flex cursor-pointer items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <IconArrowLeft className="h-4 w-4" />
      Back to dashboard
    </Link>
  );
}

function FlowTitle({ title, subtitle }: CreateDeliveryFlowPageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-heading font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-body text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function CreateDeliveryFlowPageHeader({
  title,
  subtitle,
  showBackToDashboard = true,
}: CreateDeliveryFlowPageHeaderProps) {
  return (
    <div className="bg-white">
      <div className="hidden xl:block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {showBackToDashboard ? <BackToDashboardLink /> : null}
            <div className={showBackToDashboard ? "mt-3" : undefined}>
              <FlowTitle title={title} subtitle={subtitle} />
            </div>
          </div>
          <AuthenticatedDesktopActions />
        </div>
      </div>

      <AuthenticatedMobilePageHeader>
        {showBackToDashboard ? <BackToDashboardLink /> : null}
        <FlowTitle title={title} subtitle={subtitle} />
      </AuthenticatedMobilePageHeader>
    </div>
  );
}
