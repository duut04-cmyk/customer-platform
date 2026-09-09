"use client";

import { useState } from "react";
import Footer from "@/footer";
import Header from "@/header";
import { AuthModal, type AuthMode } from "@/auth";
import CTA from "./components/CTA";
import Difference from "./components/Difference";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhyDutt from "./components/WhyDutt";

export default function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const openLogin = () => setAuthMode("login");
  const openSignup = () => setAuthMode("signup");
  const closeAuth = () => setAuthMode(null);

  return (
    <>
      <Header onLogin={openLogin} />
      <main>
        <Hero onCreateDelivery={openSignup} />
        <HowItWorks />
        <WhyDutt />
        <Difference />
        <CTA onCreateDelivery={openSignup} />
      </main>
      <Footer />
      <AuthModal mode={authMode} onClose={closeAuth} onSwitchMode={setAuthMode} />
    </>
  );
}
