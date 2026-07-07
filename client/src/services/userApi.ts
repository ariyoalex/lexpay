import { del, get, put } from "./api";
import type { UserResponse } from "./authApi";

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profile?: {
    address?: string;
    dateOfBirth?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePinData {
  currentPin?: string;
  newPin: string;
}

export interface Session {
  _id: string;
  userId: string;
  deviceInfo: {
    name?: string;
    type?: string;
    os?: string;
    browser?: string;
  };
  ip?: string;
  location?: string;
  isActive: boolean;
  lastActivity?: string;
  createdAt: string;
}

export function getProfileApi() {
  return get<{ success: boolean; data: UserResponse }>("/users/profile");
}

export function updateProfileApi(data: UpdateProfileData) {
  return put<{ success: boolean; data: UserResponse }>("/users/profile", data);
}

export function changePasswordApi(data: ChangePasswordData) {
  return put<{ success: boolean; message: string }>("/users/password", data);
}

export function changePinApi(data: ChangePinData) {
  return put<{ success: boolean; message: string }>("/users/pin", data);
}

export function getSessionsApi() {
  return get<{ success: boolean; data: Session[] }>("/users/sessions");
}

export function revokeSessionApi(sessionId: string) {
  return del<{ success: boolean; message: string }>(`/users/sessions/${sessionId}`);
}
