import Beneficiary from "../../models/Beneficiary";
import OTP from "../../models/OTP";
import Transaction from "../../models/Transaction";
import User from "../../models/User";
import Wallet from "../../models/Wallet";
import { ApiError } from "../../utils/apiError";
import { decryptPin } from "../../utils/encryption";
import { generateOtp, hashOtp, verifyOtpHash } from "../auth/auth.utils";
import { createAndEmit } from "../notification/notification.service";

const OTP_THRESHOLD = 50000;

const generateReference = (prefix: string): string => {
  return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const verifyPin = (user: any, pin: string): void => {
  if (!user.pin) throw ApiError.badRequest("PIN not set. Please set a PIN first.");
  const decrypted = decryptPin(user.pin);
  if (decrypted !== pin) throw ApiError.badRequest("Invalid PIN");
};

const verifyOtp = async (userId: string, code: string): Promise<void> => {
  const otpRecord = await OTP.findOne({ userId, type: "transfer", isUsed: false }).sort({ createdAt: -1 });
  if (!otpRecord) throw ApiError.badRequest("No OTP found. Request a new one.");
  if (otpRecord.expiresAt < new Date()) throw ApiError.badRequest("OTP has expired");
  if (otpRecord.attempts >= otpRecord.maxAttempts) throw ApiError.badRequest("OTP max attempts exceeded");

  if (!verifyOtpHash(code, otpRecord.code)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest("Invalid OTP code");
  }

  otpRecord.isUsed = true;
  await otpRecord.save();
};

const sendTransferOtp = async (userId: string): Promise<string> => {
  const code = generateOtp(6);
  const hashed = hashOtp(code);
  await OTP.create({
    userId,
    type: "transfer",
    code: hashed,
    attempts: 0,
    maxAttempts: 5,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  return code;
};

export const initiateInternalTransfer = async (
  senderId: string,
  data: {
    recipientEmail?: string;
    recipientPhone?: string;
    amount: number;
    description?: string;
    pin: string;
    otpCode?: string;
  },
) => {
  if (!data.recipientEmail && !data.recipientPhone) {
    throw ApiError.badRequest("Recipient email or phone is required");
  }

  const sender = await User.findById(senderId);
  if (!sender) throw ApiError.notFound("Sender not found");
  if (!sender.isActive) throw ApiError.forbidden("Account is not active");

  verifyPin(sender, data.pin);

  if (data.amount >= OTP_THRESHOLD && !data.otpCode) {
    const otp = await sendTransferOtp(senderId);
    throw ApiError.badRequest(`OTP required for amounts above ₦${OTP_THRESHOLD.toLocaleString()}. OTP sent: ${otp}`);
  }

  if (data.amount >= OTP_THRESHOLD && data.otpCode) {
    await verifyOtp(senderId, data.otpCode);
  }

  const recipientQuery = data.recipientEmail ? { email: data.recipientEmail } : { phone: data.recipientPhone };
  const recipient = await User.findOne(recipientQuery);
  if (!recipient) throw ApiError.notFound("Recipient not found");
  if (recipient._id.toString() === senderId) throw ApiError.badRequest("Cannot transfer to yourself");

  const senderWallet = await Wallet.findOne({ userId: senderId });
  if (!senderWallet) throw ApiError.notFound("Sender wallet not found");
  if (senderWallet.isFrozen) throw ApiError.badRequest("Your wallet is frozen");

  const recipientWallet = await Wallet.findOne({ userId: recipient._id });
  if (!recipientWallet) throw ApiError.notFound("Recipient wallet not found");

  if (senderWallet.balance < data.amount) throw ApiError.badRequest("Insufficient balance");

  const fee = Math.round(data.amount * 0.005);
  const totalDebit = data.amount + fee;
  if (senderWallet.balance < totalDebit) throw ApiError.badRequest("Insufficient balance (including fee)");

  const reference = generateReference("TRF-");

  const senderBalanceBefore = senderWallet.balance;
  senderWallet.balance -= totalDebit;
  senderWallet.ledgerBalance -= totalDebit;
  await senderWallet.save();

  const recipientBalanceBefore = recipientWallet.balance;
  recipientWallet.balance += data.amount;
  recipientWallet.ledgerBalance += data.amount;
  await recipientWallet.save();

  await Transaction.create({
    reference,
    userId: senderId,
    type: "transfer_out",
    amount: data.amount,
    fee,
    balanceBefore: senderBalanceBefore,
    balanceAfter: senderWallet.balance,
    status: "completed",
    description: data.description || `Transfer to ${recipient.email || recipient.phone}`,
    metadata: { recipientId: recipient._id },
  });

  await Transaction.create({
    reference: reference + "-IN",
    userId: recipient._id,
    type: "transfer_in",
    amount: data.amount,
    fee: 0,
    balanceBefore: recipientBalanceBefore,
    balanceAfter: recipientWallet.balance,
    status: "completed",
    description: `Transfer from ${sender.email}`,
    metadata: { senderId: sender._id },
  });

  createAndEmit(
    senderId.toString(),
    "Transfer Sent",
    `₦${data.amount.toLocaleString()} sent to ${recipient.email || recipient.phone}. Fee: ₦${fee.toLocaleString()}`,
    { reference },
  );
  createAndEmit(
    recipient._id.toString(),
    "Transfer Received",
    `₦${data.amount.toLocaleString()} received from ${sender.email}`,
    { reference },
  );

  return {
    reference,
    amount: data.amount,
    fee,
    totalDebit,
    senderBalanceBefore,
    senderBalanceAfter: senderWallet.balance,
    recipient: recipient.email || recipient.phone,
  };
};

export const initiateExternalTransfer = async (
  userId: string,
  data: { beneficiaryId: string; amount: number; description?: string; pin: string; otpCode?: string },
) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  verifyPin(user, data.pin);

  if (data.amount >= OTP_THRESHOLD && !data.otpCode) {
    const otp = await sendTransferOtp(userId);
    throw ApiError.badRequest(`OTP required for amounts above ₦${OTP_THRESHOLD.toLocaleString()}. OTP sent: ${otp}`);
  }

  if (data.amount >= OTP_THRESHOLD && data.otpCode) {
    await verifyOtp(userId, data.otpCode);
  }

  const beneficiary = await Beneficiary.findOne({ _id: data.beneficiaryId, userId });
  if (!beneficiary) throw ApiError.notFound("Beneficiary not found");

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw ApiError.notFound("Wallet not found");
  if (wallet.isFrozen) throw ApiError.badRequest("Your wallet is frozen");

  const fee = Math.round(data.amount * 0.01);
  const totalDebit = data.amount + fee;
  if (wallet.balance < totalDebit) throw ApiError.badRequest("Insufficient balance (including fee)");

  const reference = generateReference("EXT-");
  const balanceBefore = wallet.balance;
  wallet.balance -= totalDebit;
  wallet.ledgerBalance -= totalDebit;
  await wallet.save();

  await Transaction.create({
    reference,
    userId,
    type: "withdrawal",
    amount: data.amount,
    fee,
    balanceBefore,
    balanceAfter: wallet.balance,
    status: "pending",
    description: data.description || `External transfer to ${beneficiary.name}`,
    metadata: {
      recipientAccountName: beneficiary.name,
      recipientAccountNumber: beneficiary.accountNumber,
      recipientBank: beneficiary.bank,
    },
  });

  return {
    reference,
    amount: data.amount,
    fee,
    totalDebit,
    balanceBefore,
    balanceAfter: wallet.balance,
    beneficiary: beneficiary.name,
  };
};

export const calculateFees = async (amount: number, type: "internal" | "external") => {
  const rate = type === "internal" ? 0.005 : 0.01;
  const fee = Math.round(amount * rate);
  return { amount, fee, total: amount + fee, type };
};

export const requestTransferOtp = async (userId: string) => {
  const code = await sendTransferOtp(userId);
  return { message: "OTP sent", otp: code };
};
