import { del, get, post, put } from "./api";

export interface Beneficiary {
  _id: string;
  userId: string;
  name: string;
  bank: string;
  accountNumber: string;
  bankCode: string;
  isFavorite: boolean;
  isInternal: boolean;
  internalUserId?: string;
  createdAt: string;
}

export interface CreateBeneficiaryData {
  name: string;
  bank: string;
  accountNumber: string;
  bankCode: string;
}

export function listBeneficiariesApi(search?: string) {
  const params = search ? { search } : undefined;
  return get<{ success: boolean; data: Beneficiary[] }>("/beneficiaries", params);
}

export function createBeneficiaryApi(data: CreateBeneficiaryData) {
  return post<{ success: boolean; data: Beneficiary }>("/beneficiaries", data);
}

export function updateBeneficiaryApi(id: string, data: Partial<CreateBeneficiaryData>) {
  return put<{ success: boolean; data: Beneficiary }>(`/beneficiaries/${id}`, data);
}

export function deleteBeneficiaryApi(id: string) {
  return del<{ success: boolean; message: string }>(`/beneficiaries/${id}`);
}

export function toggleFavoriteApi(id: string, isFavorite: boolean) {
  return put<{ success: boolean; data: Beneficiary }>(`/beneficiaries/${id}/favorite`, { isFavorite });
}
