"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { mockNavigateToDashboard } from "@/auth/mockAuth";
import AuthDivider from "./AuthDivider";
import CaptchaPlaceholder from "./CaptchaPlaceholder";
import GoogleButton from "./GoogleButton";
import { LoadingSpinner } from "./icons";
import PasswordInput from "./PasswordInput";

type SignupFormProps = {
  onSwitchToLogin: () => void;
  redirectTo?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  terms?: string;
};

export default function SignupForm({
  onSwitchToLogin,
  redirectTo = "/dashboard",
}: SignupFormProps) {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const termsId = useId();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const terms = formData.get("terms") === "on";

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "This field is required.";
    if (!email) nextErrors.email = "This field is required.";
    if (!phone) nextErrors.phone = "This field is required.";
    if (!password) nextErrors.password = "This field is required.";
    if (!terms) nextErrors.terms = "You must agree to the terms.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await mockNavigateToDashboard(router, redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-subheading font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="text-small text-muted-foreground">
          Send deliveries without the hassle.
        </p>
      </div>

      <GoogleButton disabled={loading} redirectTo={redirectTo} />

      <AuthDivider />

      <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor={nameId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
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
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.name}
            </p>
          )}
        </div>

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

        <div>
          <label
            htmlFor={phoneId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
            Phone number
          </label>
          <Input
            id={phoneId}
            name="phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            error={!!errors.phone}
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="mb-1.5 block text-small font-medium text-foreground"
          >
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
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-small font-medium text-foreground">CAPTCHA</p>
          <CaptchaPlaceholder />
        </div>

        <div>
          <label htmlFor={termsId} className="flex cursor-pointer items-start gap-2.5">
            <input
              id={termsId}
              name="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
            />
            <span className="text-small leading-snug text-muted-foreground">
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
            <p className="mt-1.5 text-caption text-foreground" role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full gap-2 text-body font-semibold"
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
      </form>

      <p className="text-center text-small text-muted-foreground">
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
