"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  forgotPassword,
  resendPasswordResetOtp,
  resetPassword,
  verifyPasswordResetOtp,
} from "@/api/auth";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import { validatePassword } from "@/auth/passwordPolicy";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Modal from "@/common/components/Modal";
import PasswordInput from "./PasswordInput";
import { LoadingSpinner } from "./icons";
import VerifyEmailOtpForm from "./VerifyEmailOtpForm";

type ForgotPasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
};

type ForgotPasswordStep = "email" | "otp" | "password";

export default function ForgotPasswordModal({
  open,
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps) {
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const resetState = () => {
    setStep("email");
    setEmail("");
    setResetToken(null);
    setErrors({});
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: "Email is required." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await forgotPassword({ email: trimmedEmail });
      toast.success("If an account exists, a verification code has been sent.");
      setStep("otp");
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Unable to send verification code."));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || !resetToken) return;

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "").trim();
    const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

    const nextErrors: typeof errors = {};
    if (!password) {
      nextErrors.password = "This field is required.";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) nextErrors.password = passwordError;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await resetPassword({
        resetToken,
        newPassword: password,
      });
      toast.success("Password updated. Please sign in with your new password.");
      handleClose();
      onBackToLogin?.();
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Unable to reset password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="max-h-[calc(100dvh-32px)] max-w-[440px] !rounded-[4px] !p-0 overflow-y-auto md:max-w-[460px]"
    >
      <div className="relative px-6 py-6 md:px-8 md:py-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {step === "email" && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h2 className="text-subheading font-bold tracking-tight text-foreground">
                Reset your password
              </h2>
              <p className="text-small text-muted-foreground">
                Enter your email and we&apos;ll send a verification code.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
              <div>
                <label
                  htmlFor={emailId}
                  className="mb-1.5 block text-small font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  error={!!errors.email}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1.5 text-caption text-foreground" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-[6px] text-body font-semibold"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending code...
                  </>
                ) : (
                  "Send verification code"
                )}
              </Button>
            </form>
          </div>
        )}

        {step === "otp" && (
          <VerifyEmailOtpForm
            email={email}
            title="Verify your email"
            description={`Enter the 6-digit code we sent to ${email}.`}
            submitLabel="Verify code"
            onBack={() => setStep("email")}
            onVerified={() => setStep("password")}
            resendHandler={async (targetEmail) => {
              await resendPasswordResetOtp({ email: targetEmail });
            }}
            verifyHandler={async (targetEmail, otp) => {
              const response = await verifyPasswordResetOtp({
                email: targetEmail,
                otp,
              });
              setResetToken(response.data.resetToken);
            }}
          />
        )}

        {step === "password" && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <h2 className="text-subheading font-bold tracking-tight text-foreground">
                Create a new password
              </h2>
              <p className="text-small text-muted-foreground">
                Choose a strong password for your account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSubmit} noValidate>
              <div>
                <label
                  htmlFor={passwordId}
                  className="mb-1.5 block text-small font-medium text-foreground"
                >
                  New password
                </label>
                <PasswordInput
                  id={passwordId}
                  name="password"
                  placeholder="Enter new password"
                  error={!!errors.password}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="mt-1.5 text-caption text-foreground" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={confirmPasswordId}
                  className="mb-1.5 block text-small font-medium text-foreground"
                >
                  Confirm password
                </label>
                <PasswordInput
                  id={confirmPasswordId}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  error={!!errors.confirmPassword}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-caption text-foreground" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-[6px] text-body font-semibold"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}
