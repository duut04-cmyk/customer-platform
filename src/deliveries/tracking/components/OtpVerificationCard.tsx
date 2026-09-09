"use client";

import { OTP_COPY } from "../../customerCopy";
import type { Delivery } from "../../types";

type OtpVerificationCardProps = {
  delivery: Delivery;
};

type OtpBlockProps = {
  title: string;
  code?: string;
  verified: boolean;
  pendingMessage: string;
  verifiedMessage: string;
};

function OtpBlock({
  title,
  code,
  verified,
  pendingMessage,
  verifiedMessage,
}: OtpBlockProps) {
  if (!code) return null;

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          {verified ? (
            <p className="mt-2 text-body text-muted-foreground">{verifiedMessage}</p>
          ) : (
            <>
              <p className="mt-2 text-body text-muted-foreground">{pendingMessage}</p>
              <p className="mt-3 text-caption text-muted-foreground">
                {OTP_COPY.codeLabel}
              </p>
              <p
                className="mt-1 font-mono text-heading font-bold tracking-[0.2em] text-foreground"
                aria-label={`${OTP_COPY.codeLabel} ${code.split("").join(" ")}`}
              >
                {code}
              </p>
            </>
          )}
        </div>
        {verified && (
          <span className="inline-flex rounded-pill bg-surface-accent px-3 py-1 text-caption font-semibold text-accent">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export default function OtpVerificationCard({ delivery }: OtpVerificationCardProps) {
  if (delivery.status === "cancelled" || delivery.status === "failed") {
    return null;
  }

  if (!delivery.pickupOtp && !delivery.deliveryOtp) {
    return null;
  }

  const pickupVerified =
    delivery.pickupOtpVerified ??
    ["picked_up", "in_transit", "delivered"].includes(delivery.status);
  const deliveryVerified =
    delivery.deliveryOtpVerified ?? delivery.status === "delivered";

  return (
    <section
      className="rounded-xl border border-border bg-background p-6 shadow-sm"
      aria-labelledby="otp-verification-heading"
    >
      <h2
        id="otp-verification-heading"
        className="text-body-lg font-bold text-foreground"
      >
        OTP verification
      </h2>
      <p className="mt-1 text-body text-muted-foreground">
        Verify pickup and delivery with one-time codes.
      </p>

      <div className="mt-5 space-y-4">
        <OtpBlock
          title={OTP_COPY.pickupTitle}
          code={delivery.pickupOtp}
          verified={pickupVerified}
          pendingMessage={OTP_COPY.pickupPending}
          verifiedMessage={OTP_COPY.pickupVerified}
        />
        <OtpBlock
          title={OTP_COPY.deliveryTitle}
          code={delivery.deliveryOtp}
          verified={deliveryVerified}
          pendingMessage={OTP_COPY.deliveryPending}
          verifiedMessage={OTP_COPY.deliveryVerified}
        />
      </div>
    </section>
  );
}
