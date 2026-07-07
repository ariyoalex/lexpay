import { get, post } from "./api";

export interface InitializeResponse {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface VerifyResponse {
  status: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
}

export interface FundingMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
}

export function initializePaymentApi(amount: number) {
  return post<{ success: boolean; data: InitializeResponse }>("/payments/initialize", { amount });
}

export function verifyPaymentApi(reference: string) {
  return post<{ success: boolean; data: VerifyResponse }>("/payments/verify", { reference });
}

export function getFundingMethodsApi() {
  return get<{ success: boolean; data: FundingMethod[] }>("/payments/methods");
}
