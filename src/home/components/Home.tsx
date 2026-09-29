"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Footer from "@/footer";
import Header from "@/header";
import { AuthModal, type AuthMode } from "@/auth";
import { useAuthStore } from "@/stores/auth.store";
import CTA from "./CTA";
import Difference from "./Difference";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import WhyDutt from "./WhyDutt";

function resolveAuthMode(value: string | null): AuthMode | null {
  if (value === "login" || value === "signup") {
    return value;
  }
  return null;
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlAuth = resolveAuthMode(searchParams.get("auth"));
  const [manualMode, setManualMode] = useState<AuthMode | null>(null);
  const redirectTo = searchParams.get("next") ?? "/dashboard";

  const authMode = urlAuth ?? manualMode;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const openLogin = () => setManualMode("login");
  const openSignup = () => setManualMode("signup");
  const closeAuth = useCallback(() => {
    setManualMode(null);
    if (urlAuth) {
      router.replace("/", { scroll: false });
    }
  }, [router, urlAuth]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated || authMode === null) return;
    const timer = window.setTimeout(() => {
      closeAuth();
      router.replace(redirectTo);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authMode, closeAuth, isAuthenticated, isInitializing, redirectTo, router]);

  return (
    <>
      <Header onLogin={openLogin} onGetStarted={openSignup} />
      <main className="overflow-x-hidden bg-hero-surface">
        <Hero onCreateDelivery={openSignup} />
        <HowItWorks />
        <WhyDutt />
        <Difference />
        <CTA onCreateDelivery={openSignup} />
      </main>
      <Footer />
      <AuthModal
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={setManualMode}
        redirectTo={redirectTo}
      />
    </>
  );
}
