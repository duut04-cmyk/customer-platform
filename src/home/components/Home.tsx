"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Footer from "@/footer";
import Header from "@/header";
import { AuthModal, type AuthMode } from "@/auth";
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

  const openLogin = () => setManualMode("login");
  const openSignup = () => setManualMode("signup");
  const closeAuth = () => {
    setManualMode(null);
    if (urlAuth) {
      router.replace("/", { scroll: false });
    }
  };

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
