import { post } from "./api";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
}

export interface LoginResponse extends AuthTokens {
  user: UserResponse;
}

export interface RegisterResponse {
  userId: string;
}

export function registerApi(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) {
  return post<RegisterResponse>("/auth/register", data);
}

export function loginApi(data: { email: string; password: string }) {
  return post<LoginResponse>("/auth/login", data);
}

export function logoutApi(refreshToken: string) {
  return post<void>("/auth/logout", { refreshToken });
}

export function refreshTokenApi(refreshToken: string) {
  return post<AuthTokens>("/auth/refresh-token", { refreshToken });
}

export function verifyEmailApi(data: { email: string; code: string }) {
  return post<void>("/auth/verify-email", data);
}

export function verifyPhoneApi(data: { phone: string; code: string }) {
  return post<void>("/auth/verify-phone", data);
}

export function forgotPasswordApi(data: { email: string }) {
  return post<void>("/auth/forgot-password", data);
}

export function resetPasswordApi(data: { email: string; code: string; password: string }) {
  return post<void>("/auth/reset-password", data);
}

export function enable2FAApi(password: string) {
  return post<void>("/auth/enable-2fa", { password });
}

export function verify2FAApi(code: string) {
  return post<void>("/auth/verify-2fa", { code });
}
