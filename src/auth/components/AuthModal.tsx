"use client";

import { useState } from "react";
import {
  authModalBodyClassName,
  authModalCloseButtonClassName,
  authModalHeaderClassName,
  authModalShellClassName,
} from "@/auth/auth-modal-layout";
import Logo from "@/common/components/Logo";
import Modal from "@/common/components/Modal";
import LoginForm from "@/login/LoginForm";
import SignupForm from "@/signup/SignupForm";

export type AuthMode = "login" | "signup";

type AuthModalProps = {
  mode: AuthMode | null;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  redirectTo?: string;
};

function AuthModalCloseButton({
  onClose,
  disabled,
}: {
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClose}
      disabled={disabled}
      className={`${authModalCloseButtonClassName} disabled:cursor-not-allowed disabled:opacity-40`}
      aria-label="Close"
      aria-disabled={disabled}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  redirectTo = "/dashboard",
}: AuthModalProps) {
  const [authBusy, setAuthBusy] = useState(false);
  const isOpen = mode !== null;
  const blockDismiss = isOpen && authBusy;

  const handleClose = () => {
    setAuthBusy(false);
    onClose();
  };

  const handleSwitchMode = (next: AuthMode) => {
    if (authBusy) return;
    setAuthBusy(false);
    onSwitchMode(next);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      preventClose={blockDismiss}
      className={authModalShellClassName}
    >
      <div className={authModalHeaderClassName}>
        <AuthModalCloseButton onClose={handleClose} disabled={blockDismiss} />
        <div className="flex justify-center pt-1">
          <Logo className="text-xl md:text-2xl" />
        </div>
      </div>

      <div className={authModalBodyClassName} aria-busy={authBusy}>
        {mode === "login" && (
          <LoginForm
            onSwitchToSignup={() => handleSwitchMode("signup")}
            onAuthSuccess={handleClose}
            redirectTo={redirectTo}
            onBusyChange={setAuthBusy}
          />
        )}
        {mode === "signup" && (
          <SignupForm
            onSwitchToLogin={() => handleSwitchMode("login")}
            onAuthSuccess={handleClose}
            redirectTo={redirectTo}
            onBusyChange={setAuthBusy}
          />
        )}
      </div>
    </Modal>
  );
}
