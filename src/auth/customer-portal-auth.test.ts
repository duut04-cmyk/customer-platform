import { describe, expect, it } from "vitest";
import {
  createCustomerPortalAccessDeniedError,
  CUSTOMER_PORTAL_INVALID_CREDENTIALS_MESSAGE,
  isCustomerPortalUser,
  rejectNonCustomerForCustomerPortal,
} from "./customer-portal-auth";
import { getAuthErrorMessage } from "./auth-errors";

describe("customer portal auth", () => {
  it("accepts CUSTOMER role", () => {
    expect(isCustomerPortalUser({ role: "CUSTOMER" })).toBe(true);
    expect(() =>
      rejectNonCustomerForCustomerPortal({ role: "CUSTOMER" }),
    ).not.toThrow();
  });

  it("rejects ADMIN with generic invalid credentials", () => {
    expect(isCustomerPortalUser({ role: "ADMIN" })).toBe(false);
    try {
      rejectNonCustomerForCustomerPortal({ role: "ADMIN" });
      expect.unreachable("expected throw");
    } catch (error) {
      expect(getAuthErrorMessage(error)).toBe(
        CUSTOMER_PORTAL_INVALID_CREDENTIALS_MESSAGE,
      );
    }
  });

  it("maps access denied error to INVALID_CREDENTIALS", () => {
    const error = createCustomerPortalAccessDeniedError();
    expect(error.code).toBe("INVALID_CREDENTIALS");
    expect(getAuthErrorMessage(error)).toBe(
      CUSTOMER_PORTAL_INVALID_CREDENTIALS_MESSAGE,
    );
  });
});
