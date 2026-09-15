import { z } from "zod";
import { AUTH_OTP_LENGTH } from "./auth.constants";

const countryCodeSchema = z
  .string()
  .trim()
  .regex(/^\+\d{1,4}$/, "Country code must start with + followed by digits");

const nationalNumberSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .max(14, "Phone number is too long");

export const phoneFieldsSchema = z
  .object({
    phoneCountryCode: countryCodeSchema,
    phoneNumber: nationalNumberSchema,
  })
  .strict();

export const optionalPhoneFieldsSchema = z
  .object({
    phoneCountryCode: z.preprocess(emptyToUndefined, countryCodeSchema.optional()),
    phoneNumber: z.preprocess(emptyToUndefined, nationalNumberSchema.optional()),
  })
  .superRefine((value, ctx) => {
    const hasCountry = value.phoneCountryCode !== undefined;
    const hasNumber = value.phoneNumber !== undefined;
    if (hasCountry !== hasNumber) {
      ctx.addIssue({
        code: "custom",
        message: "Both phoneCountryCode and phoneNumber are required together",
        path: hasCountry ? ["phoneNumber"] : ["phoneCountryCode"],
      });
    }
  });

function emptyToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export const passwordFieldSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const signupRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(100, "Name is too long"),
    email: z.string().trim().email("Invalid email address"),
    password: passwordFieldSchema,
    phoneCountryCode: z.preprocess(emptyToUndefined, countryCodeSchema.optional()),
    phoneNumber: z.preprocess(emptyToUndefined, nationalNumberSchema.optional()),
  })
  .superRefine((data, ctx) => {
    const hasCountry = Boolean(data.phoneCountryCode);
    const hasNumber = Boolean(data.phoneNumber);
    if (hasCountry !== hasNumber) {
      ctx.addIssue({
        code: "custom",
        message: "Both phoneCountryCode and phoneNumber are required together",
        path: hasCountry ? ["phoneNumber"] : ["phoneCountryCode"],
      });
    }
  });

export const verifyEmailOtpRequestSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{${AUTH_OTP_LENGTH}}$`),
      `Verification code must be ${AUTH_OTP_LENGTH} digits`,
    ),
});

export const resendEmailOtpRequestSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const loginRequestSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required").max(128),
});

export const refreshSessionRequestSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

export const logoutRequestSchema = refreshSessionRequestSchema;

export const googleLoginRequestSchema = z.object({
  credential: z.string().trim().min(1, "Google credential is required"),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const verifyPasswordResetOtpRequestSchema = verifyEmailOtpRequestSchema;

export const resendPasswordResetOtpRequestSchema = resendEmailOtpRequestSchema;

export const resetPasswordRequestSchema = z.object({
  resetToken: z.string().trim().min(1, "Reset token is required"),
  newPassword: passwordFieldSchema,
});

export type SignupRequestInput = z.infer<typeof signupRequestSchema>;
export type LoginRequestInput = z.infer<typeof loginRequestSchema>;
