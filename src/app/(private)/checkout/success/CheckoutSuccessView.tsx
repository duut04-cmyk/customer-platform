"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DASHBOARD_MAIN } from "@/dashboard/components/layout";
import { deliveryTrackingPath } from "@/deliveries/paths";
import {
  clearCheckoutDeliveryId,
  readCheckoutDeliveryId,
} from "@/lib/payments/checkout-delivery-id";

export default function CheckoutSuccessView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryDeliveryId = searchParams.get("deliveryId")?.trim() || null;
  const [storedDeliveryId] = useState<string | null>(() => readCheckoutDeliveryId());

  const deliveryId = queryDeliveryId ?? storedDeliveryId;

  useEffect(() => {
    if (!deliveryId) {
      return;
    }
    clearCheckoutDeliveryId();
    router.replace(deliveryTrackingPath(deliveryId));
  }, [deliveryId, router]);

  if (deliveryId) {
    return (
      <main className={`${DASHBOARD_MAIN} min-w-0 bg-white`}>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
          <p className="text-body font-semibold text-foreground">Payment received</p>
          <p className="text-small text-muted-foreground">Opening tracking…</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`${DASHBOARD_MAIN} min-w-0 bg-white`}>
      <div className="mx-auto max-w-lg space-y-6 py-8 md:py-12">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white"
            aria-hidden="true"
          >
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
              Payment submitted
            </h1>
            <p className="text-body text-muted-foreground">
              We could not open tracking automatically. Open your deliveries list to
              find this order.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/deliveries"
            className="inline-flex h-11 items-center justify-center rounded-[6px] bg-accent px-6 text-body font-semibold text-accent-foreground"
          >
            View deliveries
          </Link>
        </div>
      </div>
    </main>
  );
}
