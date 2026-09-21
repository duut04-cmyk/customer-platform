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

/**
 * Maps an E.164 value from PhoneInput into backend split phone fields.
 */
export function mapE164ToSplitPhoneFields(e164: string): SplitPhoneFields {
  const trimmed = e164.trim();
  if (!trimmed) {
    throw new PhoneMappingError("Phone number is required.");
  }

  const parsed = parsePhoneNumber(trimmed);
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
