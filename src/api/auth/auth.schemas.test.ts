import { describe, expect, it } from "vitest";
import { resetPasswordRequestSchema, signupRequestSchema } from "./auth.schemas";

describe("auth.schemas", () => {
  it("accepts signup with split phone fields", () => {
    const parsed = signupRequestSchema.parse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password1",
      phoneCountryCode: "+91",
      phoneNumber: "9876543210",
    });

    expect(parsed.phoneCountryCode).toBe("+91");
    expect(parsed.phoneNumber).toBe("9876543210");
  });

  it("rejects partial phone fields", () => {
    expect(() =>
      signupRequestSchema.parse({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password1",
        phoneCountryCode: "+91",
      }),
    ).toThrow();
  });

  it("validates reset password request shape", () => {
    const parsed = resetPasswordRequestSchema.parse({
      resetToken: "opaque-reset-token",
      newPassword: "newpassword",
    });
    expect(parsed.resetToken).toBe("opaque-reset-token");
  });
});
