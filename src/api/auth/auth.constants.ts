export const AUTH_ENDPOINTS = {
  signup: "/auth/signup",
  verifyOtp: "/auth/verify-otp",
  resendOtp: "/auth/resend-otp",
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  google: "/auth/google",
  forgotPassword: "/auth/forgot-password",
  verifyPasswordResetOtp: "/auth/verify-password-reset-otp",
  resendPasswordResetOtp: "/auth/resend-password-reset-otp",
  resetPassword: "/auth/reset-password",
} as const;

/** Matches backend OTP length (6 digits). */
export const AUTH_OTP_LENGTH = 6;

/** Backend resend cooldown is authoritative; UI may show a longer countdown. */
export const AUTH_BACKEND_RESEND_COOLDOWN_SECONDS = 60;
