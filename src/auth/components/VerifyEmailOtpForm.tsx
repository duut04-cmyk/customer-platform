"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import Button from "@/common/components/Button";
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from "../auth.constants";
import { useResendCooldown } from "../hooks/useResendCooldown";
import { LoadingSpinner } from "./icons";
import OtpInput from "./OtpInput";

type VerifyEmailOtpFormProps = {
  email: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  onVerified: () => void | Promise<void>;
  onBack?: () => void;
  resendHandler: (email: string) => Promise<void>;
  verifyHandler: (email: string, otp: string) => Promise<void>;
};

function formatCooldown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function VerifyEmailOtpForm({
  email,
  title = "Verify your email",
  description,
  submitLabel = "Verify and continue",
  onVerified,
  onBack,
  resendHandler,
  verifyHandler,
}: VerifyEmailOtpFormProps) {
  const otpId = useId();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { secondsLeft, canResend, startCooldown } = useResendCooldown(
    OTP_RESEND_COOLDOWN_SECONDS,
  );

  useEffect(() => {
    startCooldown();
  }, [startCooldown]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code sent to your email.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verifyHandler(email, otp);
      toast.success("Email verified successfully.");
      await onVerified();
    } catch (cause) {
      const message = getAuthErrorMessage(cause, "Invalid verification code.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError(null);
    try {
      await resendHandler(email);
      startCooldown();
      toast.success("A new verification code has been sent.");
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Unable to resend code."));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-subheading font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-small text-muted-foreground">
          {description ?? (
            <>
              We sent a {OTP_LENGTH}-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          )}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor={otpId} className="sr-only">
            Verification code
          </label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={loading}
            error={!!error}
            autoFocus
          />
          {error && (
            <p className="mt-3 text-center text-caption text-foreground" role="alert">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full gap-2 rounded-[6px] text-body font-semibold"
          disabled={loading || otp.length !== OTP_LENGTH}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Verifying...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      <div className="space-y-3 text-center text-small text-muted-foreground">
        <p>
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="cursor-pointer font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          ) : (
            <span className="font-medium text-foreground/70">
              Resend available in {formatCooldown(secondsLeft)}
            </span>
          )}
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
