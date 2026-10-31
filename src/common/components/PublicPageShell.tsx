"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Footer from "@/footer";
import Header from "@/header";
import { AuthModal, type AuthMode } from "@/auth";
import { CREATE_DELIVERY_PATH } from "@/create-delivery/paths";
import { useAuthStore } from "@/stores/auth.store";

function resolveAuthMode(value: string | null): AuthMode | null {
  if (value === "login" || value === "signup") {
    return value;
  }
  return null;
}

type PublicPageShellProps = {
  children: ReactNode;
};

export default function PublicPageShell({ children }: PublicPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlAuth = resolveAuthMode(searchParams.get("auth"));
  const [manualMode, setManualMode] = useState<AuthMode | null>(null);
  const redirectTo = searchParams.get("next") ?? CREATE_DELIVERY_PATH;

  const authMode = urlAuth ?? manualMode;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const openLogin = () => setManualMode("login");
  const openSignup = () => setManualMode("signup");
  const closeAuth = useCallback(() => {
    setManualMode(null);
    if (urlAuth) {
      const path = window.location.pathname;
      router.replace(path, { scroll: false });
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
      <main className="min-h-[70vh] overflow-x-hidden bg-[#FFFBF5]">{children}</main>
      <Footer onLogin={openLogin} onGetStarted={openSignup} />
      <AuthModal
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={setManualMode}
        redirectTo={redirectTo}
      />
    </>
  );
}
