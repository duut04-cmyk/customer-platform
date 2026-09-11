"use client";

import { OTP_COPY } from "../../customerCopy";
import type { Delivery } from "../../types";

type TrackingOtpSectionProps = {
  delivery: Delivery;
};

function OtpBlock({
  title,
  code,
  verified,
  pendingMessage,
  verifiedMessage,
}: {
  title: string;
  code?: string;
  verified: boolean;
  pendingMessage: string;
  verifiedMessage: string;
}) {
  if (!code) return null;

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          {verified ? (
            <p className="mt-1 text-small text-muted-foreground">{verifiedMessage}</p>
          ) : (
            <>
              <p className="mt-1 text-small text-muted-foreground">{pendingMessage}</p>
              <p className="mt-2 font-mono text-body-lg font-bold tracking-[0.2em] text-foreground">
                {code}
              </p>
            </>
          )}
        </div>
        {verified && (
          <span className="inline-flex rounded-pill bg-surface-accent px-2.5 py-0.5 text-caption font-semibold text-accent">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export default function TrackingOtpSection({ delivery }: TrackingOtpSectionProps) {
  if (!delivery.pickupOtp && !delivery.deliveryOtp) return null;

  const pickupVerified =
    delivery.pickupOtpVerified ??
    ["picked_up", "in_transit", "delivered"].includes(delivery.status);
  const deliveryVerified =
    delivery.deliveryOtpVerified ?? delivery.status === "delivered";

  const showPickup =
    delivery.status === "driver_assigned" ||
    (delivery.status === "booked" && delivery.pickupOtp);
  const showDelivery =
    delivery.status === "in_transit" ||
    delivery.status === "picked_up" ||
    (delivery.deliveryOtp && !deliveryVerified);

  if (!showPickup && !showDelivery) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-body font-bold text-foreground">OTP verification</h2>
      <p className="mt-1 text-caption text-muted-foreground">
        Share codes with your driver or recipient when required.
      </p>
      <div className="mt-3 space-y-3">
        {showPickup && (
          <OtpBlock
            title={OTP_COPY.pickupTitle}
            code={delivery.pickupOtp}
            verified={pickupVerified}
            pendingMessage={OTP_COPY.pickupPending}
            verifiedMessage={OTP_COPY.pickupVerified}
          />
        )}
        {showDelivery && (
          <OtpBlock
            title={OTP_COPY.deliveryTitle}
            code={delivery.deliveryOtp}
            verified={deliveryVerified}
            pendingMessage={OTP_COPY.deliveryPending}
            verifiedMessage={OTP_COPY.deliveryVerified}
          />
        )}
      </div>
    </section>
  );
}
