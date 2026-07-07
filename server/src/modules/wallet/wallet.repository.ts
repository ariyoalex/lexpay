import Transaction, { ITransaction } from "../../models/Transaction";
import Wallet, { IWallet } from "../../models/Wallet";
import { ApiError } from "../../utils/apiError";

export interface BalanceUpdateResult {
  wallet: IWallet;
  transaction: ITransaction;
}

export const findWalletByUserId = async (userId: string): Promise<IWallet> => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId });
  }
  return wallet;
};

const generateReference = (): string => {
  return "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const atomicCredit = async (
  userId: string,
  amount: number,
  type: ITransaction["type"],
  description?: string,
  metadata?: Record<string, any>,
): Promise<BalanceUpdateResult> => {
  const reference = generateReference();

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount, ledgerBalance: amount } },
    { new: true },
  );
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const balanceBefore = wallet.balance - amount;
  const balanceAfter = wallet.balance;

  const transaction = await Transaction.create({
    reference,
    userId,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    status: "completed",
    description,
    metadata,
  });

  return { wallet, transaction };
};

export const atomicDebit = async (
  userId: string,
  amount: number,
  type: ITransaction["type"],
  description?: string,
  metadata?: Record<string, any>,
): Promise<BalanceUpdateResult> => {
  const reference = generateReference();

  const wallet = await Wallet.findOneAndUpdate(
    { userId, balance: { $gte: amount }, isFrozen: { $ne: true } },
    { $inc: { balance: -amount, ledgerBalance: -amount } },
    { new: true },
  );
  if (!wallet) {
    const existing = await Wallet.findOne({ userId });
    if (!existing) throw ApiError.notFound("Wallet not found");
    if (existing.isFrozen) throw ApiError.badRequest("Wallet is frozen");
    throw ApiError.badRequest("Insufficient balance");
  }

  const balanceBefore = wallet.balance + amount;
  const balanceAfter = wallet.balance;

  const transaction = await Transaction.create({
    reference,
    userId,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    status: "completed",
    description,
    metadata,
  });

  return { wallet, transaction };
};
