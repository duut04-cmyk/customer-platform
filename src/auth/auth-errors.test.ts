import { describe, expect, it } from "vitest";
import { ApiError } from "@/api/errors";
import { getAuthErrorMessage } from "./auth-errors";
import { PhoneMappingError } from "./phone-mapper";

describe("getAuthErrorMessage", () => {
  it("maps known API error codes", () => {
    const error = new ApiError({
      status: 401,
      message: "Unauthorized",
      code: "INVALID_CREDENTIALS",
    });
    expect(getAuthErrorMessage(error)).toBe("Invalid email or password.");
  });

  it("uses phone mapping errors directly", () => {
    expect(getAuthErrorMessage(new PhoneMappingError())).toBe(
      "Enter a valid phone number with country code.",
    );
  });

  it("falls back for unknown errors", () => {
    expect(getAuthErrorMessage(new Error("boom"), "Fallback")).toBe("boom");
  });
});
