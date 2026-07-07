import { get, post, put } from "./api";

export interface KycStatus {
  kycLevel: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  kycSubmission: {
    _id: string;
    level: number;
    status: "pending" | "approved" | "rejected";
    idType: string;
    idNumber: string;
    rejectionReason?: string;
    submittedAt: string;
    reviewedAt?: string;
  } | null;
  canUpgrade: boolean;
}

export interface PendingKycItem {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  level: number;
  status: "pending";
  idType: string;
  idNumber: string;
  submittedAt: string;
}

export function getKycStatusApi() {
  return get<{ success: boolean; data: KycStatus }>("/kyc/status");
}

export function submitKycApi(formData: FormData) {
  return post<{ success: boolean; data: any }>("/kyc/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function reviewKycApi(kycId: string, status: "approved" | "rejected", rejectionReason?: string) {
  return put(`/kyc/${kycId}/review`, { status, rejectionReason });
}

export function listPendingKycApi(page = 1) {
  return get<{ success: boolean; data: PendingKycItem[]; meta: any }>(`/kyc/pending?page=${page}`);
}
