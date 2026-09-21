"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { login, resendEmailOtp, signup, verifyEmailOtp } from "@/api/auth";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import { establishSession } from "@/auth/establishSession";
import { mapE164ToSplitPhoneFields } from "@/auth/phone-mapper";
import { validatePassword } from "@/auth/passwordPolicy";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import PhoneInput from "@/common/components/PhoneInput";
import AuthDivider from "./AuthDivider";
import GoogleButton from "./GoogleButton";
import { LoadingSpinner } from "./icons";
import PasswordInput from "./PasswordInput";
import VerifyEmailOtpForm from "./VerifyEmailOtpForm";

type SignupFormProps = {
  onSwitchToLogin: () => void;
  onAuthSuccess?: () => void;
  redirectTo?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  terms?: string;
};

type SignupStep = "details" | "verify-otp";

export default function SignupForm({
  onSwitchToLogin,
  onAuthSuccess,
  redirectTo = "/dashboard",
}: SignupFormProps) {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const termsId = useId();
  const [step, setStep] = useState<SignupStep>("details");
  const [phone, setPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const terms = formData.get("terms") === "on";

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "This field is required.";
    if (!email) nextErrors.email = "This field is required.";
    if (!phone) nextErrors.phone = "This field is required.";
    if (!password) nextErrors.password = "This field is required.";
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) nextErrors.password = passwordError;
    }
    if (!terms) nextErrors.terms = "You must agree to the terms.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const { phoneCountryCode, phoneNumber } = mapE164ToSplitPhoneFields(phone);
      await signup({
        name,
        email,
        password,
        phoneCountryCode,
        phoneNumber,
      });
      setSignupEmail(email);
      setSignupPassword(password);
      setStep("verify-otp");
      toast.success("Verification code sent. Check your email.");
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Unable to create account."));
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify-otp") {
    return (
      <VerifyEmailOtpForm
        email={signupEmail}
        onBack={() => setStep("details")}
        onVerified={async () => {
          try {
            const response = await login({
              email: signupEmail,
              password: signupPassword,
            });
            establishSession(response.data, response.data.user);
            setSignupPassword("");
            onAuthSuccess?.();
            router.push(redirectTo);
            toast.success("Welcome! Your account is ready.");
          } catch (cause) {
            setSignupPassword("");
            toast.error(
              getAuthErrorMessage(cause, "Email verified. Please sign in to continue."),
            );
            onSwitchToLogin();
          }
        }}
        verifyHandler={async (email, otp) => {
          await verifyEmailOtp({ email, otp });
        }}
        resendHandler={async (email) => {
          await resendEmailOtp({ email });
        }}
      />
    );
  }

  const fieldLabelClassName = "mb-1 block text-small font-medium text-foreground";
  const fieldErrorClassName = "mt-1 text-caption text-foreground";

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-0.5 text-center sm:space-y-1">
        <h2 className="text-heading font-bold tracking-tight text-foreground sm:text-subheading">
          Create your account
        </h2>
        <p className="text-caption text-muted-foreground sm:text-small">
          Send deliveries without the hassle.
        </p>
      </div>

      <GoogleButton disabled={loading} redirectTo={redirectTo} />

      <AuthDivider />

      <form
        className="grid grid-cols-1 gap-y-3 sm:gap-y-3.5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label htmlFor={nameId} className={fieldLabelClassName}>
            Full name
          </label>
          <Input
            id={nameId}
            name="name"
            type="text"
            placeholder="Your name"
            error={!!errors.name}
            autoComplete="name"
          />
          {errors.name && (
            <p className={fieldErrorClassName} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={emailId} className={fieldLabelClassName}>
            Email
          </label>
          <Input
            id={emailId}
            name="email"
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <p className={fieldErrorClassName} role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={phoneId} className={fieldLabelClassName}>
            Phone number
          </label>
          <PhoneInput
            id={phoneId}
            name="phone"
            value={phone}
            onChange={setPhone}
            error={!!errors.phone}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className={fieldErrorClassName} role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={passwordId} className={fieldLabelClassName}>
            Password
          </label>
          <PasswordInput
            id={passwordId}
            name="password"
            placeholder="Create a password"
            error={!!errors.password}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className={fieldErrorClassName} role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={termsId} className="flex cursor-pointer items-start gap-2">
            <input
              id={termsId}
              name="terms"
              type="checkbox"
              className="auth-checkbox mt-0.5"
            />
            <span className="text-caption leading-snug text-muted-foreground sm:text-small">
              I agree to Doot&apos;s{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-2 hover:underline"
                onClick={(event) => event.preventDefault()}
              >
                Terms
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-2 hover:underline"
                onClick={(event) => event.preventDefault()}
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className={fieldErrorClassName} role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="h-11 w-full gap-2 rounded-[6px] text-body font-semibold"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>

      <p className="text-center text-caption text-muted-foreground sm:text-small">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="cursor-pointer font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
