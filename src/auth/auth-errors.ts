import { isApiError } from "@/api/errors";
import { PhoneMappingError } from "@/auth/phone-mapper";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Contact support for help.",
  ACCOUNT_DELETED: "This account is no longer available.",
  EMAIL_ALREADY_REGISTERED: "An account with this email already exists.",
  INVALID_VERIFICATION_CODE: "Invalid or expired verification code.",
  VERIFICATION_CODE_EXPIRED: "Verification code has expired. Request a new one.",
  VERIFICATION_CODE_MAX_ATTEMPTS:
    "Too many incorrect attempts. Request a new verification code.",
  OTP_RESEND_COOLDOWN: "Please wait before requesting another code.",
  PASSWORD_RESET_OTP_INVALID: "Invalid or expired verification code.",
  PASSWORD_RESET_OTP_EXPIRED: "Verification code has expired. Request a new one.",
  PASSWORD_RESET_OTP_MAX_ATTEMPTS:
    "Too many incorrect attempts. Request a new verification code.",
  PASSWORD_RESET_OTP_COOLDOWN: "Please wait before requesting another code.",
  PASSWORD_RESET_TOKEN_INVALID: "Password reset link is invalid. Start again.",
  PASSWORD_RESET_TOKEN_EXPIRED: "Password reset link has expired. Start again.",
  PASSWORD_RESET_TOKEN_USED: "This reset link was already used. Start again.",
  INVALID_REFRESH_TOKEN: "Your session has expired. Please sign in again.",
  TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  INVALID_ACCESS_TOKEN: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "Please sign in to continue.",
  GOOGLE_AUTHENTICATION_FAILED: "Google sign-in failed. Try again.",
  INVALID_GOOGLE_CREDENTIAL: "Google sign-in failed. Try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PASSWORD_SAME_AS_CURRENT:
    "New password must be different from your current password.",
  NETWORK_ERROR: "Network request failed. Check your connection and try again.",
  REQUEST_ABORTED: "Request was cancelled.",
};

export function getAuthErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof PhoneMappingError) {
    return error.message;
  }

  if (isApiError(error)) {
    if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
      return AUTH_ERROR_MESSAGES[error.code]!;
    }

    if (error.status === 0 && error.code && AUTH_ERROR_MESSAGES[error.code]) {
      return AUTH_ERROR_MESSAGES[error.code]!;
    }

    if (error.status === 429) {
      return "Too many requests. Please wait and try again.";
    }

    if (error.status >= 500) {
      return "Service is temporarily unavailable. Please try again.";
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
