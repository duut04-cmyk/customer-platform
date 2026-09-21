"use client";

import {
  AuthenticatedDesktopActions,
  AuthenticatedMobilePageHeader,
} from "@/dashboard/components/AuthenticatedPageHeader";
import { isActiveDeliveryDetailStatus, type Delivery } from "../../types";

type DeliveryDetailHeaderProps = {
  delivery: Delivery;
};

function DeliveryDetailsTitle({ delivery }: { delivery: Delivery }) {
  const isActive = isActiveDeliveryDetailStatus(delivery.status);

  return (
    <div className="space-y-1">
      <h1 className="text-heading font-bold tracking-tight text-foreground">
        Delivery details
      </h1>
      <p className="text-body text-muted-foreground">
        {isActive
          ? "Track the full journey of your delivery."
          : "Here's the complete information about your delivery request."}
      </p>
    </div>
  );
}

export default function DeliveryDetailHeader({ delivery }: DeliveryDetailHeaderProps) {
  return (
    <div className="bg-white">
      <div className="hidden xl:block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DeliveryDetailsTitle delivery={delivery} />
          </div>
          <AuthenticatedDesktopActions />
        </div>
      </div>

      <AuthenticatedMobilePageHeader>
        <DeliveryDetailsTitle delivery={delivery} />
      </AuthenticatedMobilePageHeader>
    </div>
  );
}
