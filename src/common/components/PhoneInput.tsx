"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import PhoneInputLib from "react-phone-number-input";
import PhoneCountrySelect from "./PhoneCountrySelect";

const phoneInputClasses =
  "w-full h-10 min-w-0 flex-1 px-3.5 text-small bg-background text-foreground border border-border rounded-[4px] placeholder:text-muted-foreground transition-colors duration-150 hover:border-foreground/25 focus:border-foreground focus:ring-1 focus:ring-foreground/10 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 md:h-11 md:px-4 md:text-body";

const PhoneTextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(function PhoneTextInput({ className = "", error = false, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`${phoneInputClasses} ${error ? "border-foreground ring-1 ring-foreground/20" : ""} ${className}`}
      aria-invalid={error || undefined}
      {...props}
    />
  );
});

type PhoneInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export default function PhoneInput({
  id,
  name,
  value,
  onChange,
  error = false,
  placeholder = "Enter phone number",
  disabled = false,
}: PhoneInputProps) {
  return (
    <PhoneInputLib
      id={id}
      name={name}
      international
      withCountryCallingCode
      defaultCountry="IN"
      addInternationalOption={false}
      countryCallingCodeEditable={false}
      countrySelectComponent={PhoneCountrySelect}
      value={value || undefined}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      inputComponent={PhoneTextInput}
      numberInputProps={{
        placeholder,
        error,
        autoComplete: "tel",
        type: "tel",
      }}
      disabled={disabled}
      className={`phone-input-field${error ? " phone-input-field--error" : ""}`}
    />
  );
}
