"use client";

import { forwardRef, useMemo, type InputHTMLAttributes } from "react";
import PhoneInputLib, { parsePhoneNumber } from "react-phone-number-input";
import PhoneCountrySelect from "./PhoneCountrySelect";

const phoneInputClasses =
  "PhoneInputInput w-full min-w-0 flex-1 border-0 bg-transparent px-3 text-small text-foreground placeholder:text-muted-foreground/55 outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 md:px-3.5";

const PhoneTextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(function PhoneTextInput({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${phoneInputClasses} ${className}`} {...props} />;
});

function isCountryCodeOnly(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (/^\+\d{1,4}$/.test(trimmed)) {
    return true;
  }
  try {
    const parsed = parsePhoneNumber(trimmed);
    return Boolean(parsed && !parsed.nationalNumber);
  } catch {
    return false;
  }
}

function valueForPhoneControl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || isCountryCodeOnly(trimmed)) {
    return undefined;
  }
  return trimmed;
}

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
  const controlValue = useMemo(() => valueForPhoneControl(value), [value]);

  return (
    <PhoneInputLib
      id={id}
      name={name}
      international={false}
      withCountryCallingCode={false}
      defaultCountry="IN"
      addInternationalOption={false}
      countryCallingCodeEditable={false}
      countrySelectComponent={PhoneCountrySelect}
      value={controlValue}
      onChange={(nextValue) => {
        if (!nextValue) {
          onChange("");
          return;
        }
        if (isCountryCodeOnly(nextValue)) {
          onChange("");
          return;
        }
        onChange(nextValue);
      }}
      inputComponent={PhoneTextInput}
      numberInputProps={{
        placeholder,
        "aria-invalid": error || undefined,
        autoComplete: "tel",
        type: "tel",
      }}
      disabled={disabled}
      className={`phone-input-field${error ? " phone-input-field--error" : ""}`}
    />
  );
}
