"use client";

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

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  redirectTo = "/dashboard",
}: AuthModalProps) {
  return (
    <Modal
      open={mode !== null}
      onClose={onClose}
      className="max-h-[calc(100dvh-32px)] max-w-[440px] !p-0 overflow-y-auto md:max-w-[460px]"
    >
      <div className="relative px-6 py-6 md:px-8 md:py-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mb-5 flex justify-center pt-1">
          <Logo className="text-2xl" />
        </div>

        {mode === "login" && (
          <LoginForm
            onSwitchToSignup={() => onSwitchMode("signup")}
            redirectTo={redirectTo}
          />
        )}
        {mode === "signup" && (
          <SignupForm
            onSwitchToLogin={() => onSwitchMode("login")}
            redirectTo={redirectTo}
          />
        )}
      </div>
    </Modal>
  );
}
