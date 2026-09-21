"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { login } from "@/api/auth";
import { getAuthErrorMessage } from "@/auth/auth-errors";
import { establishSession } from "@/auth/establishSession";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import { authFormStackClassName } from "@/auth/auth-modal-layout";
import AuthDivider from "./AuthDivider";
import ForgotPasswordModal from "./ForgotPasswordModal";
import GoogleButton from "./GoogleButton";
import { LoadingSpinner } from "./icons";
import PasswordInput from "./PasswordInput";

type LoginFormProps = {
  onSwitchToSignup: () => void;
  redirectTo?: string;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm({
  onSwitchToSignup,
  redirectTo = "/dashboard",
}: LoginFormProps) {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!email) nextErrors.email = "This field is required.";
    if (!password) nextErrors.password = "This field is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await login({ email, password });
      establishSession(response.data, response.data.user);
      router.push(redirectTo);
      toast.success("Signed in successfully.");
    } catch (cause) {
      toast.error(getAuthErrorMessage(cause, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={authFormStackClassName}>
        <div className="space-y-1 text-center">
          <h2 className="text-subheading font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="text-small text-muted-foreground">
            Sign in to manage your deliveries.
          </p>
        </div>

        <GoogleButton disabled={loading} redirectTo={redirectTo} />

        <AuthDivider />

        <form className="space-y-4.5" onSubmit={handleSubmit} noValidate>
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
              placeholder="Enter your email"
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
              htmlFor={passwordId}
              className="mb-1.5 block text-small font-medium text-foreground"
            >
              Password
            </label>
            <PasswordInput
              id={passwordId}
              name="password"
              placeholder="Enter your password"
              error={!!errors.password}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-1.5 text-caption text-foreground" role="alert">
                {errors.password}
              </p>
            )}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="cursor-pointer text-caption font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
              >
                Forgot password?
              </button>
            </div>
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
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="text-center text-small text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="cursor-pointer font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            Create an account
          </button>
        </p>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
