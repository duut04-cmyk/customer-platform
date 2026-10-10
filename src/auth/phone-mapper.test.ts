import { describe, expect, it } from "vitest";
import {
  getPhoneValidationError,
  mapE164ToSplitPhoneFields,
  PhoneMappingError,
} from "./phone-mapper";

describe("mapE164ToSplitPhoneFields", () => {
  it("maps an Indian E.164 number to split fields", () => {
    expect(mapE164ToSplitPhoneFields("+919876543210")).toEqual({
      phoneCountryCode: "+91",
      phoneNumber: "9876543210",
    });
  });

  it("maps a US E.164 number to split fields", () => {
    expect(mapE164ToSplitPhoneFields("+14155552671")).toEqual({
      phoneCountryCode: "+1",
      phoneNumber: "4155552671",
    });
  });

  it("throws for invalid phone numbers", () => {
    expect(() => mapE164ToSplitPhoneFields("invalid")).toThrow(PhoneMappingError);
  });

  it("throws for empty values", () => {
    expect(() => mapE164ToSplitPhoneFields("")).toThrow(PhoneMappingError);
  });

  it("maps a 10-digit national Indian number when stored without country code", () => {
    expect(mapE164ToSplitPhoneFields("9876543210")).toEqual({
      phoneCountryCode: "+91",
      phoneNumber: "9876543210",
    });
  });
});

describe("getPhoneValidationError", () => {
  it("returns null for valid E.164", () => {
    expect(getPhoneValidationError("+919876543210")).toBeNull();
  });

  it("returns a message for country-code-only values", () => {
    expect(getPhoneValidationError("+91")).toBeTruthy();
  });

  it("returns required message for empty input", () => {
    expect(getPhoneValidationError("")).toBe("Phone number is required.");
  });
});
