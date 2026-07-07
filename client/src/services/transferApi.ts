import { get, post } from "./api";

export interface InternalTransferData {
  recipientEmail?: string;
  recipientPhone?: string;
  amount: number;
  description?: string;
  pin: string;
  otpCode?: string;
}

export interface ExternalTransferData {
  beneficiaryId: string;
  amount: number;
  description?: string;
  pin: string;
  otpCode?: string;
}

export interface TransferResult {
  reference: string;
  amount: number;
  fee: number;
  totalDebit: number;
  senderBalanceBefore: number;
  senderBalanceAfter: number;
  recipient?: string;
  beneficiary?: string;
}

export interface FeeCalculation {
  amount: number;
  fee: number;
  total: number;
  type: string;
}

export function internalTransferApi(data: InternalTransferData) {
  return post<{ success: boolean; data: TransferResult }>("/transfers/internal", data);
}

export function externalTransferApi(data: ExternalTransferData) {
  return post<{ success: boolean; data: TransferResult }>("/transfers/external", data);
}

export function calculateFeesApi(amount: number, type: "internal" | "external") {
  return get<{ success: boolean; data: FeeCalculation }>(`/transfers/fees?amount=${amount}&type=${type}`);
}

export function requestTransferOtpApi() {
  return post<{ success: boolean; data: { message: string } }>("/transfers/otp");
}
