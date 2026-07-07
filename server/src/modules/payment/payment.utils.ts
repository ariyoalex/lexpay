import config from "../../config";
import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

interface PaystackInitData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaystackVerifyData {
  id: number;
  reference: string;
  amount: number;
  status: string;
  gateway_response: string;
  paid_at: string;
  channel: string;
  currency: string;
  fees: number;
  customer: {
    email: string;
    phone?: string;
  };
  metadata?: any;
}

interface PaystackApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

const getHeaders = () => ({
  Authorization: `Bearer ${config.paystack.secretKey}`,
  "Content-Type": "application/json",
});

export const initializeTransaction = async (
  email: string,
  amount: number,
  reference: string,
  metadata?: Record<string, any>,
): Promise<PaystackApiResponse<PaystackInitData>> => {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      reference,
      metadata,
    }),
  });

  const body = (await res.json()) as PaystackApiResponse<PaystackInitData>;
  if (!body.status) {
    throw new Error(`Paystack init failed: ${body.message}`);
  }
  return body;
};

export const verifyTransaction = async (reference: string): Promise<PaystackApiResponse<PaystackVerifyData>> => {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const body = (await res.json()) as PaystackApiResponse<PaystackVerifyData>;
  if (!body.status) {
    throw new Error(`Paystack verify failed: ${body.message}`);
  }
  return body;
};

export const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  const hash = crypto.createHmac("sha512", config.paystack.secretKey).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
};

export const generatePaymentReference = (): string => {
  return (
    "PAY-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  );
};
