"use client";

import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";
import CreateDeliveryHeader from "./CreateDeliveryHeader";

type CreateDeliveryPageTopSectionProps = {
  showHeader?: boolean;
};

export default function CreateDeliveryPageTopSection({
  showHeader = true,
}: CreateDeliveryPageTopSectionProps) {
  return (
    <div className="bg-white">
      <div className="hidden xl:block">
        <div className="flex items-start justify-between gap-4">
          {showHeader ? <CreateDeliveryHeader /> : <div />}
          <AuthenticatedDesktopActions />
        </div>
      </div>

      {showHeader ? (
        <AuthenticatedMobilePageHeader>
          <CreateDeliveryHeader />
        </AuthenticatedMobilePageHeader>
      ) : (
        <AuthenticatedMobilePageHeader />
      )}
    </div>
  );
}
