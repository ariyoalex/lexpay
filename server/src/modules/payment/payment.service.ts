import Transaction from "../../models/Transaction";
import Wallet from "../../models/Wallet";
import { ApiError } from "../../utils/apiError";
import { balanceCacheKey, cacheDel, walletCacheKey } from "../wallet/wallet.cache";
import * as paystack from "./payment.utils";

const idempotencyStore = new Map<string, boolean>();

const checkIdempotency = (reference: string): boolean => {
  if (idempotencyStore.has(reference)) return true;
  idempotencyStore.set(reference, true);
  return false;
};

export const initializePayment = async (userId: string, email: string, amount: number) => {
  if (amount < 100) throw ApiError.badRequest("Minimum funding amount is ₦100");
  if (amount > 10000000) throw ApiError.badRequest("Maximum funding amount is ₦10,000,000");

  const reference = paystack.generatePaymentReference();

  const existingRef = await Transaction.findOne({ reference });
  if (existingRef) throw ApiError.conflict("Reference collision, please retry");

  const pendingTxn = await Transaction.create({
    reference,
    userId,
    type: "funding",
    amount,
    fee: 0,
    balanceBefore: 0,
    balanceAfter: 0,
    status: "pending",
    description: "Wallet funding via Paystack",
    metadata: { paymentMethod: "paystack" },
  });

  const initResult = await paystack.initializeTransaction(email, amount, reference, {
    userId,
    transactionId: pendingTxn._id.toString(),
  });

  return {
    authorizationUrl: initResult.data.authorization_url,
    reference,
    accessCode: initResult.data.access_code,
  };
};

export const verifyPayment = async (userId: string, reference: string) => {
  const txn = await Transaction.findOne({ reference, userId });
  if (!txn) throw ApiError.notFound("Transaction not found");
  if (txn.status === "completed") throw ApiError.badRequest("Transaction already completed");
  if (txn.status !== "pending") throw ApiError.badRequest("Transaction is not pending");

  const verified = await paystack.verifyTransaction(reference);
  const paystackData = verified.data;

  if (paystackData.status !== "success") {
    txn.status = "failed";
    txn.metadata = { ...txn.metadata, failureReason: paystackData.gateway_response };
    await txn.save();
    throw ApiError.badRequest(`Payment verification failed: ${paystackData.gateway_response}`);
  }

  const amountInNaira = paystackData.amount / 100;

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const balanceBefore = wallet.balance;

  wallet.balance += amountInNaira;
  wallet.ledgerBalance += amountInNaira;
  await wallet.save();

  txn.status = "completed";
  txn.balanceBefore = balanceBefore;
  txn.balanceAfter = wallet.balance;
  txn.metadata = {
    ...txn.metadata,
    paystackReference: paystackData.reference,
    channel: paystackData.channel,
    paidAt: paystackData.paid_at,
  } as any;
  await txn.save();

  await cacheDel(balanceCacheKey(userId));
  await cacheDel(walletCacheKey(userId));

  return {
    status: "completed",
    amount: amountInNaira,
    balanceBefore,
    balanceAfter: wallet.balance,
    reference,
  };
};

export const handleWebhook = async (event: string, body: any) => {
  if (event !== "charge.success") return { handled: false };

  const { reference } = body.data;
  if (!reference) return { handled: false };

  if (checkIdempotency(reference)) return { handled: true, idempotent: true };

  const txn = await Transaction.findOne({ reference });
  if (!txn) return { handled: false };
  if (txn.status !== "pending") return { handled: true, idempotent: true };

  const wallet = await Wallet.findOne({ userId: txn.userId });
  if (!wallet) return { handled: false };

  const amountInNaira = body.data.amount / 100;
  const balanceBefore = wallet.balance;

  wallet.balance += amountInNaira;
  wallet.ledgerBalance += amountInNaira;
  await wallet.save();

  txn.status = "completed";
  txn.balanceBefore = balanceBefore;
  txn.balanceAfter = wallet.balance;
  txn.metadata = {
    ...txn.metadata,
    paystackReference: body.data.reference,
    channel: body.data.channel,
    paidAt: body.data.paid_at,
    webhookProcessedAt: new Date().toISOString(),
  } as any;
  await txn.save();

  await cacheDel(balanceCacheKey(txn.userId.toString()));
  await cacheDel(walletCacheKey(txn.userId.toString()));

  return { handled: true };
};

export const getFundingMethods = async () => {
  return [
    {
      id: "paystack",
      name: "Paystack",
      description: "Credit/Debit Card, Bank Transfer, USSD, Mobile Money",
      icon: "paystack",
      enabled: true,
      minAmount: 100,
      maxAmount: 10000000,
    },
  ];
};
