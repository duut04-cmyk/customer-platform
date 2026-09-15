import { apiClient } from "../client";
import { AUTH_ENDPOINTS } from "./auth.constants";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
  RefreshResponse,
  RefreshSessionRequest,
  ResendEmailOtpRequest,
  ResendEmailOtpResponse,
  ResendPasswordResetOtpRequest,
  ResendPasswordResetOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
} from "./auth.types";

export function signup(body: SignupRequest) {
  return apiClient.post<SignupResponse>(AUTH_ENDPOINTS.signup, body, {
    auth: false,
  });
}

export function verifyEmailOtp(body: VerifyEmailOtpRequest) {
  return apiClient.post<VerifyEmailOtpResponse>(AUTH_ENDPOINTS.verifyOtp, body, {
    auth: false,
  });
}

export function resendEmailOtp(body: ResendEmailOtpRequest) {
  return apiClient.post<ResendEmailOtpResponse>(AUTH_ENDPOINTS.resendOtp, body, {
    auth: false,
  });
}

export function login(body: LoginRequest) {
  return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.login, body, {
    auth: false,
  });
}

/** Low-level refresh — automatic single-flight refresh belongs in client/session layer. */
export function refreshSession(body: RefreshSessionRequest) {
  return apiClient.post<RefreshResponse>(AUTH_ENDPOINTS.refresh, body, {
    auth: false,
  });
}

export function getCurrentUser() {
  return apiClient.get<MeResponse>(AUTH_ENDPOINTS.me);
}

export function logout(body: LogoutRequest) {
  return apiClient.post<LogoutResponse>(AUTH_ENDPOINTS.logout, body, {
    auth: false,
  });
}

export function googleLogin(body: GoogleLoginRequest) {
  return apiClient.post<GoogleLoginResponse>(AUTH_ENDPOINTS.google, body, {
    auth: false,
  });
}

export function forgotPassword(body: ForgotPasswordRequest) {
  return apiClient.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, body, {
    auth: false,
  });
}

export function verifyPasswordResetOtp(body: VerifyPasswordResetOtpRequest) {
  return apiClient.post<VerifyPasswordResetOtpResponse>(
    AUTH_ENDPOINTS.verifyPasswordResetOtp,
    body,
    { auth: false },
  );
}

export function resendPasswordResetOtp(body: ResendPasswordResetOtpRequest) {
  return apiClient.post<ResendPasswordResetOtpResponse>(
    AUTH_ENDPOINTS.resendPasswordResetOtp,
    body,
    { auth: false },
  );
}

export function resetPassword(body: ResetPasswordRequest) {
  return apiClient.post<ResetPasswordResponse>(AUTH_ENDPOINTS.resetPassword, body, {
    auth: false,
  });
}
