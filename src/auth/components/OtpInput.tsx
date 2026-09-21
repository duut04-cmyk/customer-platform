"use client";

import {
  useCallback,
  useId,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { OTP_LENGTH } from "../auth.constants";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
};

export default function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
}: OtpInputProps) {
  const groupId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  const updateDigit = useCallback(
    (index: number, digit: string) => {
      const sanitized = digit.replace(/\D/g, "").slice(-1);
      const next = digits.slice();
      next[index] = sanitized;
      onChange(next.join("").slice(0, OTP_LENGTH));
      if (sanitized && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange],
  );

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div
      className="flex justify-center gap-2 sm:gap-2.5"
      role="group"
      aria-labelledby={groupId}
    >
      <span id={groupId} className="sr-only">
        Enter {OTP_LENGTH}-digit verification code
      </span>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          aria-invalid={error || undefined}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={`h-12 w-10 rounded-[4px] border bg-background text-center text-subheading font-bold text-foreground transition-colors focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-11 ${
            error
              ? "border-foreground ring-1 ring-foreground/20"
              : "border-border hover:border-foreground/25"
          }`}
        />
      ))}
    </div>
  );
}
