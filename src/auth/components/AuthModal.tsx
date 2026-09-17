"use client";

import {
  authModalBodyClassName,
  authModalCloseButtonClassName,
  authModalHeaderClassName,
  authModalShellClassName,
} from "@/auth/auth-modal-layout";
import Logo from "@/common/components/Logo";
import Modal from "@/common/components/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export type AuthMode = "login" | "signup";

type AuthModalProps = {
  mode: AuthMode | null;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  redirectTo?: string;
};

function AuthModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={authModalCloseButtonClassName}
      aria-label="Close"
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
  return (
    <Modal open={mode !== null} onClose={onClose} className={authModalShellClassName}>
      <div className={authModalHeaderClassName}>
        <AuthModalCloseButton onClose={onClose} />
        <div className="flex justify-center pt-1">
          <Logo className="text-xl md:text-2xl" />
        </div>
      </div>

      <div className={authModalBodyClassName}>
        {mode === "login" && (
          <LoginForm
            onSwitchToSignup={() => onSwitchMode("signup")}
            redirectTo={redirectTo}
          />
        )}
        {mode === "signup" && (
          <SignupForm
            onSwitchToLogin={() => onSwitchMode("login")}
            onAuthSuccess={onClose}
            redirectTo={redirectTo}
          />
        )}
      </div>
    </Modal>
  );
}
