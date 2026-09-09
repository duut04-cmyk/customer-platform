"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Logo from "@/common/components/Logo";
import { AuthModal, type AuthMode } from "@/auth";
import GoogleButton from "./GoogleButton";

export default function GetStartedPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const initialMode = searchParams.get("mode") === "login" ? "login" : "signup";
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const openEmailAuth = (mode: AuthMode) => setAuthMode(mode);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
        >
          <Logo className="text-2xl" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="space-y-3 text-center">
          <h1 className="text-heading font-bold tracking-tight text-foreground md:text-heading-md">
            {initialMode === "login" ? "Welcome back" : "Get started with Doot"}
          </h1>
          <p className="text-body leading-relaxed text-muted-foreground">
            {initialMode === "login"
              ? "Sign in to manage your deliveries."
              : "Create an account to book deliveries with transparent pricing."}
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <GoogleButton redirectTo={next} />

          <button
            type="button"
            onClick={() => openEmailAuth(initialMode === "login" ? "login" : "signup")}
            className="h-12 w-full cursor-pointer rounded-pill border border-border bg-background text-body font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {initialMode === "login" ? "Sign in with email" : "Sign up with email"}
          </button>
        </div>

        <p className="mt-8 text-center text-small text-muted-foreground">
          {initialMode === "login" ? (
            <>
              New to Doot?{" "}
              <Link
                href={`/get-started?next=${encodeURIComponent(next)}`}
                className="font-semibold text-accent hover:text-accent/80"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href={`/get-started?mode=login&next=${encodeURIComponent(next)}`}
                className="font-semibold text-accent hover:text-accent/80"
              >
                Sign in
              </Link>
            </>
          )}
        </p>

        <p className="mt-6 text-center">
          <Link
            href="/create-delivery"
            className="text-small font-medium text-muted-foreground hover:text-foreground"
          >
            Continue without signing in
          </Link>
        </p>
      </main>

      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={setAuthMode}
        redirectTo={next}
      />
    </div>
  );
}
