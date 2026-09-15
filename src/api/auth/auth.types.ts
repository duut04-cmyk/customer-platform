/** Backend phone response shape (derived e164 included). */
export type PhoneResponse = {
  countryCode: string;
  number: string;
  e164: string;
};

export type UserRole = "CUSTOMER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

/** Public user profile returned on login / google login. */
export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: PhoneResponse | null;
  emailVerified: boolean;
  role: UserRole;
};

/** Authenticated user from GET /auth/me (includes account status). */
export type User = PublicUser & {
  status: UserStatus;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export type AuthMessageResponse = {
  success: true;
  message: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
};

export type SignupResponse = AuthMessageResponse;

export type VerifyEmailOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyEmailOtpResponse = AuthMessageResponse;

export type ResendEmailOtpRequest = {
  email: string;
};

export type ResendEmailOtpResponse = AuthMessageResponse;

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: true;
  message: string;
  data: AuthTokens & {
    user: PublicUser;
  };
};

export type RefreshSessionRequest = {
  refreshToken: string;
};

export type RefreshResponse = {
  success: true;
  message: string;
  data: AuthTokens;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type LogoutResponse = AuthMessageResponse;

export type MeResponse = {
  success: true;
  data: {
    user: User;
  };
};

export type GoogleLoginRequest = {
  credential: string;
};

export type GoogleLoginResponse = LoginResponse;

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = AuthMessageResponse;

export type VerifyPasswordResetOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyPasswordResetOtpResponse = {
  success: true;
  data: {
    resetToken: string;
    expiresAt: string;
  };
};

export type ResendPasswordResetOtpRequest = {
  email: string;
};

export type ResendPasswordResetOtpResponse = AuthMessageResponse;

export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponse = AuthMessageResponse;
