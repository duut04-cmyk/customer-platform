import { parsePhoneNumber } from "react-phone-number-input";

export type SplitPhoneFields = {
  phoneCountryCode: string;
  phoneNumber: string;
};

export class PhoneMappingError extends Error {
  constructor(message = "Enter a valid phone number with country code.") {
    super(message);
    this.name = "PhoneMappingError";
  }
}

function parseStoredPhoneNumber(value: string) {
  const trimmed = value.trim();
  const direct = parsePhoneNumber(trimmed);
  if (direct) {
    return direct;
  }
  if (/^\d{6,}$/.test(trimmed)) {
    return parsePhoneNumber(trimmed, "IN");
  }
  return undefined;
}

/** Returns an error message when invalid, or null when the value is a valid phone. */
export function getPhoneValidationError(e164: string): string | null {
  const trimmed = e164.trim();
  if (!trimmed) {
    return "Phone number is required.";
  }
  try {
    mapE164ToSplitPhoneFields(trimmed);
    return null;
  } catch (error) {
    if (error instanceof PhoneMappingError) {
      return error.message;
    }
    return "Enter a valid phone number with country code.";
  }
}

/**
 * Maps an E.164 value from PhoneInput into backend split phone fields.
 */
export function mapE164ToSplitPhoneFields(e164: string): SplitPhoneFields {
  const trimmed = e164.trim();
  if (!trimmed) {
    throw new PhoneMappingError("Phone number is required.");
  }

  const parsed = parseStoredPhoneNumber(trimmed);
  if (!parsed || !parsed.isValid()) {
    throw new PhoneMappingError();
  }

  const countryCode = `+${parsed.countryCallingCode}`;
  const nationalNumber = parsed.nationalNumber;

  if (!nationalNumber) {
    throw new PhoneMappingError();
  }

  return {
    phoneCountryCode: countryCode,
    phoneNumber: nationalNumber,
  };
}
