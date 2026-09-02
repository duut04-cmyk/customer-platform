"use client";

import { useRouter } from "next/navigation";
import Button from "@/common/components/Button";
import { deliveryTrackingPath } from "../../mockDeliveries";
import type { Delivery } from "../../types";

type DeliveryActionsProps = {
  delivery: Delivery;
};

export default function DeliveryActions({ delivery }: DeliveryActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        className="h-11 px-8 text-body font-semibold"
        onClick={() => router.push(deliveryTrackingPath(delivery.id))}
      >
        Track delivery
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="h-11 px-8 text-body font-semibold"
        onClick={() => router.push("/dashboard")}
      >
        Back to dashboard
      </Button>
    </div>
  );
}
