"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import OtpInput from "@/auth/components/OtpInput";
import {
  generateDeliveryOtp,
  generatePickupOtp,
  verifyDeliveryOtp,
  verifyPickupOtp,
} from "@/api/deliveries/delivery.api";
import { ApiError } from "@/api/errors";
import { OTP_COPY } from "../../customerCopy";
import type { Delivery } from "../../types";

type OtpVerificationSectionProps = {
  delivery: Delivery;
  onVerified: () => void;
};

function OtpPanel({
  title,
  description,
  verified,
  verifiedMessage,
  onSend,
  onVerify,
  sending,
  verifying,
  sendError,
  verifyError,
  readOnly = false,
}: {
  title: string;
  description: string;
  verified: boolean;
  verifiedMessage: string;
  onSend?: () => Promise<boolean>;
  onVerify?: (otp: string) => Promise<void>;
  sending: boolean;
  verifying: boolean;
  sendError: string | null;
  verifyError: string | null;
  readOnly?: boolean;
}) {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);

  if (verified || readOnly) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-small text-muted-foreground">{verifiedMessage}</p>
        <span className="mt-2 inline-flex rounded-pill bg-surface-accent px-2.5 py-0.5 text-caption font-semibold text-accent">
          Verified
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3">
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 text-small text-muted-foreground">{description}</p>

      {!sent ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            className="h-9 text-small"
            disabled={sending}
            onClick={async () => {
              if (!onSend) return;
              const ok = await onSend();
              if (ok) setSent(true);
            }}
          >
            {sending ? "Sending…" : "Send verification code"}
          </Button>
          {sendError && (
            <p className="mt-2 text-caption text-red-600" role="alert">
              {sendError}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-small text-muted-foreground">
            Enter the 6-digit code sent to your email or phone.
          </p>
          <OtpInput value={otp} onChange={setOtp} />
          <Button
            type="button"
            className="h-9 text-small"
            disabled={verifying || otp.length !== 6}
            onClick={() => onVerify?.(otp)}
          >
            {verifying ? "Verifying…" : "Verify code"}
          </Button>
          {verifyError && (
            <p className="text-caption text-red-600" role="alert">
              {verifyError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function OtpVerificationSection({
  delivery,
  onVerified,
}: OtpVerificationSectionProps) {
  const [pickupSending, setPickupSending] = useState(false);
  const [pickupVerifying, setPickupVerifying] = useState(false);
  const [deliverySending, setDeliverySending] = useState(false);
  const [deliveryVerifying, setDeliveryVerifying] = useState(false);
  const [pickupSendError, setPickupSendError] = useState<string | null>(null);
  const [pickupVerifyError, setPickupVerifyError] = useState<string | null>(null);
  const [deliverySendError, setDeliverySendError] = useState<string | null>(null);
  const [deliveryVerifyError, setDeliveryVerifyError] = useState<string | null>(null);

  const pickupVerified =
    delivery.pickupOtpVerified ??
    ["picked_up", "in_transit", "delivery_otp_pending", "delivered"].includes(
      delivery.status,
    );
  const deliveryVerified =
    delivery.deliveryOtpVerified ?? delivery.status === "delivered";

  const showPickupActionable =
    delivery.status === "booked" ||
    delivery.status === "driver_assigned" ||
    delivery.status === "pickup_otp_pending";

  const showPickupCompleted =
    pickupVerified &&
    (delivery.status === "picked_up" ||
      delivery.status === "in_transit" ||
      delivery.status === "delivery_otp_pending");

  const showDeliveryActionable =
    delivery.status === "in_transit" || delivery.status === "delivery_otp_pending";

  if (
    !showPickupActionable &&
    !showPickupCompleted &&
    !showDeliveryActionable &&
    !deliveryVerified
  ) {
    return null;
  }

  const handleSendPickup = async (): Promise<boolean> => {
    setPickupSending(true);
    setPickupSendError(null);
    try {
      await generatePickupOtp(delivery.id);
      return true;
    } catch (err) {
      setPickupSendError(
        err instanceof ApiError ? err.message : "Could not send pickup code.",
      );
      return false;
    } finally {
      setPickupSending(false);
    }
  };

  const handleVerifyPickup = async (otp: string) => {
    setPickupVerifying(true);
    setPickupVerifyError(null);
    try {
      await verifyPickupOtp(delivery.id, otp);
      onVerified();
    } catch (err) {
      setPickupVerifyError(
        err instanceof ApiError ? err.message : "Incorrect or expired code.",
      );
    } finally {
      setPickupVerifying(false);
    }
  };

  const handleSendDelivery = async (): Promise<boolean> => {
    setDeliverySending(true);
    setDeliverySendError(null);
    try {
      await generateDeliveryOtp(delivery.id);
      return true;
    } catch (err) {
      setDeliverySendError(
        err instanceof ApiError ? err.message : "Could not send delivery code.",
      );
      return false;
    } finally {
      setDeliverySending(false);
    }
  };

  const handleVerifyDelivery = async (otp: string) => {
    setDeliveryVerifying(true);
    setDeliveryVerifyError(null);
    try {
      await verifyDeliveryOtp(delivery.id, otp);
      onVerified();
    } catch (err) {
      setDeliveryVerifyError(
        err instanceof ApiError ? err.message : "Incorrect or expired code.",
      );
    } finally {
      setDeliveryVerifying(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-body font-bold text-foreground">OTP verification</h2>
      <p className="mt-1 text-caption text-muted-foreground">
        Codes are sent to your registered email and phone. Share them with your driver
        or recipient when required.
      </p>
      <div className="mt-3 space-y-3">
        {showPickupActionable && !pickupVerified && (
          <OtpPanel
            title={OTP_COPY.pickupTitle}
            description={OTP_COPY.pickupPending}
            verified={false}
            verifiedMessage={OTP_COPY.pickupVerified}
            onSend={handleSendPickup}
            onVerify={handleVerifyPickup}
            sending={pickupSending}
            verifying={pickupVerifying}
            sendError={pickupSendError}
            verifyError={pickupVerifyError}
          />
        )}
        {showPickupCompleted && (
          <OtpPanel
            title={OTP_COPY.pickupTitle}
            description={OTP_COPY.pickupVerified}
            verified
            verifiedMessage={OTP_COPY.pickupVerified}
            sending={false}
            verifying={false}
            sendError={null}
            verifyError={null}
            readOnly
          />
        )}
        {showDeliveryActionable && !deliveryVerified && (
          <OtpPanel
            title={OTP_COPY.deliveryTitle}
            description={OTP_COPY.deliveryPending}
            verified={false}
            verifiedMessage={OTP_COPY.deliveryVerified}
            onSend={handleSendDelivery}
            onVerify={handleVerifyDelivery}
            sending={deliverySending}
            verifying={deliveryVerifying}
            sendError={deliverySendError}
            verifyError={deliveryVerifyError}
          />
        )}
      </div>
    </section>
  );
}
